import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CardReader.css";

export default ({ onMessage, onAuthorizationSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      onMessage(error.message);
      return;
    }

    onMessage(`Authorization successful!`);
    onAuthorizationSuccess(paymentMethod);
  };
  return (
    <>
      <h2>Card Reader</h2>

      <form onSubmit={handleSubmit}>
        <label>
          <CardElement className="CardElement" />
        </label>
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    </>
  );
};
