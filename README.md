# Snake Game

Classic Snake implemented with no external dependencies.

## Run

1. From `/Users/maxiaodou/Documents/New project`, start a static server:
   ```bash
   python3 -m http.server 8000
   ```
2. Open `http://localhost:8000`.

## Controls

- Keyboard: Arrow keys or `W/A/S/D`
- Mobile/on-screen: Up/Down/Left/Right buttons
- `Pause` / `Resume`
- `Restart`

## Manual Verification Checklist

- Snake moves one cell per tick and keeps direction when no new input.
- Opposite-direction instant reversal is blocked (e.g., moving right cannot immediately go left).
- Eating food grows snake by one and increments score by one.
- Wall collision triggers game over.
- Self collision triggers game over.
- Pause halts movement, resume continues movement.
- Restart resets board, score, and game state.
