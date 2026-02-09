import { GRID_HEIGHT, GRID_WIDTH, createInitialState, step } from "./snake-logic.js";

const TICK_MS = 140;
const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const overlayEl = document.getElementById("overlay");
const overlayTextEl = document.getElementById("overlay-text");
const pauseBtn = document.getElementById("pause");
const restartBtn = document.getElementById("restart");
const restartOverlayBtn = document.getElementById("restart-overlay");
const mobileControlsEl = document.querySelector(".mobile-controls");

let state = createInitialState();
let requestedDirection = null;
let paused = false;

boardEl.style.gridTemplateColumns = `repeat(${GRID_WIDTH}, minmax(0, 1fr))`;
for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i += 1) {
  const cell = document.createElement("div");
  cell.className = "cell";
  boardEl.appendChild(cell);
}

const cells = Array.from(boardEl.children);

function getIndex(x, y) {
  return y * GRID_WIDTH + x;
}

function setDirection(direction) {
  requestedDirection = direction;
}

function directionFromKey(key) {
  const normalized = key.toLowerCase();
  if (normalized === "arrowup" || normalized === "w") return "up";
  if (normalized === "arrowdown" || normalized === "s") return "down";
  if (normalized === "arrowleft" || normalized === "a") return "left";
  if (normalized === "arrowright" || normalized === "d") return "right";
  return null;
}

function render() {
  for (const cell of cells) {
    cell.className = "cell";
  }

  for (const segment of state.snake) {
    const idx = getIndex(segment.x, segment.y);
    if (cells[idx]) cells[idx].classList.add("snake");
  }

  if (state.food) {
    const foodIdx = getIndex(state.food.x, state.food.y);
    if (cells[foodIdx]) cells[foodIdx].classList.add("food");
  }

  scoreEl.textContent = String(state.score);

  if (state.status === "game_over") {
    statusEl.textContent = "Game Over";
    overlayTextEl.textContent = `Game Over - Score ${state.score}`;
    overlayEl.classList.remove("hidden");
  } else if (paused) {
    statusEl.textContent = "Paused";
    overlayTextEl.textContent = "Paused";
    overlayEl.classList.remove("hidden");
  } else {
    statusEl.textContent = "Running";
    overlayEl.classList.add("hidden");
  }
}

function tick() {
  if (paused || state.status !== "running") return;
  state = step(state, requestedDirection);
  requestedDirection = null;
  render();
}

function restart() {
  state = createInitialState();
  requestedDirection = null;
  paused = false;
  pauseBtn.textContent = "Pause";
  render();
}

document.addEventListener("keydown", (event) => {
  const direction = directionFromKey(event.key);
  if (!direction) return;
  event.preventDefault();
  setDirection(direction);
});

pauseBtn.addEventListener("click", () => {
  if (state.status === "game_over") return;
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  render();
});

restartBtn.addEventListener("click", restart);
restartOverlayBtn.addEventListener("click", restart);

mobileControlsEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const dir = target.getAttribute("data-dir");
  if (dir) setDirection(dir);
});

render();
window.setInterval(tick, TICK_MS);
