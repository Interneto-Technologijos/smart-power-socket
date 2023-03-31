const socketChargingSessionRepository = require("./repository");

exports.createSocketChargingSession = async (socketId) => {
  if (socketChargingSessionRepository.find()) {
    throw Error("Socket charging session is already started");
  }
  socketChargingSessionRepository.save({ socketId });
};

exports.closeSocketChargingSession = async () => {
  if (!socketChargingSessionRepository.find()) {
    throw Error("Socket charging session is not started");
  }
  socketChargingSessionRepository.delete();
};

exports.updateSocketChargingSession = async (chargingSession) => {
  if (!socketChargingSessionRepository.find()) {
    throw Error("Socket charging session is not started");
  }
  socketChargingSessionRepository.update(chargingSession);
};
