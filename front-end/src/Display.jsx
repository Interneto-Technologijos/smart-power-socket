import React from "react";
import "./Display.css";

export default ({ text }) => {
  return (
    <>
      <h2>Display</h2>
      <div className="display">{text}</div>
    </>
  );
};
