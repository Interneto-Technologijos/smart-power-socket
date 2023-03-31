let chargingSessions = [];

module.exports.save = (chargingSession) => {
  chargingSessions.push(chargingSession);
};

module.exports.update = (chargingSession) => {
  chargingSessions[0] = { ...chargingSessions[0], ...chargingSession };
};

module.exports.delete = () => {
  chargingSessions.pop();
};

module.exports.find = () => {
  return chargingSessions[0];
};

module.exports.truncate = () => {
  chargingSessions = [];
};
