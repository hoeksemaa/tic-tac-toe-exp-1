import express from "express";
import ViteExpress from "vite-express";

const app = express();
app.use(express.json());

// --------------- In-memory game store ---------------

const games = new Map();
let nextId = 1;

function createGame() {
  const id = String(nextId++);
  const game = {
    id,
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
  };
  games.set(id, game);
  return game;
}

// --------------- Game logic ---------------

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // "X" or "O"
    }
  }
  if (board.every((cell) => cell !== null)) return "draw";
  return null;
}

// --------------- API routes ---------------

// GET all games
app.get("/api/games", (_req, res) => {
  res.json([...games.values()]);
});

// POST create new game
app.post("/api/games", (_req, res) => {
  const game = createGame();
  res.status(201).json(game);
});

// GET single game by id
app.get("/api/games/:id", (req, res) => {
  const game = games.get(req.params.id);
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(game);
});

// POST make a move
app.post("/api/games/:id/move", (req, res) => {
  const game = games.get(req.params.id);
  if (!game) return res.status(404).json({ error: "Game not found" });

  if (game.winner) {
    return res.status(400).json({ error: "Game is already over" });
  }

  const { cell } = req.body;
  if (cell == null || cell < 0 || cell > 8) {
    return res.status(400).json({ error: "Invalid cell (must be 0-8)" });
  }
  if (game.board[cell] !== null) {
    return res.status(400).json({ error: "Cell already taken" });
  }

  game.board[cell] = game.currentPlayer;
  game.winner = checkWinner(game.board);
  if (!game.winner) {
    game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
  }

  res.json(game);
});

// --------------- Start server ---------------

const PORT = 3000;
ViteExpress.listen(app, PORT, () => {
  console.log(`Tic-Tac-Toe running at http://localhost:${PORT}`);
});
