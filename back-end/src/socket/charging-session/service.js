const stripe = require("../../stripe");
const socketChargingSessionRepository = require("./repository");
const socketChargingSessionPaymentRepository = require("./payment/repository");

const PRICE_PER_KWH = 30;

const SOCKET_ID = "fce13168-65e2-4f21-8dcb-cda2d3e70c7e";

exports.createSocketChargingSession = async (socketId, paymentMethodId) => {
  if (socketId !== SOCKET_ID) {
    throw new Error("Unauthorized");
  }
  if (socketChargingSessionRepository.find()) {
    throw Error("Socket charging session is already started");
  }
  socketChargingSessionRepository.save({ socketId, paymentMethodId });
};

exports.closeSocketChargingSession = async (socketId) => {
  if (socketId !== SOCKET_ID) {
    throw new Error("Unauthorized");
  }
  const session = socketChargingSessionRepository.find();
  if (!session) {
    throw Error("Socket charging session is not started");
  }
  const amount = (session.whConsumed / 1000) * PRICE_PER_KWH;
  const customer = await stripe.customers.create({
    email: `customer${Date.now()}@test.tt`,
    payment_method: session.paymentMethodId,
  });
  let status;
  try {
    const charge = await stripe.charges.create({
      amount,
      currency: "eur",
      customer: customer.id,
      payment_method: session.paymentMethodId,
      description: "Test payment",
    });
    console.log(charge);
    status = "SUCCESS";
  } catch (error) {
    console.error(error.message);
    status = "FAILED";
  }
  const payment = {
    socketId: session.socketId,
    whConsumed: session.whConsumed,
    amount,
    customerEmail: customer.email,
    status,
  };
  socketChargingSessionPaymentRepository.save(payment);
  console.log(`Payment created: ${JSON.stringify(payment)}`);
  socketChargingSessionRepository.delete();
};

exports.updateSocketChargingSession = async (socketId, chargingSession) => {
  if (socketId !== SOCKET_ID) {
    throw new Error("Unauthorized");
  }
  if (!socketChargingSessionRepository.find()) {
    throw Error("Socket charging session is not started");
  }
  socketChargingSessionRepository.update(chargingSession);
};
