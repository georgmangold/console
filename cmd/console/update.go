// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

package main

import (
	"bufio"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"runtime"
	"strings"
	"time"

	"github.com/blang/semver/v4"
	"github.com/cheggaaa/pb/v3"
	"github.com/minio/cli"
	"github.com/minio/console/pkg"
	"github.com/minio/selfupdate"
)

func getUpdateTransport(timeout time.Duration) http.RoundTripper {
	var updateTransport http.RoundTripper = &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   timeout,
			KeepAlive: timeout,
			DualStack: true,
		}).DialContext,
		IdleConnTimeout:       timeout,
		TLSHandshakeTimeout:   timeout,
		ExpectContinueTimeout: timeout,
		DisableCompression:    true,
	}
	return updateTransport
}

func getUpdateReaderFromURL(u string, transport http.RoundTripper) (io.ReadCloser, int64, error) {
	clnt := &http.Client{
		Transport: transport,
	}
	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return nil, -1, err
	}

	resp, err := clnt.Do(req)
	if err != nil {
		return nil, -1, err
	}
	return resp.Body, resp.ContentLength, nil
}

// const defaultPubKey = "RWTx5Zr1tiHQLwG9keckT0c45M3AGeHD6IvimQHpyRywVWGbP1aVSGav"

func getLatestRelease(tr http.RoundTripper) (string, error) {
	releaseURL := "https://api.github.com/repos/georgmangold/console/releases/latest"

	body, _, err := getUpdateReaderFromURL(releaseURL, tr)
	if err != nil {
		return "", fmt.Errorf("unable to access github release URL %w", err)
	}
	defer body.Close()

	lm := make(map[string]interface{})
	if err = json.NewDecoder(body).Decode(&lm); err != nil {
		return "", err
	}
	rel, ok := lm["tag_name"].(string)
	if !ok {
		return "", errors.New("unable to find latest release tag")
	}
	return rel, nil
}

func fetchChecksum(url, filename string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to fetch checksum file: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("bad status code: %d", resp.StatusCode)
	}

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := scanner.Text()
		parts := strings.Fields(line)
		if len(parts) != 2 {
			continue
		}
		if parts[1] == filename {
			return parts[0], nil
		}
	}

	return "", errors.New("checksum not found for binary")
}

// IsDocker - returns if the environment minio is running in docker or
// not. The check is a simple file existence check.
//
// https://github.com/moby/moby/blob/master/daemon/initlayer/setup_unix.go
// https://github.com/containers/podman/blob/master/libpod/runtime.go
//
//	"/.dockerenv":        "file",
//	"/run/.containerenv": "file",
func IsDocker() bool {
	var err error
	for _, envfile := range []string{
		"/.dockerenv",
		"/run/.containerenv",
	} {
		_, err = os.Stat(envfile)
		if err == nil {
			return true
		}
	}

	// Log error, as we will not propagate it to caller
	return err == nil
}

// update console in-place
var updateCmd = cli.Command{
	Name:   "update",
	Usage:  "update console to latest release",
	Action: updateInplace,
}

func updateInplace(_ *cli.Context) error {
	transport := getUpdateTransport(30 * time.Second)
	rel, err := getLatestRelease(transport)
	if err != nil {
		return err
	}

	latest, err := semver.Make(strings.TrimPrefix(rel, "v"))
	if err != nil {
		return err
	}

	current, err := semver.Make(pkg.Version)
	if err != nil {
		return err
	}

	if current.GTE(latest) {
		fmt.Printf("You are already running the latest version v%v.\n", pkg.Version)
		return nil
	}

	// Check if we are docker environment, return docker update command
	if IsDocker() {
		fmt.Println("Your are running 'console' inside a cointainer use:")
		fmt.Printf("docker pull ghcr.io/georgmangold/console:%s\n", rel)
		return nil
	}

	platformFile := fmt.Sprintf("console-%s-%s", runtime.GOOS, runtime.GOARCH)
	checksumURL := fmt.Sprintf("https://github.com/georgmangold/console/releases/download/%s/console_%s_checksums.txt", rel, latest)
	consoleBin := fmt.Sprintf("https://github.com/georgmangold/console/releases/download/%s/%s", rel, platformFile)

	fmt.Printf("Downloading checksum file: %s\n", checksumURL)
	expectedChecksum, err := fetchChecksum(checksumURL, platformFile)
	if err != nil {
		return fmt.Errorf("could not fetch checksum: %w", err)
	}

	checksum, err := hex.DecodeString(expectedChecksum)
	if err != nil {
		return err
	}

	reader, length, err := getUpdateReaderFromURL(consoleBin, transport)
	if err != nil {
		return fmt.Errorf("unable to fetch binary from %s: %w", consoleBin, err)
	}

	// minisignPubkey := os.Getenv("CONSOLE_MINISIGN_PUBKEY")
	// if minisignPubkey == "" {
	//	minisignPubkey = defaultPubKey
	//}

	// v := selfupdate.NewVerifier()
	// if err = v.LoadFromURL(consoleBin+".minisig", minisignPubkey, transport); err != nil {
	//	return fmt.Errorf("unable to fetch binary signature for %s: %w", consoleBin, err)
	//}

	opts := selfupdate.Options{
		Verifier: nil, // v
		Checksum: checksum,
	}

	fmt.Printf("Downloading file: %s\n", consoleBin)
	tmpl := `{{ red "Downloading:" }} {{bar . (red "[") (green "=") (red "]")}} {{speed . | rndcolor }}`
	bar := pb.ProgressBarTemplate(tmpl).Start64(length)
	barReader := bar.NewProxyReader(reader)
	if err = selfupdate.Apply(barReader, opts); err != nil {
		bar.Finish()
		fmt.Println("unable to update binary: %w", err)
		if rerr := selfupdate.RollbackError(err); rerr != nil {
			return fmt.Errorf("unable to update binary: %w", rerr)
		}
		return err
	}

	bar.Finish()
	fmt.Printf("Updated 'console' to latest release %s\n", rel)
	return nil
}
