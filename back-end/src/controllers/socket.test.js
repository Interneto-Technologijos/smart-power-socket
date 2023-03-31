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
  });
  describe("Valid socket id is provided", () => {
    const socketId = "1b19dd60-9b48-406a-bd3b-297a15702e8d";
    test("socket session should be created", async () => {
      await request(app)
        .post(`/socket/${socketId}/charging-session`)
        .expect(200);
      expect(socketChargingSessionRepository.find()).toMatchObject({
        socketId,
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
    });
  });
});
