import React from "react";
import Node from "./Node";

const PlayArea = ({ grid }) => {
  return (
    <div className="playArea">
      <div className="node_container">
        {grid.map((row, rowIDX) => {
          return (
            <div className="node_row" key={rowIDX}>
              {row.map((node, colIDX) => (
                <Node
                  state={node.state}
                  row={rowIDX}
                  col={colIDX}
                  id={`${rowIDX}-${colIDX}`} //Maybe not needed, replace the key with the id
                  key={colIDX}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayArea;
