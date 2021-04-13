function changePosition(event, grid, firstNode) {
  // Handles the keypressen
  if (firstNode === undefined) return;
  let newGrid = grid.slice();
  if (event.code === "KeyS") {
    newGrid[firstNode.row][firstNode.col].state = "node";
    newGrid[firstNode.row + 1][firstNode.col].state = "node-isSnake";
    firstNode = newGrid[firstNode.row + 1][firstNode.col];
    return [newGrid, firstNode];
  }
}

export { changePosition };
