class Node {
  // A node class
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.id = `${row}-${col}`;
    this.state = "node"; // the default "unvisited" node
  }
}
export default Node;
