const socketChargingSessionRepository = require("./repository");

exports.createSocketChargingSession = async (socketId) => {
  if (socketChargingSessionRepository.find()) {
    throw Error("Socket charging session is already started");
  }
  socketChargingSessionRepository.save({ socketId });
};
