const fs = require("fs");
const http = require("http");
const path = require("path");
const _ = require("lodash");
const mLog = require("./modules/Mlog");
const url = require("url");
const server = http.createServer();
const uuid = require("uuid");
const port = process.argv[2] || 8080;

server
  .on("request", (request, response) => {
    if (
      request.method == "POST" &&
      url.parse(request.url, true).pathname == "/add-session"
    ) {
      let body = "";
      request
        .on("data", chunk => {
          body = chunk;
        })
        .on("end", () => {
          let uuidVar = uuid.v4();
          let pathname = path.join(__dirname, ".session", `${uuidVar}`);
          mLog.info(`${body}`);
          fs.writeFile(pathname, `${body}`, function(err) {
            if (err) {
              return console.log(err);
            }
          });
          response.setHeader(
            "Set-Cookie",
            `sessionId=${uuidVar}; expires=${new Date(
              new Date().getTime() + 10000
            ).toGMTString()}`
          );
          response.end();
        });
    } else if (request.method == "GET") {
      let fileName = url.parse(request.url, true).pathname;
      fileName = fileName == "/" ? "index.html" : fileName;
      let pathName = path.join(__dirname, fileName);

      mLog.info(
        `${request.method} ${fileName} [${url.parse(request.url, true).search}]`
      );
      if (request.headers.cookie) {
        mLog.info(request.headers.cookie);
        let pathSession = path.join(
          __dirname,
          ".session",
          _.split(request.headers.cookie, "=")[1]
        );
        console.log(pathSession);
        let headerValue = fs.readFileSync(pathSession);
        response.setHeader("x-my-user-data", `${headerValue}`);
      }
      fs
        .createReadStream(pathName)
        .on("error", err => {
          let content = fs.readFileSync(path.join(__dirname, "404.html"));
          mLog.error(`THE URL ${fileName} doesn't exist`);
          response.statusCode = 404;
          response.end(content);
        })
        .pipe(response)
        .on("end", err => {
          response.end();
        });
    }
  })
  .listen(port, err => {
    if (err) throw err;
    mLog.server(`Server running on ${port}`);
  });
