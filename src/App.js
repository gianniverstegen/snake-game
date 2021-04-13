import { useState, useEffect } from "react";
import useInterval from "./useInterval";
import { changePosition } from "./keypressHandler";
import Node from "./node";
import Header from "./Components/Header";
import PlayArea from "./Components/PlayArea";

class SnakeBody {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.nextBody = undefined;
    this.direction = undefined;
  }
}

function App() {
  const [snakeHead, setHead] = useState({
    row: 5,
    col: 5,
    directionHead: "w",
    nextBody: new SnakeBody(4, 5), // access by -> nextBody.row, nextBody.col
    tail: undefined,
  });
  const [boardState, setState] = useState({
    grid: initialGrid(),
    isStarted: false,
    currentMode: "play",
  });
  const [isRunning, setRunning] = useState(true);
  const [direction, setDirection] = useState("e");

  useEffect(() => {
    window.addEventListener("keypress", (e) => {
      e.stopImmediatePropagation();
      handleDirectionChange(e);
    });
  });

  useInterval(
    () => {
      moveSnake();
    },
    isRunning ? 500 : null
  );

  function moveSnake() {
    if (isDirectionValid()) {
      updateSnakeHeadUsingGlobalDirection();
    } else updateSnakeHeadUsingSnakeHeadDirection(); // board updates are now in these functions
    // maybe when snake children updated make the board changes one functions
    //    for the head and the childs
    updateSnake();
    // updateBoard();
  }

  function handleDirectionChange(e) {
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
    // console.log();
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

  function updateSnake() {
    // Basis of the linked list
    let current = snakeHead;
    let next = snakeHead.nextBody;
    next.row = current.row;
    next.col = current.col;

    while (current.nextBody !== undefined) {
      next.row = current.row;
      next.col = current.col;
      current = current.nextBody;
      next = next.nextBody;
    }

    console.log(snakeHead.nextBody.row, snakeHead.nextBody.col);
  }

  function resetBoard() {
    // reset the board here
  }

  function updateBoard() {
    //update the board here
    let newGrid = boardState.grid.slice();
    let current = snakeHead;
    while (current.nextBody !== undefined) {
      newGrid[current.row][current.col].state = "node-isSnake";
      current = current.nextBody;
    }
  }

  function updateSnakeHeadUsingGlobalDirection() {
    let newGrid = boardState.grid.slice();
    if (direction === "e") {
      let newSnakeHeadCol = snakeHead.col + 1;
      if (newSnakeHeadCol < 19) {
        newGrid[snakeHead.row][snakeHead.col].state = "node";
        newGrid[snakeHead.row][newSnakeHeadCol].state = "node-isSnake";
        setHead({ ...snakeHead, col: newSnakeHeadCol, directionHead: "e" });
      } else setRunning(false);
    } else if (direction === "s") {
      let newSnakeHeadRow = snakeHead.row + 1;
      if (newSnakeHeadRow < 19) {
        newGrid[snakeHead.row][snakeHead.col].state = "node";
        newGrid[newSnakeHeadRow][snakeHead.col].state = "node-isSnake";
        setHead({ ...snakeHead, row: newSnakeHeadRow, directionHead: "s" });
      } else setRunning(false);
    } else if (direction === "w") {
      let newSnakeHeadCol = snakeHead.col - 1;
      if (newSnakeHeadCol >= 0) {
        newGrid[snakeHead.row][snakeHead.col].state = "node";
        newGrid[snakeHead.row][newSnakeHeadCol].state = "node-isSnake";
        setHead({ ...snakeHead, col: newSnakeHeadCol, directionHead: "w" });
      } else setRunning(false);
    } else if (direction === "n") {
      let newSnakeHeadRow = snakeHead.row - 1;
      if (newSnakeHeadRow >= 0) {
        newGrid[snakeHead.row][snakeHead.col].state = "node";
        newGrid[newSnakeHeadRow][snakeHead.col].state = "node-isSnake";
        setHead({ ...snakeHead, row: newSnakeHeadRow, directionHead: "n" });
      } else setRunning(false);
    }
  }

  function updateSnakeHeadUsingSnakeHeadDirection() {
    let newGrid = boardState.grid.slice();
    if (snakeHead.directionHead === "e") {
      let newSnakeHeadCol = snakeHead.col + 1;
      if (newSnakeHeadCol < 19) {
        newGrid[snakeHead.row][snakeHead.col].state = "node";
        newGrid[snakeHead.row][newSnakeHeadCol].state = "node-isSnake";
        setHead({ ...snakeHead, col: newSnakeHeadCol, directionHead: "e" });
      } else setRunning(false);
    } else if (snakeHead.directionHead === "s") {
      let newSnakeHeadRow = snakeHead.row + 1;
      if (newSnakeHeadRow < 19) {
        newGrid[snakeHead.row][snakeHead.col].state = "node";
        newGrid[newSnakeHeadRow][snakeHead.col].state = "node-isSnake";
        setHead({ ...snakeHead, row: newSnakeHeadRow, directionHead: "s" });
      } else setRunning(false);
    } else if (snakeHead.directionHead === "w") {
      let newSnakeHeadCol = snakeHead.col - 1;
      if (newSnakeHeadCol >= 0) {
        newGrid[snakeHead.row][snakeHead.col].state = "node";
        newGrid[snakeHead.row][newSnakeHeadCol].state = "node-isSnake";
        setHead({ ...snakeHead, col: newSnakeHeadCol, directionHead: "w" });
      } else setRunning(false);
    } else if (snakeHead.directionHead === "n") {
      let newSnakeHeadRow = snakeHead.row - 1;
      if (newSnakeHeadRow >= 0) {
        newGrid[snakeHead.row][snakeHead.col].state = "node";
        newGrid[newSnakeHeadRow][snakeHead.col].state = "node-isSnake";
        setHead({ ...snakeHead, row: newSnakeHeadRow, directionHead: "n" });
      } else setRunning(false);
    }
  }

  function switchMode() {
    if (boardState.currentMode === "play") {
      setState({ ...boardState, currentMode: "simulate" });
    } else setState({ ...boardState, currentMode: "play" });
  }

  function initialGrid() {
    // Creating the initial grid
    let initialGrid = [];
    for (let i = 0; i < 19; i++) {
      initialGrid.push([]);
      for (let j = 0; j < 19; j++) {
        initialGrid[i].push(new Node(i, j));
        if (i === 5 && j === 5) {
          initialGrid[i][j].state = "node-isSnake";
        }
      }
    }
    return initialGrid;
  }

  function resetHandler() {
    setRunning(true);
    setDirection("e");
    setHead({
      row: 5,
      col: 5,
      directionHead: "w",
      nextBody: new SnakeBody(4, 5),
      tail: undefined,
    });
    setState({
      grid: initialGrid(),
      isStarted: false,
      currentMode: "play",
    });
  }

  return (
    <div className="App">
      <Header
        resetHandler={resetHandler}
        currentMode={boardState.currentMode}
        switchMode={switchMode}
      />
      <PlayArea grid={boardState.grid} />
    </div>
  );
}

export default App;
