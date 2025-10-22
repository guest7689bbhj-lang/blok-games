const rows = 12;
const cols = 8;
const colors = ["#FF6B6B", "#4ECDC4", "#F7B801", "#556270", "#C7F464"];
let grid = [];
let score = 0;
let best = localStorage.getItem("bestScore") || 0;

const board = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
bestDisplay.textContent = best;

// Generate game grid
function createGrid() {
  grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = Math.floor(Math.random() * colors.length);
    }
  }
  render();
}

// Render game board
function render() {
  board.innerHTML = "";
  scoreDisplay.textContent = score;
  bestDisplay.textContent = best;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (grid[r][c] === -1) {
        cell.classList.add("empty");
      } else {
        cell.style.background = colors[grid[r][c]];
      }
      cell.addEventListener("click", () => onCellClick(r, c));
      board.appendChild(cell);
    }
  }
}

// Find group connected (recursive flood fill)
function findGroup(r, c, color, visited = []) {
  if (
    r < 0 || r >= rows ||
    c < 0 || c >= cols ||
    grid[r][c] !== color ||
    visited.some(([vr, vc]) => vr === r && vc === c)
  ) return visited;

  visited.push([r, c]);
  findGroup(r + 1, c, color, visited);
  findGroup(r - 1, c, color, visited);
  findGroup(r, c + 1, color, visited);
  findGroup(r, c - 1, color, visited);
  return visited;
}

// Remove and collapse
function onCellClick(r, c) {
  const color = grid[r][c];
  if (color === -1) return;
  const group = findGroup(r, c, color, []);
  if (group.length < 2) return;

  // remove
  group.forEach(([gr, gc]) => (grid[gr][gc] = -1));
  score += group.length * (group.length - 1);
  if (score > best) {
    best = score;
    localStorage.setItem("bestScore", best);
  }

  collapse();
  render();
}

// Collapse columns + refill
function collapse() {
  for (let c = 0; c < cols; c++) {
    let stack = [];
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r][c] !== -1) stack.push(grid[r][c]);
    }
    for (let r = rows - 1; r >= 0; r--) {
      grid[r][c] = stack.length ? stack.shift() : Math.random() * colors.length | 0;
    }
  }
}

// Reset
document.getElementById("resetBtn").addEventListener("click", () => {
  score = 0;
  createGrid();
});

createGrid();