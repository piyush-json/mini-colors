import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface Player {
  id: string;
  name: string;
  score: number;
  attempts: number;
  bestScore: number;
  sessionScore: number;
  roundScores: number[];
  joinedAt: number;
}

export interface RoundResult {
  round: number;
  gameType: "findColor" | "colorMixing";
  denner: string;
  players: Array<{
    id: string;
    name: string;
    score: number;
    attempts: number;
  }>;
  timestamp: number;
}

export interface SessionLeaderboard {
  rank: number;
  id: string;
  name: string;
  sessionScore: number;
  roundScores: number[];
}

export interface GameInfo {
  roomId: string;
  hostId: string;
  dennerName: string;
  targetColor: string;
  gameState:
    | "lobby"
    | "gameSelection"
    | "playing"
    | "roundFinished"
    | "sessionFinished";
  gameType: "findColor" | "colorMixing" | null;
  currentRound: number;
  maxRounds: number;
  startTime: number | null;
  endTime: number | null;
  playerCount: number;
  maxPlayers: number;
  minPlayers: number;
  players: Player[];
  roundResults: RoundResult[];
  sessionLeaderboard: SessionLeaderboard[];
  dennerRotation: string[];
}

export interface SocketEvent {
  type:
    | "playerJoined"
    | "playerLeft"
    | "gameTypeSelected"
    | "roundStarted"
    | "roundFinished"
    | "scoreSubmitted"
    | "targetColorChanged"
    | "dennerChanged"
    | "sessionEnded"
    | "roomCreated"
    | "roomJoined"
    | "error";
  data: unknown;
  timestamp?: number;
}

export const useSocketIO = (serverUrl: string = "http://localhost:3001") => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [events, setEvents] = useState<SocketEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Add event to events list
  const addEvent = useCallback((type: SocketEvent["type"], data: unknown) => {
    setEvents((prev) => [...prev, { type, data, timestamp: Date.now() }]);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(serverUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["polling", "websocket"],
      upgrade: true,
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (err) => {
      setError(`Connection error: ${err.message}`);
      console.error("Connection error:", err);
    });

    // Game events
    socket.on("roomCreated", ({ roomId, gameInfo }) => {
      setCurrentRoom(roomId);
      setGameInfo(gameInfo);
      addEvent("roomCreated", { roomId, gameInfo });
    });

    socket.on("roomJoined", ({ roomId, gameInfo }) => {
      setCurrentRoom(roomId);
      setGameInfo(gameInfo);
      addEvent("roomJoined", { roomId, gameInfo });
    });

    socket.on("roomInfo", ({ gameInfo }) => {
      setGameInfo(gameInfo);
    });

    socket.on("playerJoined", ({ playerId, playerName, gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("playerJoined", { playerId, playerName, gameInfo });
    });

    socket.on("playerLeft", ({ playerId, gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("playerLeft", { playerId, gameInfo });
    });

    socket.on("gameTypeSelected", ({ gameType, gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("gameTypeSelected", { gameType, gameInfo });
    });

    socket.on("roundStarted", ({ gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("roundStarted", { gameInfo });
    });

    socket.on("roundFinished", ({ gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("roundFinished", { gameInfo });
    });

    socket.on("dennerChanged", ({ newDenner, dennerName, gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("dennerChanged", { newDenner, dennerName, gameInfo });
    });

    socket.on("sessionEnded", ({ gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("sessionEnded", { gameInfo });
    });

    socket.on("scoreSubmitted", ({ playerId, score, timeTaken, gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("scoreSubmitted", { playerId, score, timeTaken, gameInfo });
    });

    socket.on("targetColorChanged", ({ targetColor, gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("targetColorChanged", { targetColor, gameInfo });
    });

    socket.on("error", ({ message }) => {
      setError(message);
      addEvent("error", { message });
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl, addEvent]);

  // Connect to server
  const connect = useCallback(() => {
    if (socketRef.current && !isConnected) {
      socketRef.current.connect();
    }
  }, [isConnected]);

  // Disconnect from server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  // Create a new game room
  const createRoom = useCallback(
    (playerName: string, targetColor: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("createRoom", { playerName, targetColor });
      }
    },
    [isConnected],
  );

  // Join an existing game room
  const joinRoom = useCallback(
    (roomId: string, playerName: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("joinRoom", { roomId, playerName });
      }
    },
    [isConnected],
  );

  // Select game type (denner only)
  const selectGameType = useCallback(
    (roomId: string, gameType: "findColor" | "colorMixing") => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("selectGameType", { roomId, gameType });
      }
    },
    [isConnected],
  );

  // Start round (denner only)
  const startRound = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("startRound", { roomId });
      }
    },
    [isConnected],
  );

  // End round (denner only)
  const endRound = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("endRound", { roomId });
      }
    },
    [isConnected],
  );

  // Continue session (denner only)
  const continueSession = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("continueSession", { roomId });
      }
    },
    [isConnected],
  );

  // End session (denner only)
  const endSession = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("endSession", { roomId });
      }
    },
    [isConnected],
  );

  // Submit a score
  const submitScore = useCallback(
    (roomId: string, score: number, timeTaken: number) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("submitScore", { roomId, score, timeTaken });
      }
    },
    [isConnected],
  );

  // Set custom target color (denner only)
  const setTargetColor = useCallback(
    (roomId: string, targetColor: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("setTargetColor", { roomId, targetColor });
      }
    },
    [isConnected],
  );

  // Get room info
  const getRoomInfo = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("getRoomInfo", { roomId });
      }
    },
    [isConnected],
  );

  // Leave current room
  const leaveRoom = useCallback(() => {
    if (socketRef.current && currentRoom) {
      socketRef.current.emit("leaveRoom", { roomId: currentRoom });
      setCurrentRoom(null);
      setGameInfo(null);
    }
  }, [currentRoom]);

  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Connection state
    isConnected,
    error,

    // Room state
    currentRoom,
    gameInfo,
    events,

    // Connection methods
    connect,
    disconnect,

    // Room methods
    createRoom,
    joinRoom,
    leaveRoom,
    getRoomInfo,

    // Game methods
    selectGameType,
    startRound,
    endRound,
    continueSession,
    endSession,
    submitScore,
    setTargetColor,

    // Utility methods
    clearEvents,
    clearError,
  };
};
