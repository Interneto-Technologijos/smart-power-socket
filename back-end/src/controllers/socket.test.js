const request = require("supertest");

const app = require("../app");
const stripe = require("../stripe");
const socketChargingSessionRepository = require("../socket/charging-session/repository");
const socketChargingSessionPaymentRepository = require("../socket/charging-session/payment/repository");

describe("Socket API", () => {
  beforeEach(() => {
    socketChargingSessionRepository.truncate();
    socketChargingSessionPaymentRepository.truncate();
  });
  describe("Invalid socket id is provided", () => {
    const socketId = "invalid";
    test("socket session creation should fail", () =>
      request(app)
        .post(`/socket/${socketId}/charging-session`)
        .expect(400, {
          message: 'request.params.socketId should match format "uuid"',
          errors: [
            {
              path: ".params.socketId",
              message: 'should match format "uuid"',
              errorCode: "format.openapi.validation",
            },
          ],
        }));
    test("socket session close should fail", () =>
      request(app)
        .delete(`/socket/${socketId}/charging-session`)
        .expect(400, {
          message: 'request.params.socketId should match format "uuid"',
          errors: [
            {
              path: ".params.socketId",
              message: 'should match format "uuid"',
              errorCode: "format.openapi.validation",
            },
          ],
        }));
    test("socket session update should fail", () =>
      request(app)
        .put(`/socket/${socketId}/charging-session`)
        .expect(400, {
          message: 'request.params.socketId should match format "uuid"',
          errors: [
            {
              path: ".params.socketId",
              message: 'should match format "uuid"',
              errorCode: "format.openapi.validation",
            },
          ],
        }));
  });
  describe("Valid but not existing socket id is provided", () => {
    const socketId = "abc13168-65e2-4f21-8dcb-cda2d3e70c7e";
    test("socket session creation should not be authorized", async () => {
      await request(app)
        .post(`/socket/${socketId}/charging-session`)
        .send({ paymentMethodId: "1" })
        .expect(400, {
          message: "Unauthorized",
        });
    });
    test("socket session closure should not be authorized", async () => {
      await request(app)
        .delete(`/socket/${socketId}/charging-session`)
        .expect(400, {
          message: "Unauthorized",
        });
    });
    test("socket session update should not be authorized", async () => {
      await request(app)
        .put(`/socket/${socketId}/charging-session`)
        .send({ whConsumed: 1 })
        .expect(400, {
          message: "Unauthorized",
        });
    });
  });
  describe("Valid and existing socket id is provided", () => {
    const socketId = "fce13168-65e2-4f21-8dcb-cda2d3e70c7e";
    const paymentMethodId = "pm_1IqY3cJesuVxKjM8aWV7yf9R";
    test("socket session should be created", async () => {
      await request(app)
        .post(`/socket/${socketId}/charging-session`)
        .send({ paymentMethodId })
        .expect(200);
      expect(socketChargingSessionRepository.find()).toMatchObject({
        socketId,
        paymentMethodId,
      });
    });
    test("socket session close should fail", async () => {
      await request(app)
        .delete(`/socket/${socketId}/charging-session`)
        .expect(400, {
          message: "Socket charging session is not started",
        });
    });
    test("socket session close should fail", async () => {
      await request(app)
        .put(`/socket/${socketId}/charging-session`)
        .expect(400, {
          message: "Socket charging session is not started",
        });
    });
    describe("Session for socket ID is already started", () => {
      let paymentMethod;
      const whConsumed = 1000;
      beforeEach(async () => {
        paymentMethod = await stripe.paymentMethods.create({
          type: "card",
          card: {
            number: "4242424242424242",
            exp_month: 12,
            exp_year: 2042,
            cvc: "123",
          },
        });
        socketChargingSessionRepository.save({
          socketId,
          paymentMethodId: paymentMethod.id,
          whConsumed,
        });
      });
      test("socket session creation should fail", async () => {
        await request(app)
          .post(`/socket/${socketId}/charging-session`)
          .expect(400, {
            message: "Socket charging session is already started",
          });
      });
      test("socket session should be close and charge payment method provided", async () => {
        await request(app)
          .delete(`/socket/${socketId}/charging-session`)
          .expect(200);
        expect(socketChargingSessionRepository.find()).toBeUndefined();
        expect(
          socketChargingSessionPaymentRepository.findAll()[0]
        ).toMatchObject({
          socketId,
          whConsumed,
          amount: 30,
          customerEmail: expect.any(String),
          status: "FAILED",
        });
      });
      describe("Consumed power is not provided", () => {
        test.skip("socket session update should fail", async () => {
          await request(app)
            .put(`/socket/${socketId}/charging-session`)
            .send({})
            .expect(400, {
              message: "error",
            });
        });
      });
      describe("Consumed power is provided", () => {
        const whConsumed = 123.456;
        test("socket session should be updated", async () => {
          await request(app)
            .put(`/socket/${socketId}/charging-session`)
            .send({ whConsumed })
            .expect(200);
          expect(socketChargingSessionRepository.find()).toMatchObject({
            socketId,
            whConsumed,
          });
        });
      });
    });
  });
});
