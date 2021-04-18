import React from "react";

const Header = ({ resetHandler, playGame, speedHandler }) => {
  return (
    <header>
      <ul>
        <button className="logo"> Snake-game </button>
        <button className="play animate" id="playButton" onClick = {playGame}>PLAY</button>
        <button className="headerButton" id="header-selector"> SPEED 
        <div className="header-dropdown">
            <div>
              <div onClick={(() => speedHandler("easy"))}>
                EASY
              </div>
              <div onClick={(() => speedHandler("normal"))}>
                NORMAL
              </div>
              <div onClick={(() => speedHandler("hard"))}>
                HARD
              </div>
            </div>
          </div>

        </button>
        <button id="resetButton"onClick={resetHandler}> RESET </button>
      </ul>
    </header>
  );
};

export default Header;
