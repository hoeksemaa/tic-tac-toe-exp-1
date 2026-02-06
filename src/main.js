// --------------- DOM refs ---------------

const lobbyView = document.getElementById("lobby");
const gameView = document.getElementById("game");
const gameList = document.getElementById("game-list");
const createGameBtn = document.getElementById("create-game-btn");
const backToLobbyBtn = document.getElementById("back-to-lobby-btn");
const boardEl = document.getElementById("board");
const gameStatus = document.getElementById("game-status");

let currentGameId = null;

// --------------- API helpers ---------------

async function api(path, opts = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  return res.json();
}

// --------------- View switching ---------------

function showLobby() {
  currentGameId = null;
  gameView.classList.add("hidden");
  lobbyView.classList.remove("hidden");
  loadGames();
}

function showGame(id) {
  currentGameId = id;
  lobbyView.classList.add("hidden");
  gameView.classList.remove("hidden");
  loadGame(id);
}

// --------------- Lobby ---------------

async function loadGames() {
  const games = await api("/games");
  gameList.innerHTML = "";

  if (games.length === 0) {
    gameList.innerHTML =
      '<p style="color:#777; text-align:center;">No games yet. Create one!</p>';
    return;
  }

  // Show newest first
  games.reverse().forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";

    const status = game.winner
      ? game.winner === "draw"
        ? "Draw"
        : `${game.winner} won`
      : `${game.currentPlayer}'s turn`;

    card.innerHTML = `
      <span class="game-id">Game #${game.id}</span>
      <span class="game-info">${status}</span>
    `;
    card.addEventListener("click", () => showGame(game.id));
    gameList.appendChild(card);
  });
}

async function createNewGame() {
  const game = await api("/games", { method: "POST" });
  showGame(game.id);
}

// --------------- Game board ---------------

async function loadGame(id) {
  const game = await api(`/games/${id}`);
  renderBoard(game);
  renderStatus(game);
}

function renderBoard(game) {
  boardEl.innerHTML = "";

  // Remove any existing banner
  const oldBanner = document.querySelector(".winner-banner");
  if (oldBanner) oldBanner.remove();

  game.board.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.className = "cell" + (value ? " taken" : "");

    if (value) {
      const span = document.createElement("span");
      span.className = value.toLowerCase();
      span.textContent = value;
      cell.appendChild(span);
    }

    cell.addEventListener("click", () => onCellClick(game, index));
    boardEl.appendChild(cell);
  });

  if (game.winner) {
    const banner = document.createElement("div");
    banner.className = "winner-banner";
    banner.textContent =
      game.winner === "draw" ? "It's a draw!" : `${game.winner} wins!`;
    boardEl.parentElement.appendChild(banner);
  }
}

function renderStatus(game) {
  if (game.winner) {
    gameStatus.textContent =
      game.winner === "draw"
        ? "Game Over — Draw"
        : `Game Over — ${game.winner} wins!`;
  } else {
    gameStatus.textContent = `${game.currentPlayer}'s turn`;
  }
}

async function onCellClick(game, cell) {
  // Don't allow clicks on taken cells or finished games
  if (game.board[cell] || game.winner) return;

  const updated = await api(`/games/${game.id}/move`, {
    method: "POST",
    body: { cell },
  });

  if (updated.error) return;
  renderBoard(updated);
  renderStatus(updated);
}

// --------------- Event listeners ---------------

createGameBtn.addEventListener("click", createNewGame);
backToLobbyBtn.addEventListener("click", showLobby);

// --------------- Init ---------------

showLobby();
