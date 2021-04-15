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
  // The states
  const [snakeHead, setHead] = useState({
    row: 5,
    col: 5,
    directionHead: "w",
    nextBody: new SnakeBody(
      4,
      5,
      new SnakeBody(3, 5, new SnakeBody(2, 5, undefined))
    ),
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
    isRunning ? 300 : null
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
      } else setRunning(false);
    } else if (direction === "s") {
      let newSnakeHeadRow = snakeHead.row + 1;
      if (newSnakeHeadRow < 10) {
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
    if (checkPotentialDeath(newRow, newCol) === false) setRunning(false);
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
      } else setRunning(false);
    } else if (snakeHead.directionHead === "s") {
      let newSnakeHeadRow = snakeHead.row + 1;
      if (newSnakeHeadRow < 10) {
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
    if (checkPotentialDeath(newRow, newCol) === false) setRunning(false);
    setHead({
      ...snakeHead,
      col: newCol,
      row: newRow,
      directionHead: newDirection,
    });
    updateSnake(newRow, newCol);
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
    cells = cells;
    if (cells === undefined) {
      cells = new Set();
      let current = snakeHead;
      while (current) {
        cells.add(`${current.row}` + `${current.col}`);
        current = current.nextBody;
      }
    }
    if (cells.size === 79) setRunning(false); // Wins
    let newGrid = boardState.grid.slice();
    let newFoodCol = Math.floor(Math.random() * 10);
    let newFoodRow = Math.floor(Math.random() * 10);
    if (cells.has(`${newFoodRow}` + `${newFoodCol}`)) {
      generateNewFoodObject();
    } else {
      newGrid[newFoodRow][newFoodCol].state = "node-isFood";
      setState({ ...boardState, grid: newGrid });
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
    for (let i = 0; i < 10; i++) {
      initialGrid.push([]);
      for (let j = 0; j < 10; j++) {
        initialGrid[i].push(new Node(i, j));
        if (i === 5 && j === 5) {
          initialGrid[i][j].state = "node-isSnake";
        }
        if (i === 8 && j === 8) {
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
      nextBody: new SnakeBody(4, 5, new SnakeBody(3, 5, undefined)),
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
