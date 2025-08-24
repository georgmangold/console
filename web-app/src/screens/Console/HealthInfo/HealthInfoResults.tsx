import React, { useState } from "react";
import {
  Box,
  Tabs,
  CollapseIcon,
  Accordion,
  CodeIcon,
  Button,
  DownloadIcon,
} from "mds";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import { HealthInfoMessage } from "./types";

interface IHealthInfoResults {
  serverHealthInfo: HealthInfoMessage;
}

const HealthInfoResults = ({ serverHealthInfo }: IHealthInfoResults) => {
  const [curTab, setCurTab] = useState<string>("tab-details");
  const [systemHealhExpanded, setSystemHealhExpanded] =
    useState<boolean>(false);
  const [systemHealhCPUExpanded, setSystemHealhCPUExpanded] =
    useState<boolean>(false);
  const [systemHealhPartitionsExpanded, setSystemHealhPartitionsExpanded] =
    useState<boolean>(false);
  const [systemHealhOSInfoExpanded, setSystemHealhOSInfoExpanded] =
    useState<boolean>(false);
  const [systemHealhMeminfoExpanded, setSystemHealhMeminfoExpanded] =
    useState<boolean>(false);
  const [systemHealhProcinfoExpanded, setSystemHealhProcinfoExpanded] =
    useState<boolean>(false);
  const [systemHealhNetinfoExpanded, setSystemHealhNetinfoExpanded] =
    useState<boolean>(false);
  const [systemHealhErrorsExpanded, setSystemHealhErrorsExpanded] =
    useState<boolean>(false);
  const [systemHealhServicesExpanded, setSystemHealhServicesExpanded] =
    useState<boolean>(false);
  const [systemHealhConfigExpanded, setSystemHealhConfigExpanded] =
    useState<boolean>(false);
  const [minioHealhExpanded, setMinioHealhExpanded] = useState<boolean>(false);
  const [minioHealhConfigExpanded, setMinioHealhConfigExpanded] =
    useState<boolean>(false);
  const [minioHealhInfoExpanded, setMinioHealhInfoExpanded] =
    useState<boolean>(false);
  const [minioHealhInfoBackendExpanded, setMinioHealhInfoBackendExpanded] =
    useState<boolean>(false);
  const [minioHealhInfoServersExpanded, setMinioHealhInfoServersExpanded] =
    useState<boolean>(false);
  const [minioHealhInfoMetricsExpanded, setMinioHealhInfoMetricsExpanded] =
    useState<boolean>(false);

  const downloadJSON = () => {
    const date = new Date();
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," + JSON.stringify(serverHealthInfo),
    );
    element.setAttribute(
      "download",
      `health_results-${date.toISOString()}.json`,
    );

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        marginBottom: 25,
      }}
    >
      <Tabs
        currentTabOrPath={curTab}
        onTabClick={(newValue: string) => {
          setCurTab(newValue);
        }}
        horizontal
        horizontalBarBackground
        options={[
          {
            tabConfig: {
              icon: <CollapseIcon />,
              id: "tab-details",
              label: "Health Info (Preview)",
            },
            content: (
              <>
                <Accordion
                  title={"System Health Info"}
                  id={"system-health-info"}
                  expanded={systemHealhExpanded}
                  onTitleClick={() =>
                    setSystemHealhExpanded(!systemHealhExpanded)
                  }
                  sx={{ marginTop: 0 }}
                >
                  <Accordion
                    title={"CPU Info"}
                    id={"cpu-info"}
                    expanded={systemHealhCPUExpanded}
                    onTitleClick={() =>
                      setSystemHealhCPUExpanded(!systemHealhCPUExpanded)
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(serverHealthInfo.sys.cpus, null, 4)}
                      editorHeight={"850px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                  <Accordion
                    title={"Drives Partitions Info"}
                    id={"drives-partitions-info"}
                    expanded={systemHealhPartitionsExpanded}
                    onTitleClick={() =>
                      setSystemHealhPartitionsExpanded(
                        !systemHealhPartitionsExpanded,
                      )
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.sys.partitions,
                        null,
                        4,
                      )}
                      editorHeight={"850px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                  <Accordion
                    title={"OS Info"}
                    id={"os-info"}
                    expanded={systemHealhOSInfoExpanded}
                    onTitleClick={() =>
                      setSystemHealhOSInfoExpanded(!systemHealhOSInfoExpanded)
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.sys.osinfo,
                        null,
                        4,
                      )}
                      editorHeight={"850px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                  <Accordion
                    title={"Memory Info"}
                    id={"memory-info"}
                    expanded={systemHealhMeminfoExpanded}
                    onTitleClick={() =>
                      setSystemHealhMeminfoExpanded(!systemHealhMeminfoExpanded)
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.sys.meminfo,
                        null,
                        4,
                      )}
                      editorHeight={"450px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                  <Accordion
                    title={"Process Info"}
                    id={"process-info"}
                    expanded={systemHealhProcinfoExpanded}
                    onTitleClick={() =>
                      setSystemHealhProcinfoExpanded(
                        !systemHealhProcinfoExpanded,
                      )
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.sys.procinfo,
                        null,
                        4,
                      )}
                      editorHeight={"850px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                  <Accordion
                    title={"Network Info"}
                    id={"network-info"}
                    expanded={systemHealhNetinfoExpanded}
                    onTitleClick={() =>
                      setSystemHealhNetinfoExpanded(!systemHealhNetinfoExpanded)
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.sys.netinfo,
                        null,
                        4,
                      )}
                      editorHeight={"450px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                  <Accordion
                    title={"Erros"}
                    id={"errors-info"}
                    expanded={systemHealhErrorsExpanded}
                    onTitleClick={() =>
                      setSystemHealhErrorsExpanded(!systemHealhErrorsExpanded)
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.sys.errors,
                        null,
                        4,
                      )}
                      editorHeight={"250px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                  <Accordion
                    title={"Services"}
                    id={"services-info"}
                    expanded={systemHealhServicesExpanded}
                    onTitleClick={() =>
                      setSystemHealhServicesExpanded(
                        !systemHealhServicesExpanded,
                      )
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.sys.services,
                        null,
                        4,
                      )}
                      editorHeight={"450px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                  <Accordion
                    title={"Server Config"}
                    id={"config-info"}
                    expanded={systemHealhConfigExpanded}
                    onTitleClick={() =>
                      setSystemHealhConfigExpanded(!systemHealhConfigExpanded)
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.sys.config,
                        null,
                        4,
                      )}
                      editorHeight={"450px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                </Accordion>
                <Accordion
                  title={"MinIO Health Info"}
                  id={"minio-health"}
                  expanded={minioHealhExpanded}
                  onTitleClick={() =>
                    setMinioHealhExpanded(!minioHealhExpanded)
                  }
                  sx={{ marginTop: 10 }}
                >
                  <Accordion
                    title={"Info"}
                    id={"minio-health-info"}
                    expanded={minioHealhInfoExpanded}
                    onTitleClick={() =>
                      setMinioHealhInfoExpanded(!minioHealhInfoExpanded)
                    }
                    sx={{ marginTop: 10 }}
                  >
                    <Box
                      useBackground
                      sx={{ margin: "10px 0px", padding: "5px" }}
                    >
                      Mode: {serverHealthInfo.minio.info.mode}
                      <br></br>
                      deploymentID: {serverHealthInfo.minio.info.deploymentID}
                      <br></br>
                      Buckets: {serverHealthInfo.minio.info.buckets.count}&emsp;
                      Objects: {serverHealthInfo.minio.info.objects.count}&emsp;
                      Usage: {serverHealthInfo.minio.info.usage.size} Bytes
                      <br></br>
                    </Box>
                    <Accordion
                      title={"Backend"}
                      id={"minio-backend-info"}
                      expanded={minioHealhInfoBackendExpanded}
                      onTitleClick={() =>
                        setMinioHealhInfoBackendExpanded(
                          !minioHealhInfoBackendExpanded,
                        )
                      }
                      sx={{ marginTop: 5 }}
                    >
                      <CodeMirrorWrapper
                        label={""}
                        value={JSON.stringify(
                          serverHealthInfo.minio.info.backend,
                          null,
                          4,
                        )}
                        editorHeight={"300px"}
                        onChange={() => {}}
                        readOnly={true}
                      />
                    </Accordion>
                    <Accordion
                      title={"Servers"}
                      id={"minio-info-servers"}
                      expanded={minioHealhInfoServersExpanded}
                      onTitleClick={() =>
                        setMinioHealhInfoServersExpanded(
                          !minioHealhInfoServersExpanded,
                        )
                      }
                      sx={{ marginTop: 0 }}
                    >
                      <CodeMirrorWrapper
                        label={""}
                        value={JSON.stringify(
                          serverHealthInfo.minio.info.servers,
                          null,
                          4,
                        )}
                        editorHeight={"450px"}
                        onChange={() => {}}
                        readOnly={true}
                      />
                    </Accordion>
                    <Accordion
                      title={"Metrics"}
                      id={"minio-info-metrics"}
                      expanded={minioHealhInfoMetricsExpanded}
                      onTitleClick={() =>
                        setMinioHealhInfoMetricsExpanded(
                          !minioHealhInfoMetricsExpanded,
                        )
                      }
                      sx={{ marginTop: 0 }}
                    >
                      <CodeMirrorWrapper
                        label={""}
                        value={JSON.stringify(
                          serverHealthInfo.minio.info.metrics,
                          null,
                          4,
                        )}
                        editorHeight={"400px"}
                        onChange={() => {}}
                        readOnly={true}
                      />
                    </Accordion>
                  </Accordion>
                  <Accordion
                    title={"Config"}
                    id={"minio-health-config"}
                    expanded={minioHealhConfigExpanded}
                    onTitleClick={() =>
                      setMinioHealhConfigExpanded(!minioHealhConfigExpanded)
                    }
                    sx={{ marginTop: 0 }}
                  >
                    <CodeMirrorWrapper
                      label={""}
                      value={JSON.stringify(
                        serverHealthInfo.minio.config.config,
                        null,
                        4,
                      )}
                      editorHeight={"800px"}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </Accordion>
                </Accordion>
              </>
            ),
          },
          {
            tabConfig: {
              icon: <CodeIcon />,
              id: "tab-raw",
              label: "RAW JSON",
            },
            content: (
              <Box>
                <Button
                  label="Download JSON"
                  id={"download-results"}
                  aria-label="Download JSON"
                  onClick={downloadJSON}
                  icon={<DownloadIcon />}
                  variant="callAction"
                />
                <CodeMirrorWrapper
                  label={`Server Health Info`}
                  value={JSON.stringify(serverHealthInfo, null, 4)}
                  editorHeight={"850px"}
                  onChange={() => {}}
                  readOnly={true}
                />
              </Box>
            ),
          },
        ]}
      />
    </Box>
  );
};

export default HealthInfoResults;
