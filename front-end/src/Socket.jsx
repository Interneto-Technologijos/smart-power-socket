import React, { useState } from "react";

export default () => {
  const [isPlugged, setIsPlugged] = useState(false);
  return (
    <>
      <h2>Socket</h2>
      <button disabled={isPlugged} onClick={() => setIsPlugged(true)}>
        Plug in
      </button>
      <button disabled={!isPlugged} onClick={() => setIsPlugged(false)}>
        Unplug
      </button>
    </>
  );
};
