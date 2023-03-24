import React, { useState, useEffect } from "react";

export default () => {
  const [isPlugged, setIsPlugged] = useState(false);
  const [isCharging, setIsCharging] = useState(false);

  const plugin = () => {
    setIsPlugged(true);
    setIsCharging(true);
  };

  const unplug = () => {
    setIsPlugged(false);
  };

  useEffect(() => {
    if (isCharging && !isPlugged) {
      setIsCharging(false);
    }
  }, [isPlugged]);

  return (
    <>
      <h2>Socket</h2>
      <div>Status: {isCharging ? "Charging" : "NOT charging"}</div>
      <button disabled={isPlugged} onClick={() => plugin()}>
        Plugin
      </button>
      <button disabled={!isPlugged} onClick={() => unplug()}>
        Unplug
      </button>
    </>
  );
};
