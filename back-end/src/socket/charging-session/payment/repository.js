let payments = [];

module.exports.save = (payment) => {
  payments.push(payment);
};

module.exports.findAll = () => {
  return payments;
};

module.exports.truncate = () => {
  payments = [];
};
