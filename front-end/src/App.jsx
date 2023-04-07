import React from "react";
import Socket from "./socket/Socket";
import "./App.css";

export default () => {
  return (
    <div className="body">
      <h1>Smart Power Socket</h1>
      <Socket />
    </div>
  );
};
