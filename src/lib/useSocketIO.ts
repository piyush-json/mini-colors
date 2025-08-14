import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface Player {
  id: string;
  name: string;
  score: number;
  attempts: number;
  bestScore: number;
  joinedAt: number;
}

export interface GameInfo {
  roomId: string;
  hostId: string;
  targetColor: string;
  gameState: "waiting" | "playing" | "finished";
  startTime: number | null;
  endTime: number | null;
  playerCount: number;
  maxPlayers: number;
  players: Player[];
  leaderboard: Player[];
}

export interface SocketEvent {
  type:
    | "playerJoined"
    | "playerLeft"
    | "gameStarted"
    | "gameFinished"
    | "scoreSubmitted"
    | "targetColorChanged"
    | "roomCreated"
    | "error";
  data: any;
}

export const useSocketIO = (serverUrl: string = "http://localhost:3001") => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [events, setEvents] = useState<SocketEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(serverUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
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

    socket.on("gameStarted", ({ gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("gameStarted", { gameInfo });
    });

    socket.on("gameFinished", ({ gameInfo }) => {
      setGameInfo(gameInfo);
      addEvent("gameFinished", { gameInfo });
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
  }, [serverUrl]);

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

  // Start the game (host only)
  const startGame = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("startGame", { roomId });
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

  // Set custom target color (host only)
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

  // Add event to events list
  const addEvent = useCallback((type: SocketEvent["type"], data: any) => {
    setEvents((prev) => [...prev, { type, data, timestamp: Date.now() }]);
  }, []);

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
    startGame,
    submitScore,
    setTargetColor,

    // Utility methods
    clearEvents,
    clearError,
  };
};
