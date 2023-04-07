export const createSocketChargingSession = async (socketId) => {
  await fetch(`http://localhost:8080/socket/${socketId}/charging-session`, {
    method: "POST",
  });
};

export const closeSocketChargingSession = async (socketId) => {
  await fetch(`http://localhost:8080/socket/${socketId}/charging-session`, {
    method: "DELETE",
  });
};

export const updateSocketChargingSession = async (socketId, whConsumed) => {
  await fetch(`http://localhost:8080/socket/${socketId}/charging-session`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ whConsumed }),
  });
};
