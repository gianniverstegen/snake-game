import React from "react";

const Node = ({ state, row, col, id }) => {
  return <div className={state} row={row} col={col} id={id}></div>;
};

export default Node;
