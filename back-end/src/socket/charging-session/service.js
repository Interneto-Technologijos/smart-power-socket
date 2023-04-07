const socketChargingSessionRepository = require("./repository");

exports.createSocketChargingSession = async (socketId, paymentMethodId) => {
  if (socketChargingSessionRepository.find()) {
    throw Error("Socket charging session is already started");
  }
  socketChargingSessionRepository.save({ socketId, paymentMethodId });
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
