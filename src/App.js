import { useState, useEffect } from "react";
import useInterval from "./useInterval";
import { changePosition } from "./keypressHandler";
import Node from "./node";
import Header from "./Components/Header";
import PlayArea from "./Components/PlayArea";

class SnakeBody {
  constructor(row, col, next) {
    this.row = row;
    this.col = col;
    this.nextBody = next;
  }
}

function App() {
  const [snakeHead, setHead] = useState({
    row: 5,
    col: 5,
    directionHead: "w",
    nextBody: new SnakeBody(
      4,
      5,
      new SnakeBody(3, 5, new SnakeBody(2, 5, undefined))
    ), // access by -> nextBody.row, nextBody.col
    // nextBody: undefined,
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
      resetBoard();
      moveSnake();
    },
    isRunning ? 200 : null
  );

  function moveSnake() {
    if (isDirectionValid()) {
      updateSnakeHeadUsingGlobalDirection();
    } else updateSnakeHeadUsingSnakeHeadDirection(); // board updates are now in these functions
    // maybe when snake children updated make the board changes one functions
    //    for the head and the childs
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

  function updateSnake(newRow, newCol) {
    // Basis of the linked list
    // Maybe make a new body for every body and just fix it that way
    // 1st body
    let current = snakeHead.nextBody;
    let previous = snakeHead;

    while (current !== undefined) {
      let saveCurrent = new SnakeBody(
        current.row,
        current.col,
        current.nextBody
      );
      current.col = previous.col;
      current.row = previous.row;
      previous = saveCurrent;
      current = current.nextBody;
    }

    updateBoard(newRow, newCol);
  }

  function resetBoard() {
    let newGrid = boardState.grid.slice();
    newGrid[snakeHead.row][snakeHead.col].state = "node";
    let current = snakeHead.nextBody;
    while (current !== undefined) {
      newGrid[current.row][current.col].state = "node";
      current = current.nextBody;
    }
    setState({ ...boardState, grid: newGrid });
  }

  function updateBoard(row, col) {
    let newGrid = boardState.grid.slice();
    newGrid[row][col].state = "node-isSnake";
    let current = snakeHead.nextBody;
    while (current !== undefined) {
      newGrid[current.row][current.col].state = "node-isSnakeBody";
      current = current.nextBody;
    }
    setState({ ...boardState, grid: newGrid });
  }

  function updateSnakeHeadUsingGlobalDirection() {
    var newCol = snakeHead.col;
    let newRow = snakeHead.row;
    let newDirection = "";
    if (direction === "e") {
      let newSnakeHeadCol = snakeHead.col + 1;
      if (newSnakeHeadCol < 19) {
        newCol = newSnakeHeadCol;
        newDirection = "e";
      } else setRunning(false);
    } else if (direction === "s") {
      let newSnakeHeadRow = snakeHead.row + 1;
      if (newSnakeHeadRow < 19) {
        newRow = newSnakeHeadRow;
        newDirection = "s";
      } else setRunning(false);
    } else if (direction === "w") {
      let newSnakeHeadCol = snakeHead.col - 1;
      if (newSnakeHeadCol >= 0) {
        newCol = newSnakeHeadCol;
        newDirection = "w";
      } else setRunning(false);
    } else if (direction === "n") {
      let newSnakeHeadRow = snakeHead.row - 1;
      if (newSnakeHeadRow >= 0) {
        newRow = newSnakeHeadRow;
        newDirection = "n";
      } else setRunning(false);
    }
    setHead({
      ...snakeHead,
      col: newCol,
      row: newRow,
      directionHead: newDirection,
    });
    updateSnake(newRow, newCol);
  }

  function updateSnakeHeadUsingSnakeHeadDirection() {
    let newCol = snakeHead.col;
    let newRow = snakeHead.row;
    let newDirection = "";
    if (snakeHead.directionHead === "e") {
      let newSnakeHeadCol = snakeHead.col + 1;
      if (newSnakeHeadCol < 19) {
        newCol = newSnakeHeadCol;
        newDirection = "e";
      } else setRunning(false);
    } else if (snakeHead.directionHead === "s") {
      let newSnakeHeadRow = snakeHead.row + 1;
      if (newSnakeHeadRow < 19) {
        newRow = newSnakeHeadRow;
        newDirection = "s";
      } else setRunning(false);
    } else if (snakeHead.directionHead === "w") {
      let newSnakeHeadCol = snakeHead.col - 1;
      if (newSnakeHeadCol >= 0) {
        newCol = newSnakeHeadCol;
        newDirection = "w";
      } else setRunning(false);
    } else if (snakeHead.directionHead === "n") {
      let newSnakeHeadRow = snakeHead.row - 1;
      if (newSnakeHeadRow >= 0) {
        newRow = newSnakeHeadRow;
        newDirection = "n";
      } else setRunning(false);
    }
    setHead({
      ...snakeHead,
      col: newCol,
      row: newRow,
      directionHead: newDirection,
    });
    updateSnake(newRow, newCol);
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
        if (i === 10 && j === 10) {
          initialGrid[i][j].state = "node-isFood";
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
      nextBody: new SnakeBody(4, 5, undefined),
      // nextBody: undefined,
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
