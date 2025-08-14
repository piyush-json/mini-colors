const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active games and players
const activeGames = new Map();
const playerSessions = new Map();

// Game state management
class GameRoom {
  constructor(roomId, hostId, targetColor) {
    this.roomId = roomId;
    this.hostId = hostId;
    this.targetColor = targetColor;
    this.players = new Map();
    this.gameState = "waiting"; // waiting, playing, finished
    this.startTime = null;
    this.endTime = null;
    this.leaderboard = [];
    this.maxPlayers = 8;
  }

  addPlayer(playerId, playerName) {
    if (this.players.size >= this.maxPlayers) {
      return false;
    }

    this.players.set(playerId, {
      id: playerId,
      name: playerName,
      score: 0,
      attempts: 0,
      bestScore: 0,
      joinedAt: Date.now(),
    });

    return true;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);

    // If host leaves, assign new host or close room
    if (playerId === this.hostId && this.players.size > 0) {
      const newHost = Array.from(this.players.keys())[0];
      this.hostId = newHost;
    }

    // Close room if no players left
    if (this.players.size === 0) {
      return true; // Room should be closed
    }

    return false;
  }

  startGame() {
    this.gameState = "playing";
    this.startTime = Date.now();
    this.endTime = null;

    // Reset all player scores
    this.players.forEach((player) => {
      player.score = 0;
      player.attempts = 0;
      player.bestScore = 0;
    });
  }

  endGame() {
    this.gameState = "finished";
    this.endTime = Date.now();

    // Sort leaderboard by best scores
    this.leaderboard = Array.from(this.players.values())
      .filter((player) => player.bestScore > 0)
      .sort((a, b) => b.bestScore - a.bestScore);
  }

  submitScore(playerId, score, timeTaken) {
    const player = this.players.get(playerId);
    if (!player) return false;

    player.attempts++;
    player.score = score;

    if (score > player.bestScore) {
      player.bestScore = score;
    }

    return true;
  }

  getGameInfo() {
    return {
      roomId: this.roomId,
      hostId: this.hostId,
      targetColor: this.targetColor,
      gameState: this.gameState,
      startTime: this.startTime,
      endTime: this.endTime,
      playerCount: this.players.size,
      maxPlayers: this.maxPlayers,
      players: Array.from(this.players.values()),
      leaderboard: this.leaderboard,
    };
  }
}

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);
  console.log(`Connection details:`, {
    id: socket.id,
    handshake: {
      headers: socket.handshake.headers,
      query: socket.handshake.query,
      auth: socket.handshake.auth,
    },
  });

  // Add error handling for the socket
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  // Add transport upgrade logging
  socket.on("upgrade", () => {
    console.log(`Socket ${socket.id} upgraded to WebSocket`);
  });

  // Add transport error logging
  socket.on("upgrade_error", (error) => {
    console.error(`Socket ${socket.id} upgrade error:`, error);
  });

  // Join a game room
  socket.on("joinRoom", ({ roomId, playerName }) => {
    const game = activeGames.get(roomId);

    if (!game) {
      socket.emit("error", { message: "Game room not found" });
      return;
    }

    if (game.gameState !== "waiting") {
      socket.emit("error", { message: "Game already in progress" });
      return;
    }

    const success = game.addPlayer(socket.id, playerName);
    if (!success) {
      socket.emit("error", { message: "Room is full" });
      return;
    }

    socket.join(roomId);
    playerSessions.set(socket.id, roomId);

    // Notify all players in the room
    io.to(roomId).emit("playerJoined", {
      playerId: socket.id,
      playerName,
      gameInfo: game.getGameInfo(),
    });

    console.log(`Player ${playerName} joined room ${roomId}`);
  });

  // Create a new game room
  socket.on("createRoom", ({ playerName, targetColor }) => {
    const roomId = generateRoomId();
    const game = new GameRoom(roomId, socket.id, targetColor);

    game.addPlayer(socket.id, playerName);
    activeGames.set(roomId, game);

    socket.join(roomId);
    playerSessions.set(socket.id, roomId);

    socket.emit("roomCreated", {
      roomId,
      gameInfo: game.getGameInfo(),
    });

    console.log(`Room ${roomId} created by ${playerName}`);
  });

  // Start the game
  socket.on("startGame", ({ roomId }) => {
    const game = activeGames.get(roomId);

    if (!game || game.hostId !== socket.id) {
      socket.emit("error", { message: "Only the host can start the game" });
      return;
    }

    if (game.players.size < 2) {
      socket.emit("error", { message: "Need at least 2 players to start" });
      return;
    }

    game.startGame();

    // Notify all players that game has started
    io.to(roomId).emit("gameStarted", {
      gameInfo: game.getGameInfo(),
    });

    console.log(`Game started in room ${roomId}`);
  });

  // Submit a score
  socket.on("submitScore", ({ roomId, score, timeTaken }) => {
    const game = activeGames.get(roomId);

    if (!game || game.gameState !== "playing") {
      socket.emit("error", { message: "Game not in progress" });
      return;
    }

    const success = game.submitScore(socket.id, score, timeTaken);
    if (!success) {
      socket.emit("error", { message: "Player not found in game" });
      return;
    }

    // Notify all players of the score submission
    io.to(roomId).emit("scoreSubmitted", {
      playerId: socket.id,
      score,
      timeTaken,
      gameInfo: game.getGameInfo(),
    });

    // Check if all players have submitted scores
    const allPlayersSubmitted = Array.from(game.players.values()).every(
      (player) => player.attempts > 0,
    );

    if (allPlayersSubmitted) {
      game.endGame();

      io.to(roomId).emit("gameFinished", {
        gameInfo: game.getGameInfo(),
      });

      console.log(`Game finished in room ${roomId}`);
    }
  });

  // Set custom target color (host only)
  socket.on("setTargetColor", ({ roomId, targetColor }) => {
    const game = activeGames.get(roomId);

    if (!game || game.hostId !== socket.id) {
      socket.emit("error", {
        message: "Only the host can change the target color",
      });
      return;
    }

    if (game.gameState !== "waiting") {
      socket.emit("error", { message: "Cannot change color during game" });
      return;
    }

    game.targetColor = targetColor;

    // Notify all players of the color change
    io.to(roomId).emit("targetColorChanged", {
      targetColor,
      gameInfo: game.getGameInfo(),
    });

    console.log(`Target color changed to ${targetColor} in room ${roomId}`);
  });

  // Get room info
  socket.on("getRoomInfo", ({ roomId }) => {
    const game = activeGames.get(roomId);

    if (!game) {
      socket.emit("error", { message: "Game room not found" });
      return;
    }

    socket.emit("roomInfo", {
      gameInfo: game.getGameInfo(),
    });
  });

  // Leave room explicitly
  socket.on("leaveRoom", ({ roomId }) => {
    const game = activeGames.get(roomId);

    if (game) {
      const shouldCloseRoom = game.removePlayer(socket.id);

      if (shouldCloseRoom) {
        activeGames.delete(roomId);
        console.log(`Room ${roomId} closed (no players left)`);
      } else {
        // Notify remaining players
        io.to(roomId).emit("playerLeft", {
          playerId: socket.id,
          gameInfo: game.getGameInfo(),
        });
      }

      // Remove from player sessions
      playerSessions.delete(socket.id);
      socket.leave(roomId);
      console.log(`Player ${socket.id} left room ${roomId}`);
    }
  });

  // Disconnect handling
  socket.on("disconnect", (reason) => {
    console.log(`Player disconnected: ${socket.id}, reason: ${reason}`);

    const roomId = playerSessions.get(socket.id);

    if (roomId) {
      const game = activeGames.get(roomId);

      if (game) {
        const shouldCloseRoom = game.removePlayer(socket.id);

        if (shouldCloseRoom) {
          activeGames.delete(roomId);
          console.log(`Room ${roomId} closed (no players left)`);
        } else {
          // Notify remaining players
          io.to(roomId).emit("playerLeft", {
            playerId: socket.id,
            gameInfo: game.getGameInfo(),
          });
        }
      }

      playerSessions.delete(socket.id);
    }

    console.log(`Player disconnected: ${socket.id}`);
  });
});

// Utility function to generate room IDs
function generateRoomId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// API endpoints
app.get("/api/rooms", (req, res) => {
  const rooms = Array.from(activeGames.values()).map((game) => ({
    roomId: game.roomId,
    playerCount: game.players.size,
    maxPlayers: game.maxPlayers,
    gameState: game.gameState,
    targetColor: game.targetColor,
  }));

  res.json({ rooms });
});

app.get("/api/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const game = activeGames.get(roomId);

  if (!game) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json({ gameInfo: game.getGameInfo() });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    activeGames: activeGames.size,
    connectedPlayers: io.engine.clientsCount,
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Color Hunter Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for real-time connections`);
  console.log(
    `🌐 CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:3000"}`,
  );
});

// Add server error handling
server.on("error", (error) => {
  console.error("Server error:", error);
});

// Add Socket.IO error handling
io.engine.on("connection_error", (err) => {
  console.error("Socket.IO connection error:", err);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
