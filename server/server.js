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
  transports: ["polling", "websocket"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
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
    this.hostId = hostId; // Current denner/host
    this.targetColor = targetColor;
    this.players = new Map();
    this.gameState = "lobby"; // lobby, gameSelection, playing, roundFinished, sessionFinished
    this.gameType = null; // "findColor" or "colorMixing"
    this.currentRound = 0;
    this.maxRounds = 3; // Configurable rounds per session
    this.startTime = null;
    this.endTime = null;
    this.roundResults = [];
    this.sessionLeaderboard = [];
    this.maxPlayers = 8;
    this.minPlayers = 2;
    this.dennerRotation = []; // Track denner rotation
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
      sessionScore: 0, // Total score across all rounds
      roundScores: [], // Scores for each round
      joinedAt: Date.now(),
    });

    // Initialize denner rotation if this is the first player
    if (this.dennerRotation.length === 0) {
      this.dennerRotation.push(playerId);
    } else {
      this.dennerRotation.push(playerId);
    }

    return true;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);

    // Remove from denner rotation
    const index = this.dennerRotation.indexOf(playerId);
    if (index > -1) {
      this.dennerRotation.splice(index, 1);
    }

    // If current denner leaves, assign new denner
    if (playerId === this.hostId && this.dennerRotation.length > 0) {
      this.hostId = this.dennerRotation[0];
    }

    // Close room if no players left
    if (this.players.size === 0) {
      return true; // Room should be closed
    }

    return false;
  }

  rotateDenner() {
    if (this.dennerRotation.length <= 1) return;

    const currentIndex = this.dennerRotation.indexOf(this.hostId);
    const nextIndex = (currentIndex + 1) % this.dennerRotation.length;
    this.hostId = this.dennerRotation[nextIndex];
  }

  selectGameType(gameType) {
    if (this.gameState !== "lobby") return false;

    this.gameType = gameType;
    this.gameState = "gameSelection";
    return true;
  }

  startRound() {
    if (this.players.size < this.minPlayers) return false;

    this.gameState = "playing";
    this.startTime = Date.now();
    this.endTime = null;
    this.currentRound++;

    // Reset round scores
    this.players.forEach((player) => {
      player.score = 0;
      player.attempts = 0;
    });

    return true;
  }

  endRound() {
    this.gameState = "roundFinished";
    this.endTime = Date.now();

    // Calculate round results
    const roundResult = {
      round: this.currentRound,
      gameType: this.gameType,
      denner: this.hostId,
      players: Array.from(this.players.values()).map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        attempts: p.attempts,
      })),
      timestamp: this.endTime,
    };

    this.roundResults.push(roundResult);

    // Update session scores
    this.players.forEach((player) => {
      player.sessionScore += player.score;
      player.roundScores.push(player.score);
    });

    // Check if session should end
    if (this.currentRound >= this.maxRounds) {
      this.endSession();
    }
  }

  endSession() {
    this.gameState = "sessionFinished";

    // Calculate final leaderboard
    this.sessionLeaderboard = Array.from(this.players.values())
      .sort((a, b) => b.sessionScore - a.sessionScore)
      .map((player, index) => ({
        rank: index + 1,
        ...player,
      }));
  }

  submitScore(playerId, score, timeTaken) {
    const player = this.players.get(playerId);
    if (!player) return false;

    player.attempts++;
    player.score = Math.max(player.score, score); // Keep best score for this round

    if (score > player.bestScore) {
      player.bestScore = score;
    }

    return true;
  }

  getGameInfo() {
    return {
      roomId: this.roomId,
      hostId: this.hostId,
      dennerName: this.players.get(this.hostId)?.name || "Unknown",
      targetColor: this.targetColor,
      gameState: this.gameState,
      gameType: this.gameType,
      currentRound: this.currentRound,
      maxRounds: this.maxRounds,
      startTime: this.startTime,
      endTime: this.endTime,
      playerCount: this.players.size,
      maxPlayers: this.maxPlayers,
      minPlayers: this.minPlayers,
      players: Array.from(this.players.values()),
      roundResults: this.roundResults,
      sessionLeaderboard: this.sessionLeaderboard,
      dennerRotation: this.dennerRotation,
    };
  }
}

// Socket.IO event handlers
io.on("connection", (socket) => {
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

    if (game.gameState !== "lobby") {
      socket.emit("error", { message: "Cannot join room - game in progress" });
      return;
    }

    const success = game.addPlayer(socket.id, playerName);
    if (!success) {
      socket.emit("error", { message: "Room is full" });
      return;
    }

    socket.join(roomId);
    playerSessions.set(socket.id, roomId);

    // Send room info to the joining player first
    socket.emit("roomJoined", {
      roomId,
      gameInfo: game.getGameInfo(),
    });

    // Notify all players in the room (including the one who just joined)
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

  // Select game type (denner only)
  socket.on("selectGameType", ({ roomId, gameType }) => {
    const game = activeGames.get(roomId);

    if (!game || game.hostId !== socket.id) {
      socket.emit("error", { message: "Only the denner can select game type" });
      return;
    }

    if (!["findColor", "colorMixing"].includes(gameType)) {
      socket.emit("error", { message: "Invalid game type" });
      return;
    }

    const success = game.selectGameType(gameType);
    if (!success) {
      socket.emit("error", {
        message: "Cannot select game type in current state",
      });
      return;
    }

    // Notify all players of game type selection
    io.to(roomId).emit("gameTypeSelected", {
      gameType,
      gameInfo: game.getGameInfo(),
    });

    console.log(`Game type ${gameType} selected in room ${roomId}`);
  });

  // Start round (denner only)
  socket.on("startRound", ({ roomId }) => {
    const game = activeGames.get(roomId);

    if (!game || game.hostId !== socket.id) {
      socket.emit("error", { message: "Only the denner can start the round" });
      return;
    }

    const success = game.startRound();
    if (!success) {
      socket.emit("error", {
        message: "Cannot start round - not enough players",
      });
      return;
    }

    // Notify all players that round has started
    io.to(roomId).emit("roundStarted", {
      gameInfo: game.getGameInfo(),
    });

    console.log(`Round ${game.currentRound} started in room ${roomId}`);
  });

  // End round (automatic or manual)
  socket.on("endRound", ({ roomId }) => {
    const game = activeGames.get(roomId);

    if (!game || game.hostId !== socket.id) {
      socket.emit("error", { message: "Only the denner can end the round" });
      return;
    }

    game.endRound();

    // Notify all players that round has ended
    io.to(roomId).emit("roundFinished", {
      gameInfo: game.getGameInfo(),
    });

    console.log(`Round ${game.currentRound} finished in room ${roomId}`);
  });

  // Continue to next round (denner only)
  socket.on("continueSession", ({ roomId }) => {
    const game = activeGames.get(roomId);

    if (!game || game.hostId !== socket.id) {
      socket.emit("error", { message: "Only the denner can continue session" });
      return;
    }

    if (game.gameState !== "roundFinished") {
      socket.emit("error", { message: "No round to continue from" });
      return;
    }

    // Rotate denner
    game.rotateDenner();

    // Reset to lobby state for next round
    game.gameState = "lobby";
    game.gameType = null;

    // Notify all players of denner change and lobby state
    io.to(roomId).emit("dennerChanged", {
      newDenner: game.hostId,
      dennerName: game.players.get(game.hostId)?.name,
      gameInfo: game.getGameInfo(),
    });

    console.log(
      `Session continues in room ${roomId}, new denner: ${game.hostId}`,
    );
  });

  // End session (denner only)
  socket.on("endSession", ({ roomId }) => {
    const game = activeGames.get(roomId);

    if (!game || game.hostId !== socket.id) {
      socket.emit("error", { message: "Only the denner can end the session" });
      return;
    }

    game.endSession();

    // Notify all players that session has ended
    io.to(roomId).emit("sessionEnded", {
      gameInfo: game.getGameInfo(),
    });

    console.log(`Session ended in room ${roomId}`);
  });

  // Submit a score
  socket.on("submitScore", ({ roomId, score, timeTaken }) => {
    const game = activeGames.get(roomId);

    if (!game || game.gameState !== "playing") {
      socket.emit("error", { message: "Game not in progress" });
      return;
    }

    const success = game.submitScore(socket.id, score, timeTaken || 0);
    if (!success) {
      socket.emit("error", { message: "Player not found in game" });
      return;
    }

    // Notify all players of the score submission
    io.to(roomId).emit("scoreSubmitted", {
      playerId: socket.id,
      score,
      timeTaken: timeTaken || 0,
      gameInfo: game.getGameInfo(),
    });

    // Check if all players have submitted scores (auto end round)
    const allPlayersSubmitted = Array.from(game.players.values()).every(
      (player) => player.attempts > 0,
    );

    if (allPlayersSubmitted) {
      // Auto end round after 2 seconds
      setTimeout(() => {
        game.endRound();
        io.to(roomId).emit("roundFinished", {
          gameInfo: game.getGameInfo(),
        });
        console.log(
          `Round ${game.currentRound} auto-finished in room ${roomId}`,
        );
      }, 2000);
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
