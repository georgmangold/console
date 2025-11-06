# OIDC
When the console is running separately and is not embedded in the same binary as the server, the OIDC SSO login configuration is not set / taken over from the minio server.

It needs to be configured using Environment Variables like this:
``` bash
export CONSOLE_MINIO_SERVER="http://127.0.0.1:9000";

export CONSOLE_IDP_URL="http://PROVIDER:5556/.well-known/openid-configuration";
export CONSOLE_IDP_CLIENT_ID="minio-client-app";
export CONSOLE_IDP_SECRET="minio-client-app-secret";
export CONSOLE_IDP_CALLBACK="http://CONSOLE:9090";
export CONSOLE_IDP_DISPLAY_NAME="Login with OIDC";

./console server
```
> [!IMPORTANT]  
> Currently, the following environment variables are mandatory: `CONSOLE_IDP_URL`, `CONSOLE_IDP_CLIENT_ID`, `CONSOLE_IDP_SECRET` and `CONSOLE_IDP_CALLBACK`.

For convenience, the same environment variables are supported as for the server, with the `CONSOLE_` ones taking precedence over the `MINIO_` ones.  
This means you can use the same variables as you would set on the server and share them with the console.  

| Console Environment Variables | MinIO Server Environment Variables | Required | Example |
| -- | -- | -- | -- |
| CONSOLE_IDP_DISPLAY_NAME | MINIO_IDENTITY_OPENID_DISPLAY_NAME | | "Login with OIDC" |
| CONSOLE_IDP_URL | MINIO_IDENTITY_OPENID_CONFIG_URL | ✓ | "https://provider/.well-known/openid-configuration" |
| CONSOLE_IDP_CLIENT_ID | MINIO_IDENTITY_OPENID_CLIENT_ID | ✓ | minio-client-app |
| CONSOLE_IDP_SECRET | MINIO_IDENTITY_OPENID_CLIENT_SECRET | ✓ | minio-client-app-secret |
| CONSOLE_IDP_CALLBACK | MINIO_BROWSER_REDIRECT_URL | ✓ | "https://console" ***without*** /oauth_callback |
| CONSOLE_IDP_CALLBACK_DYNAMIC | MINIO_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC | | off / on|
| CONSOLE_IDP_SCOPES | MINIO_IDENTITY_OPENID_SCOPES | | "openid,profile,email" |
| CONSOLE_IDP_USERINFO | MINIO_IDENTITY_OPENID_CLAIM_USERINFO | | off / on |
| *(only set on MinIO Server Side)*| MINIO_IDENTITY_OPENID_CLAIM_NAME | | "name" exclusiv with ROLE_POLICY ↓
| ↓ If set **NEEDS ARN** of Policy Role set on Console ↓  | MINIO_IDENTITY_OPENID_ROLE_POLICY | | "consoleAdmin" exclusiv with CLAIM_NAME ↑ |
| CONSOLE_IDP_ROLE_ARN | ↑ If Role Policy set get Policy Role Arn from MinIO Startup Log ↑  looks like this example → | | "arn:minio:iam:::role/nOybJqMNzNmroqEKq5D0EUsRZw0" |
| CONSOLE_IDP_END_SESSION_ENDPOINT | | |

> [!TIP]
> After setup use the [/sso](#sso-url) url, your console url + /sso, e.g. https://console/sso 

## CONSOLE_IDP_CALLBACK	/ MINIO_BROWSER_REDIRECT_URL
URL to Console e.g. `https://console.example.com` ***without*** `/oauth_callback`

On IDP Site Callback URLs / redirect URI it is allways the full URL with `/oauth_callback` `https://console.example.com/oauth_callback`

> [!NOTE]
> Breaking Change with 1.9.0
> On 1.8.1 it needed /oauth_callback

## MINIO_IDENTITY_OPENID_CLAIM_NAME
Only set on MinIO Server Side, exclusiv with `MINIO_IDENTITY_OPENID_ROLE_POLICY`.  
If value/ information is not included in the default scopes `openid,profile,email`, its needs to be included in _SCOPES for example `groups`.

## CONSOLE_IDP_ROLE_ARN
Needs `MINIO_IDENTITY_OPENID_ROLE_POLICY` set on MinIO Server Side, exclusiv with `MINIO_IDENTITY_OPENID_CLAIM_NAME`.
If set you get the RoleArn on Minio Star
### After MinIO Version: RELEASE.2025-07-23T15-54-02Z 
``` 
INFO: IAM Roles: arn:minio:iam:::role/nOybJqMNzNmroqEKq5D0EUsRZw0
INFO: IAM load(startup) finished. (duration: 4.439165ms)
```
### Before MinIO Version: RELEASE.2025-07-23T15-54-02Z
If you use build-in / `canned` policies  like `consoleAdmin`, you get an error on minio startup log
``` bash
Error: The policies "[consoleAdmin]" mapped to role ARN arn:minio:iam:::role/nOybJqMNzNmroqEKq5D0EUsRZw0 are not defined - this role may not work as expected. (*errors.errorString)
       7: internal/logger/logger.go:271:logger.LogIf()
       6: cmd/logging.go:54:cmd.authZLogIf()
       5: cmd/iam.go:524:cmd.(*IAMSys).validateAndAddRolePolicyMappings()
       4: cmd/iam.go:370:cmd.(*IAMSys).Init()
       3: cmd/server-main.go:1006:cmd.serverMain.func15.1()
       2: cmd/server-main.go:566:cmd.bootstrapTrace()
       1: cmd/server-main.go:1005:cmd.serverMain.func15()
INFO: IAM Roles: arn:minio:iam:::role/nOybJqMNzNmroqEKq5D0EUsRZw0
---------------------------
```

# SSO URL
If you have set up OIDC, use your console URL with /sso added at the end to be automatically redirected to log in to your IDP provider.  
`https://console.example.com/sso`