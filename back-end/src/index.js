const path = require("path");
const http = require("http");

const app = require("./app");

const serverPort = 3001;

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
