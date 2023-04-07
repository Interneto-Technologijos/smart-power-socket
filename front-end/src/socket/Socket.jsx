import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Display from "../Display";

import * as socketClient from "./client";
import CardReader from "../CardReader";

const WH_PER_SECOND = 0.008333333;
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51Mu8PPJlziJBrPDNP4kBWZQuuose7cdQhym4I9UQqtFSbBfGJBQ5XfVoFt3DQ5U1Z6WT5kdlYeE7tOi8UKVMpEdd00Q7iCmL4J";
const SOCKET_ID = "fce13168-65e2-4f21-8dcb-cda2d3e70c7e";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

let intervalId;

export default () => {
  const [isPlugged, setIsPlugged] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [chartStartTimestamp, setChargeStartTimestamp] = useState(null);
  const [sessionLength, setSessionLength] = useState(0);
  const [_whConsumed, setWhConsumed] = useState(0);
  const [text, setText] = useState("");

  const plugin = () => {
    setIsPlugged(true);
  };

  const unplug = () => {
    setIsPlugged(false);
  };

  const onPaymentSuccess = () => {
    if (!isPlugged) {
      setText("Nothing is plugged in");
      return;
    }
    setIsCharging(true);
    socketClient.createSocketChargingSession(SOCKET_ID).catch(console.error);
  };

  useEffect(() => {
    if (isCharging && !isPlugged) {
      setIsCharging(false);
      socketClient.closeSocketChargingSession(SOCKET_ID).catch(console.error);
    }
  }, [isPlugged]);

  useEffect(() => {
    if (!chartStartTimestamp) {
      setSessionLength(0);
      setWhConsumed(0);
      setText("");
    }
  }, [chartStartTimestamp]);

  useEffect(() => {
    const whConsumed = sessionLength * WH_PER_SECOND;
    setText(
      "Charging for: " +
        sessionLength +
        " s, Consumed: " +
        whConsumed.toFixed(2) +
        " Wh"
    );
    setWhConsumed(whConsumed);
    if (isCharging) {
      socketClient.updateSocketChargingSession(SOCKET_ID, whConsumed);
    }
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
      <Display text={text} />
      <Elements stripe={stripePromise}>
        <CardReader
          onMessage={(message) => setText(message)}
          onPaymentSuccess={() => onPaymentSuccess()}
        />
      </Elements>
    </>
  );
};
