export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITE = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

export function createInitialState(randomFn = Math.random) {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];

  return {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    snake,
    direction: "right",
    food: placeFood(snake, GRID_WIDTH, GRID_HEIGHT, randomFn),
    score: 0,
    status: "running"
  };
}

export function sanitizeDirection(currentDirection, requestedDirection) {
  if (!requestedDirection) return currentDirection;
  if (!DIRECTIONS[requestedDirection]) return currentDirection;
  if (OPPOSITE[currentDirection] === requestedDirection) return currentDirection;
  return requestedDirection;
}

export function step(state, requestedDirection, randomFn = Math.random) {
  if (state.status !== "running") return state;

  const direction = sanitizeDirection(state.direction, requestedDirection);
  const head = state.snake[0];
  const nextHead = {
    x: head.x + DIRECTIONS[direction].x,
    y: head.y + DIRECTIONS[direction].y
  };

  const hitsWall =
    nextHead.x < 0 ||
    nextHead.x >= state.width ||
    nextHead.y < 0 ||
    nextHead.y >= state.height;
  const ateFood = state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const bodyToCheck = ateFood ? state.snake : state.snake.slice(0, -1);
  const hitsSelf = bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

  if (hitsWall || hitsSelf) {
    return {
      ...state,
      direction,
      status: "game_over"
    };
  }

  const grownSnake = [nextHead, ...state.snake];
  const snake = ateFood ? grownSnake : grownSnake.slice(0, -1);
  const food = ateFood ? placeFood(snake, state.width, state.height, randomFn) : state.food;
  const score = ateFood ? state.score + 1 : state.score;

  return {
    ...state,
    snake,
    food,
    direction,
    score
  };
}

export function placeFood(snake, width, height, randomFn = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const available = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) available.push({ x, y });
    }
  }

  if (available.length === 0) return null;
  const index = Math.floor(randomFn() * available.length);
  return available[index];
}
