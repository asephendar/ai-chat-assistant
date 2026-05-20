const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);
  
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

const games = new Map();
const players = new Map();
let waitingPlayer = null;

function createGame(white, black) {
  const id = 'game_' + Date.now();
  const board = createInitialBoard();
  games.set(id, {
    id,
    board,
    turn: 'white',
    white,
    black,
    moveHistory: [],
    capturedWhite: [],
    capturedBlack: [],
    status: 'playing',
    winner: null,
  });
  return id;
}

function createInitialBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: backRow[i], color: 'black' };
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
    board[7][i] = { type: backRow[i], color: 'white' };
  }
  return board;
}

function isValidMove(board, from, to, turn) {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== turn) return false;
  
  const dr = to.row - from.row;
  const dc = to.col - from.col;
  const target = board[to.row][to.col];
  
  if (target && target.color === turn) return false;
  
  switch (piece.type) {
    case 'pawn': {
      const dir = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      
      if (dc === 0 && !target) {
        if (dr === dir) return true;
        if (from.row === startRow && dr === 2 * dir && !board[from.row + dir][from.col]) return true;
      }
      if (Math.abs(dc) === 1 && dr === dir && target && target.color !== piece.color) return true;
      return false;
    }
    case 'rook': {
      if (dr !== 0 && dc !== 0) return false;
      return isPathClear(board, from, to);
    }
    case 'knight': {
      return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    }
    case 'bishop': {
      if (Math.abs(dr) !== Math.abs(dc)) return false;
      return isPathClear(board, from, to);
    }
    case 'queen': {
      if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return false;
      return isPathClear(board, from, to);
    }
    case 'king': {
      return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    }
    default:
      return false;
  }
}

function isPathClear(board, from, to) {
  const dr = Math.sign(to.row - from.row);
  const dc = Math.sign(to.col - from.col);
  let r = from.row + dr;
  let c = from.col + dc;
  
  while (r !== to.row || c !== to.col) {
    if (board[r][c]) return false;
    r += dr;
    c += dc;
  }
  return true;
}

function isInCheck(board, color) {
  let kingPos = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'king' && p.color === color) {
        kingPos = { row: r, col: c };
        break;
      }
    }
    if (kingPos) break;
  }
  if (!kingPos) return false;
  
  const enemy = color === 'white' ? 'black' : 'white';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === enemy) {
        if (isValidMove(board, { row: r, col: c }, kingPos, enemy)) {
          return true;
        }
      }
    }
  }
  return false;
}

function hasValidMoves(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === color) {
        for (let tr = 0; tr < 8; tr++) {
          for (let tc = 0; tc < 8; tc++) {
            if (isValidMove(board, { row: r, col: c }, { row: tr, col: tc }, color)) {
              const testBoard = board.map(row => [...row]);
              testBoard[tr][tc] = testBoard[r][c];
              testBoard[r][c] = null;
              if (!isInCheck(testBoard, color)) return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

function sendToPlayer(playerId, data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.playerId === playerId && client.readyState === 1) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws) => {
  const id = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  ws.playerId = id;
  players.set(id, { id, name: 'Player ' + (players.size + 1), status: 'waiting' });
  
  ws.send(JSON.stringify({ type: 'init', id, name: players.get(id).name }));
  broadcast({ type: 'player_list', players: Array.from(players.values()) });

  if (waitingPlayer) {
    const gameId = createGame(waitingPlayer, id);
    const game = games.get(gameId);
    
    sendToPlayer(waitingPlayer, {
      type: 'game_start',
      gameId,
      color: 'white',
      board: game.board,
      opponent: players.get(id).name,
    });
    
    sendToPlayer(id, {
      type: 'game_start',
      gameId,
      color: 'black',
      board: game.board.map(row => [...row]),
      opponent: players.get(waitingPlayer).name,
    });
    
    players.get(waitingPlayer).status = 'playing';
    players.get(id).status = 'playing';
    waitingPlayer = null;
    
    broadcast({ type: 'player_list', players: Array.from(players.values()) });
  } else {
    waitingPlayer = id;
    players.get(id).status = 'waiting';
    broadcast({ type: 'player_list', players: Array.from(players.values()) });
  }

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      
      if (data.type === 'move') {
        const game = games.get(data.gameId);
        if (!game || game.status !== 'playing') return;
        
        const playerColor = ws.playerId === game.white ? 'white' : 'black';
        if (playerColor !== game.turn) return;
        
        const from = { row: data.from.row, col: data.from.col };
        const to = { row: data.to.row, col: data.to.col };
        
        if (!isValidMove(game.board, from, to, game.turn)) return;
        
        const captured = game.board[to.row][to.col];
        game.board[to.row][to.col] = game.board[from.row][from.col];
        game.board[from.row][from.col] = null;
        
        if (captured) {
          if (captured.color === 'white') {
            game.capturedBlack.push(captured);
          } else {
            game.capturedWhite.push(captured);
          }
        }
        
        if (game.board[to.row][to.col].type === 'pawn' && (to.row === 0 || to.row === 7)) {
          game.board[to.row][to.col].type = 'queen';
        }
        
        game.moveHistory.push({ from, to, piece: game.board[to.row][to.col], captured });
        
        const nextTurn = game.turn === 'white' ? 'black' : 'white';
        
        if (isInCheck(game.board, nextTurn)) {
          if (!hasValidMoves(game.board, nextTurn)) {
            game.status = 'finished';
            game.winner = game.turn;
          }
        } else if (!hasValidMoves(game.board, nextTurn)) {
          game.status = 'draw';
        }
        
        game.turn = nextTurn;
        
        const boardForBlack = game.board.map(row => [...row]);
        
        sendToPlayer(game.white, {
          type: 'move_made',
          gameId: data.gameId,
          from,
          to,
          captured,
          turn: game.turn,
          status: game.status,
          winner: game.winner,
          board: game.board,
          capturedWhite: game.capturedWhite,
          capturedBlack: game.capturedBlack,
        });
        
        sendToPlayer(game.black, {
          type: 'move_made',
          gameId: data.gameId,
          from,
          to,
          captured,
          turn: game.turn,
          status: game.status,
          winner: game.winner,
          board: boardForBlack,
          capturedWhite: game.capturedWhite,
          capturedBlack: game.capturedBlack,
        });
      }
      
      if (data.type === 'resign') {
        const game = games.get(data.gameId);
        if (!game) return;
        game.status = 'finished';
        game.winner = ws.playerId === game.white ? 'black' : 'white';
        
        sendToPlayer(game.white, {
          type: 'game_over',
          gameId: data.gameId,
          winner: game.winner,
          reason: 'resign',
        });
        sendToPlayer(game.black, {
          type: 'game_over',
          gameId: data.gameId,
          winner: game.winner,
          reason: 'resign',
        });
        
        players.get(game.white).status = 'waiting';
        players.get(game.black).status = 'waiting';
        broadcast({ type: 'player_list', players: Array.from(players.values()) });
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on('close', () => {
    players.delete(id);
    if (waitingPlayer === id) waitingPlayer = null;
    
    games.forEach((game, gameId) => {
      if (game.white === id || game.black === id) {
        const opponent = game.white === id ? game.black : game.white;
        sendToPlayer(opponent, {
          type: 'opponent_left',
          gameId,
        });
        games.delete(gameId);
      }
    });
    
    broadcast({ type: 'player_list', players: Array.from(players.values()) });
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Chess server running on http://localhost:${PORT}`);
});
