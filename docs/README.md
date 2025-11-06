# Docs

More documentation to read

- [OIDC](OIDC.md)
- [LDAP](ldap/LDAP.md)
- [systemd](../systemd/README.md)
- [TLS](TLS.md)
- [Debug Logging](Debug.md)
- [Environment Variables](Environment.md)
- **Development**
    - [DEVELOPMENT](../DEVELOPMENT.md)
    - [Frontend Web App](../web-app/README.md)
    - [CONTRIBUTING](../CONTRIBUTING.md)

## FAQ

### How do I log in?
Console uses the same users as minio, it just passes the login you enter to the minio server.

Its the users you will see with the mc command below, the same user you would login to the now object browser only and you can always use your set minio admin.
``` bash
mc admin user ls
```
These are NOT the access keys that every users can create themselves and you will get with
``` bash
mc admin accesskey ls
```

### Cant login, get error wrong region?
``` bash
ErrorWithContext:The authorization header is malformed; the region is wrong; expecting 'us-east-1'.
%!(EXTRA *errors.errorString=invalid login)
```
Set the console region variable `CONSOLE_MINIO_REGION` to the same as you have set on your minio server
``` bash
docker run -p 9090:9090 -e CONSOLE_MINIO_SERVER=http://127.0.0.1:9000 -e CONSOLE_MINIO_REGION=your.region.here ghcr.io/georgmangold/console
```
``` bash
export CONSOLE_MINIO_REGION=eu-central-1
export CONSOLE_MINIO_SERVER=http://localhost:9000
./console server
```
If you have changed your region on the minio config, you can also get it with
``` bash
mc admin config get ALIAS region
```

### Does OIDC works?
Yes, see docs [OIDC](OIDC.md).

### Docker Volume Mount?
There is no persistent data for the Console, everything is done with environment variables. The only one needed is the URL to the Minio server, i.e. `CONSOLE_MINIO_SERVER`.

### Can I use this Console as S3 Browser for other S3 Provider?
No, this Console only works with minio .
```
minio-console-1  | ErrorWithContext:The s3 command you requested is not implemented.                                 
minio-console-1  | %!(EXTRA *errors.errorString=invalid login)
```