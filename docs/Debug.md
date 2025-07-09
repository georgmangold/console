# Debug logging

In some cases it may be convenient to log all HTTP requests. This can be enabled by setting
the `CONSOLE_DEBUG_LOGLEVEL` environment variable to one of the following values:

 - `0` (default) uses no logging.
 - `1` log single line per request for server-side errors (status-code 5xx).
 - `2` log single line per request for client-side and server-side errors (status-code 4xx/5xx).
 - `3` log single line per request for all requests (status-code 4xx/5xx).
 - `4` log details per request for server-side errors (status-code 5xx).
 - `5` log details per request for client-side and server-side errors (status-code 4xx/5xx).
 - `6` log details per request for all requests (status-code 4xx/5xx).

 A single line logging has the following information:
 - Remote endpoint (IP + port) of the request. Note that reverse proxies may hide the actual remote endpoint of the client's browser.
 - HTTP method and URL
 - Status code of the response (websocket connections are hijacked, so no response is shown)
 - Duration of the request

The detailed logging also includes all request and response headers (if any).