import React from "react";

const Overlay = ({ score }) => {
  return (
    <div className="legend" id="legend">
      <div>SCORE: {score}</div>
    </div>
  );
};

export default Overlay;
