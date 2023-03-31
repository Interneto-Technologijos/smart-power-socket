let chargingSessions = [];

module.exports.save = (chargingSession) => {
  chargingSessions.push(chargingSession);
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
