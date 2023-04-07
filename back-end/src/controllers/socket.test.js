const request = require("supertest");

const app = require("../app");
const socketChargingSessionRepository = require("../socket/charging-session/repository");

describe("Socket API", () => {
  beforeEach(() => {
    socketChargingSessionRepository.truncate();
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
  describe("Valid socket id is provided", () => {
    const socketId = "1b19dd60-9b48-406a-bd3b-297a15702e8d";
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
      beforeEach(() => {
        socketChargingSessionRepository.save({
          socketId,
        });
      });
      test("socket session creation should fail", async () => {
        await request(app)
          .post(`/socket/${socketId}/charging-session`)
          .expect(400, {
            message: "Socket charging session is already started",
          });
      });
      test("socket session should be close", async () => {
        await request(app)
          .delete(`/socket/${socketId}/charging-session`)
          .expect(200);
        expect(socketChargingSessionRepository.find()).toBeUndefined();
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
