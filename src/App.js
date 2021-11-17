import { useState, useEffect } from "react";
import useInterval from "./useInterval";
import Node from "./node";
import Gameover from "./Components/Gameover";
import Header from "./Components/Header";
import Overlay from "./Components/Overlay";
import PlayArea from "./Components/PlayArea";

class SnakeBody {
  constructor(row, col, next) {
    this.row = row;
    this.col = col;
    this.nextBody = next;
  }
}

function App() {
  // The states
  const [snakeHead, setHead] = useState({
    row: 4,
    col: 3,
    directionHead: "e",
    nextBody: new SnakeBody(4, 5, undefined),
    tail: undefined,
  });
  const [boardState, setState] = useState({
    grid: initialGrid(),
    isStarted: false,
  });
  const [isRunning, setRunning] = useState(false);
  const [direction, setDirection] = useState("e");
  const [gameScore, setScore] = useState(0);
  const [gameSpeed, setSpeed] = useState(300);

  function playGame() {
    document.getElementById("playButton").classList.remove("animate");
    if (boardState.isStarted === true) return;
    setRunning(true);
    setState({ ...boardState, isStarted: true });
  }

  useEffect(() => {
    // Listens to keyinput
    window.addEventListener("keypress", (e) => {
      e.stopImmediatePropagation();
      handleDirectionChange(e);
    });
  });

  useInterval(
    // The main loop of the game
    () => {
      resetBoard();
      moveSnake();
    },
    isRunning ? gameSpeed : null
  );

  function resetBoard() {
    // Resets the board by setting al the snakecomponents to node
    let newGrid = boardState.grid.slice();
    newGrid[snakeHead.row][snakeHead.col].state = "node";
    let current = snakeHead.nextBody;
    while (current !== undefined) {
      newGrid[current.row][current.col].state = "node";
      current = current.nextBody;
    }
    setState({ ...boardState, grid: newGrid });
  }

  function moveSnake() {
    // Does everything after it is resetted
    if (isDirectionValid()) {
      // direction is valid if the input isn't opposite of the current direction -> e.g. input: N, direction: S
      updateSnakeHeadUsingGlobalDirection();
    } else updateSnakeHeadUsingSnakeHeadDirection(); // The initial direction is used to update if the direction isnt valid
  }

  function handleDirectionChange(e) {
    // Name says it all
    if (e.key === "w") {
      setDirection("n");
    } else if (e.key === "d") {
      setDirection("e");
    } else if (e.key === "s") {
      setDirection("s");
    } else if (e.key === "a") {
      setDirection("w");
    } else return;
  }

  function isDirectionValid() {
    // Checks if input direction is opposite to the initial direction
    if (snakeHead.directionHead === "n" && direction === "s") {
      return false;
    } else if (snakeHead.directionHead === "s" && direction === "n") {
      return false;
    } else if (snakeHead.directionHead === "e" && direction === "w") {
      return false;
    } else if (snakeHead.directionHead === "w" && direction === "e") {
      return false;
    } else return true;
  }

  function updateSnakeHeadUsingGlobalDirection() {
    // Updates the snake based on input direction
    var newCol = snakeHead.col;
    let newRow = snakeHead.row;
    let newDirection = "";
    if (direction === "e") {
      let newSnakeHeadCol = snakeHead.col + 1;
      if (newSnakeHeadCol < 10) {
        newCol = newSnakeHeadCol;
        newDirection = "e";
      } else gameOver();
    } else if (direction === "s") {
      let newSnakeHeadRow = snakeHead.row + 1;
      if (newSnakeHeadRow < 10) {
        newRow = newSnakeHeadRow;
        newDirection = "s";
      } else gameOver();
    } else if (direction === "w") {
      let newSnakeHeadCol = snakeHead.col - 1;
      if (newSnakeHeadCol >= 0) {
        newCol = newSnakeHeadCol;
        newDirection = "w";
      } else gameOver();
    } else if (direction === "n") {
      let newSnakeHeadRow = snakeHead.row - 1;
      if (newSnakeHeadRow >= 0) {
        newRow = newSnakeHeadRow;
        newDirection = "n";
      } else gameOver();
    }
    if (checkPotentialDeath(newRow, newCol) === false) gameOver();
    setHead({
      ...snakeHead,
      col: newCol,
      row: newRow,
      directionHead: newDirection,
    });
    updateSnake(newRow, newCol);
  }

  function updateSnakeHeadUsingSnakeHeadDirection() {
    // Updates snake on initial direction
    let newCol = snakeHead.col;
    let newRow = snakeHead.row;
    let newDirection = "";
    if (snakeHead.directionHead === "e") {
      let newSnakeHeadCol = snakeHead.col + 1;
      if (newSnakeHeadCol < 10) {
        newCol = newSnakeHeadCol;
        newDirection = "e";
      } else gameOver();
    } else if (snakeHead.directionHead === "s") {
      let newSnakeHeadRow = snakeHead.row + 1;
      if (newSnakeHeadRow < 10) {
        newRow = newSnakeHeadRow;
        newDirection = "s";
      } else gameOver();
    } else if (snakeHead.directionHead === "w") {
      let newSnakeHeadCol = snakeHead.col - 1;
      if (newSnakeHeadCol >= 0) {
        newCol = newSnakeHeadCol;
        newDirection = "w";
      } else gameOver();
    } else if (snakeHead.directionHead === "n") {
      let newSnakeHeadRow = snakeHead.row - 1;
      if (newSnakeHeadRow >= 0) {
        newRow = newSnakeHeadRow;
        newDirection = "n";
      } else gameOver();
    }
    if (checkPotentialDeath(newRow, newCol) === false) gameOver();
    setHead({
      ...snakeHead,
      col: newCol,
      row: newRow,
      directionHead: newDirection,
    });
    updateSnake(newRow, newCol);
  }

  function gameOver(win) {
    if (win) {
      // something extra
      setRunning(false);
      document.getElementById("pop-up").style.display = "inline-block";
      document.getElementById("pop-up").innerHTML = "CONGRATULATIONS !!";
    } else {
      setRunning(false);
      document.getElementById("resetButton").classList.add("animate");
      document.getElementById("pop-up").style.display = "inline-block";
    }
  }

  function checkPotentialDeath(row, col) {
    // Chdcks if the snake collided with itself
    let current = snakeHead.nextBody;
    while (current) {
      if (current.row === row && current.col === col) {
        return false;
      }
      current = current.nextBody;
    }
    return true;
  }

  function updateSnake(newRow, newCol) {
    // Updates the position of the snakebodies
    let current = snakeHead.nextBody;
    let previous = snakeHead;
    // Start at the nextbody, since the head's cords arent updated yet
    while (current !== undefined) {
      let saveCurrent = new SnakeBody(
        current.row,
        current.col,
        current.nextBody
      );
      // Make a new object with current's settings to call for the next round
      current.col = previous.col;
      current.row = previous.row;
      // switch the cords of the previous node
      previous = saveCurrent;
      // insert the "saved" current with its old cords instead of its new cords
      if (current.nextBody === undefined) snakeHead.tail = current;
      // if current doesn't have a next body, then current is the tail
      current = current.nextBody;
      // saveCurrent.nextbody could also be used since the nextbody hasn't been altered
    }
    updateBoard(newRow, newCol);
  }

  function updateBoard(row, col) {
    // For each updates snakebody, it draws it to the board
    let newGrid = boardState.grid.slice();
    if (newGrid[row][col].state === "node-isFood") {
      foodConsumption();
    }
    newGrid[row][col].state = "node-isSnake";
    let current = snakeHead.nextBody;
    while (current !== undefined) {
      newGrid[current.row][current.col].state = "node-isSnakeBody";
      current = current.nextBody;
    }
    setState({ ...boardState, grid: newGrid });
  }

  function foodConsumption() {
    // Handles growth and foodconsumption
    // Overlay score update
    let newScore = gameScore;
    newScore += 1;
    setScore(newScore);
    let current = snakeHead;
    while (current !== undefined) {
      if (current.nextBody === undefined) {
        current.nextBody = new SnakeBody(current.row, current.col, undefined);
        break;
      }
      current = current.nextBody;
    }
    generateNewFoodObject();
  }

  function generateNewFoodObject(cells) {
    // Generates a new food object
    if (cells === undefined) {
      cells = new Set();
      let current = snakeHead;
      while (current) {
        cells.add(`${current.row} ${current.col}`);
        current = current.nextBody;
      }
    }
    if (cells.size === 79) gameOver("win"); // Wins
    let newGrid = boardState.grid.slice();
    let newFoodCol = Math.floor(Math.random() * 10);
    let newFoodRow = Math.floor(Math.random() * 10);
    if (cells.has(`${newFoodRow} ${newFoodCol}`)) {
      console.log("yes");
      generateNewFoodObject();
    } else {
      newGrid[newFoodRow][newFoodCol].state = "node-isFood";
      setState({ ...boardState, grid: newGrid });
    }
  }

  function initialGrid() {
    // Creating the initial grid
    let initialGrid = [];
    for (let i = 0; i < 10; i++) {
      initialGrid.push([]);
      for (let j = 0; j < 10; j++) {
        initialGrid[i].push(new Node(i, j));
        if (i === 4 && j === 3) {
          initialGrid[i][j].state = "node-isSnake";
        }
        if (i === 4 && j === 6) {
          initialGrid[i][j].state = "node-isFood";
        }
      }
    }
    return initialGrid;
  }

  function speedHandler(mode) {
    if (mode === "easy") {
      setSpeed(450);
    } else if (mode === "normal") {
      setSpeed(300);
    } else setSpeed(200);
  }

  function resetHandler() {
    document.getElementById("pop-up").style.display = "none";
    document.getElementById("resetButton").classList.remove("animate");
    document.getElementById("playButton").classList.add("animate");
    setRunning(false);
    setDirection("e");
    setScore(0);
    setHead({
      row: 4,
      col: 3,
      directionHead: "e",
      nextBody: new SnakeBody(4, 5, undefined),
      tail: undefined,
    });
    setState({
      grid: initialGrid(),
      isStarted: false,
    });
  }

  return (
    <div className="App">
      <Gameover />
      <Header
        resetHandler={resetHandler}
        playGame={playGame}
        speedHandler={speedHandler}
      />
      <Overlay score={gameScore} />
      <PlayArea grid={boardState.grid} />
    </div>
  );
}

export default App;
