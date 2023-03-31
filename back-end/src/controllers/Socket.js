const utils = require("../utils/writer.js");
const socketChargingSessionService = require("../socket/charging-session/service");

module.exports.createSocketChargingSession = (req, res, next) => {
  socketChargingSessionService
    .createSocketChargingSession()
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};
