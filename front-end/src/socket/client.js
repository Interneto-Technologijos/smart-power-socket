export const createSocketChargingSession = async (socketId) => {
  await fetch(`http://localhost:8081/socket/${socketId}/charging-session`, {
    method: "POST",
  });
};