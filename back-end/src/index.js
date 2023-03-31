const path = require("path");
const http = require("http");

const oas3Tools = require("oas3-tools");
const serverPort = 3001;

const app = oas3Tools
  .expressAppConfig(path.join(__dirname, "./openapi.yaml"), {
    routing: {
      controllers: path.join(__dirname, "./controllers"),
    },
  })
  .getApp();

http.createServer(app).listen(serverPort, () => {
  console.log(
    "Back-end is listening on port %d (http://localhost:%d)",
    serverPort,
    serverPort
  );
  console.log(
    "Swagger-ui is available on http://localhost:%d/docs",
    serverPort
  );
});
