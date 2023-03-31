const path = require("path");

const oas3Tools = require("oas3-tools");

module.exports = oas3Tools
  .expressAppConfig(path.join(__dirname, "./openapi.yaml"), {
    routing: {
      controllers: path.join(__dirname, "./controllers"),
    },
  })
  .getApp();
