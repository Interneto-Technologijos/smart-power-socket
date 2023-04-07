import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default ({ onMessage, onPaymentSuccess }) => {
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

    onMessage(`Payment successful!`);
    // Send the payment method ID to your server for processing
    // e.g. using fetch or Axios
    onPaymentSuccess();
  };
  return (
    <>
      <h2>Card Reader</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Card details
          <CardElement />
        </label>
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    </>
  );
};
