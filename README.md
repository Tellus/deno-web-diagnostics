# inqludeit-web-testbench
A basic webserver that can be configured to act as a remote host when testing the InqludeIT Web Accessility platform.

## Configuration

The testbench can be configured using two approaches - path-based or file-based. The two approaches can generally be mixed, but must be rooted in one of them when launching the application.

### Path-based

The path-based approach points the application to a particular root directory. Each path within the directory will correspond to a path served by the webserver. Any non-configuration files (.html files and the like) within the path will be statically served, while any configuration files will be parsed and added to the overall router configuration.

### Configuration-based

The configuration-based approach uses configuration files (.yaml, .json or .json5) to instruct the testbench in how to respond to queries. Configurations contain a number of route entries that define which paths on the webserver are valid, and how the server should respond to them. It is possible to add a path-based subconfiguration in this way.

### Examples

#### Static path

```html
<!-- file located at #ROOT#/index.html -->

<html>
  <body>
    <div>
      This is a statically served HTML file.
    </div>
  </body>
</html>
```

#### Config file

```yaml
# Located at #ROOT#/index.yaml

# Statically serves the contents of the file index.html at the exact path http://HOST/index.html (note the extension)
- path: index.html
  file: index.html
# Always responds with 403 forbidden to all requests on the path http://HOST/forbidden-route
- path: /forbidden-route/
  status: 403
# Constructs 3 additional paths and redirects to them sequentially on all requests to http://HOST/test-redirection
- path: /test-redirection/
  response:
    redirect: 3 # Redirect three times before sending OK.
# Responds to all Mozilla-like requests at http://HOST/test-mozilla-ua with the string "Hello, Mozilla!" - does NOT respond to ANYthing else, yielding timeouts or similar for requesters.
- path: /test-mozilla-ua/
    text: Hello, Mozilla!
    request: # Match conditions for requests in order to trigger this path. The `path` parameter is part of this.
      headers:
        User-Agent: /Mozilla/i # Only user agents with the string "Mozilla" in them will trigger this path.
# Responds to all Chrome-like requests at http://HOST/test-chrome-ua with the string "Hello, Mozilla!" - does NOT respond to ANYthing else, yielding timeouts or similar for requesters.
- path: /test-chrome-ua/
    text: Hello, Chromium-like!
    request: # Match conditions for requests in order to trigger this path. The `path` parameter is part of this.
      headers:
        User-Agent: /Chrom/i # Only user agents with the string "Chrom" in them will trigger this path.
# You can wrap multiple condition/responses to a single path with an array.
/test-user-agent/:
  # Will respond on the path only if the user-agent header contains "Chrom".
  - request:
      headers:
        User-Agent: /Chrom/i
    response:
      text: "Hello, Chrome!"
  # Will respond on the path only if the user-agent header contains "Mozilla".
  - request:
      headers:
        User-Agent: /Mozilla/i
    response:
      text: "Hello, Mozilla!"
```

### Middleware file

```typescript
// Located at: #ROOT#/echo-ua.ts

// Responds to requests at http://HOST/echo-ua with the requester's user agent (if any was set).
export default function echoUserAgent(ctx: KoaContext) {
  ctx.response.body = ctx.request.headers['User-Agent'];
}
```

Vue routing style (underscore denotes path variable):

```typescript
// Located at: #ROOT#/function-tests/_pathvar.ts

export default function echoUserAgent(ctx: KoaContext) {
  // Responds to requests at http://HOST/function-tests/somevalue with "somevalue".
  ctx.response.body = ctx.params.pathvar;
}
```

### Dev thoughts

#### Route/path matching

- purely based on path
  - /index.html
  - /somewhere-else/big/path/file.jpg
- should reacting to certain conditions happen here or only be handled by running middleware?
  - e.g. reacting to specific user-agents or other header data

#### Responding

- static file/data
- run a function
- set specific response headers
- redirect
- redirect randomly a number of times
- timeout/don't respond
- delay before responding