import React, { useState, useEffect } from "react";

import Display from "./Display";

const WH_PER_SECOND = 0.008333333;

let intervalId;

export default () => {
  const [isPlugged, setIsPlugged] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [chartStartTimestamp, setChargeStartTimestamp] = useState(null);
  const [sessionLength, setSessionLength] = useState(0);
  const [whConsumed, setWhConsumed] = useState(0);

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
    if (!chartStartTimestamp) {
      setSessionLength(0);
      setWhConsumed(0);
    }
  }, [chartStartTimestamp]);

  useEffect(() => {
    setWhConsumed(sessionLength * WH_PER_SECOND);
  }, [sessionLength]);

  useEffect(() => {
    if (isCharging && !intervalId) {
      const timestamp = new Date();
      setChargeStartTimestamp(timestamp);
      intervalId = setInterval(() => {
        setSessionLength(
          Math.round((new Date().getTime() - timestamp.getTime()) / 1000)
        );
      }, 1000);
    } else if (!isCharging) {
      setChargeStartTimestamp(null);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
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
            ? "Charging for: " +
              sessionLength +
              " s, Consumed: " +
              whConsumed.toFixed(2) +
              " Wh"
            : ""
        }
      />
    </>
  );
};
