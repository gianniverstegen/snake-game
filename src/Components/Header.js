import React from "react";

const Header = ({ resetHandler, currentMode, switchMode }) => {
  return (
    <header>
      <ul>
        <button className="logo"> Snake-game & AI</button>
        <button className="play">{currentMode.toUpperCase()}</button>
        <button onClick={switchMode}>
          SWITCH TO {currentMode === "play" ? "SIMULATE" : "PLAY"}
        </button>
        <button> SPEED </button>
        <button onClick={resetHandler}> RESET </button>
      </ul>
    </header>
  );
};

export default Header;
