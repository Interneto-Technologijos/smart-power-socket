import React, { useState, useEffect } from "react";

import Display from "./Display";

export default () => {
  const [isPlugged, setIsPlugged] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [chartStartTimestamp, setChargeStartTimestamp] = useState(null);

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

  useEffect(() => {
    if (isCharging) {
      setChargeStartTimestamp(new Date());
    } else {
      setChargeStartTimestamp(null);
    }
  }, [isCharging]);

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
      <Display
        text={
          isCharging && chartStartTimestamp
            ? "Charing started at: " + chartStartTimestamp.toString()
            : ""
        }
      />
    </>
  );
};
