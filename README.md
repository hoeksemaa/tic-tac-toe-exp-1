# Tic Tac Toe
by Claude

## Prompt
Hello! Can you build a system for me please?

There is a system architecture diagram that I’ve drawn for you and placed in this directory. Please reference it as a map to construct the system. All maps have a degree of ambiguity; use your judgement.

Spend as much time as you need to make the system fully functional. I want a fully-built system that runs smoothly out of the box. I’ll handle any necessary installs; just writing the software will be fine. Feel free to create as many files in this directory as you please. Prioritize simplicity where possible and feel free to get a bit creative!

Give me an overview of the system and how to operate it at the end.

You’re a very talented engineer and I know you’re gonna do amazing :)

## System Architecture Image

![diagram of Vite Express server with client and lobby](tic-tac-toe-system-diagram.jpg)

## Claude's System Overview

System Overview

![Architecture and API Endpoints tables](tables.jpg)

  Files created:

  - package.json — project config & deps
  - server.js — Express server, game logic, API routes
  - vite.config.js — Vite configuration
  - index.html — entry point with both views
  - src/main.js — client-side logic (view switching, API calls, board rendering)
  - src/style.css — dark-themed styling

  How to Run

  npm install   # (already done)
  npm run dev

  Then open http://localhost:3000 in your browser.

  How to play:
  1. Click "Create New Game" in the lobby
  2. Click cells on the board to place X's and O's (alternating turns)
  3. The status bar shows whose turn it is and announces the winner or draw
  4. Click "Lobby" to go back and see all your games or start a new one
