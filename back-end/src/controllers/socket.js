const utils = require("../utils/writer.js");
const socketChargingSessionService = require("../socket/charging-session/service");

module.exports.createSocketChargingSession = (req, res, next) => {
  req.params.socketId = req.url.match(/\/socket\/(.+)\/.+/)[1];
  socketChargingSessionService
    .createSocketChargingSession(req.params.socketId)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
    });
};

module.exports.closeSocketChargingSession = (req, res, next) => {
  socketChargingSessionService
    .closeSocketChargingSession()
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
    });
};
