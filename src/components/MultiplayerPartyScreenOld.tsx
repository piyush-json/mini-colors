import {
  RetroButton,
  RetroCard,
  RetroColorSwatch,
  RetroTimer,
  RetroSpinner,
  RetroScoreDisplay,
  RetroBadge,
} from "./RetroUI";
import Webcam from "react-webcam";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSocket } from "./socket-provider";

export const MultiplayerPartyScreen = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [targetColor, setTargetColor] = useState("#ff0000");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<"findColor" | "colorMixing" | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const {
    isConnected,
    error: socketError,
    currentRoom,
    gameInfo,
    events,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
    selectGameType,
    startRound,
    endRound,
    continueSession,
    endSession,
    submitScore,
  } = useSocket();

  // Helper to check if current user is the denner
  const isCurrentUserDenner = gameInfo?.hostId === gameInfo?.players.find(p => p.name === playerName)?.id;

  // Connect to server on component mount
  useEffect(() => {
    connect();
  }, [connect, disconnect]);

  // Handle game state changes
  useEffect(() => {
    if (gameInfo) {
      if (gameInfo.gameState === "playing") {
        setIsPlaying(true);
        setTimer(0);
      } else if (gameInfo.gameState === "finished") {
        setIsPlaying(false);
        setShowResult(true);
      }

      setTargetColor(gameInfo.targetColor);
    }
  }, [gameInfo]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && gameInfo?.gameState === "playing") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameInfo?.gameState]);

  // Handle socket events
  useEffect(() => {
    events.forEach((event) => {
      console.log("Received socket event:", event.type, event.data);
      switch (event.type) {
        case "playerJoined":
          console.log("Player joined event received:", event.data);
          break;
        case "gameStarted":
          setIsPlaying(true);
          setTimer(0);
          break;
        case "gameFinished":
          setIsPlaying(false);
          setShowResult(true);
          break;
        case "error":
          console.error(
            "Socket error:",
            (event.data as { message: string })?.message,
          );
          break;
      }
    });
  }, [events]);

  // Debug gameInfo changes
  useEffect(() => {
    if (gameInfo) {
      console.log("GameInfo updated:", {
        roomId: gameInfo.roomId,
        playerCount: gameInfo.playerCount,
        players: gameInfo.players,
        gameState: gameInfo.gameState,
      });
    }
  }, [gameInfo]);

  // Debug currentRoom changes
  useEffect(() => {
    console.log("CurrentRoom changed:", currentRoom);
  }, [currentRoom]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) return;

    createRoom(playerName.trim(), targetColor);
    setIsHost(true);
    setShowCreateForm(false);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) return;

    joinRoom(roomId.trim().toUpperCase(), playerName.trim());
    setIsHost(false);
    setShowJoinForm(false);
  };

  const handleStartGame = () => {
    if (currentRoom && isHost) {
      startGame(currentRoom);
    }
  };

  const handleCaptureColor = () => {
    if (!currentRoom || !isPlaying) return;

    setIsLoading(true);

    // Simulate color capture
    setTimeout(() => {
      const capturedScore = Math.floor(Math.random() * 100) + 1;
      setScore(capturedScore);

      if (currentRoom) {
        submitScore(currentRoom, capturedScore, timer * 1000);
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleUserMedia = () => {
    setCameraError(null);
    setWebcamReady(true);
  };

  const handleUserMediaError = (error: string | DOMException) => {
    let message = "Camera initialization failed.";

    if (typeof error === "object" && error.name === "NotAllowedError") {
      message =
        "Camera access denied. Please allow camera permissions and refresh the page.";
    } else if (typeof error === "object" && error.name === "NotFoundError") {
      message = "No camera found on this device.";
    } else if (typeof error === "object" && error.name === "NotReadableError") {
      message =
        "Camera is in use by another application. Please close other apps using the camera.";
    } else if (
      typeof error === "object" &&
      error.name === "OverconstrainedError"
    ) {
      message =
        "Camera doesn't support the required resolution. Please try a different camera.";
    } else if (typeof error === "object" && error.name === "SecurityError") {
      message =
        "Camera access blocked for security reasons. Please check your browser settings.";
    }

    setCameraError(message);
    setWebcamReady(false);
  };

  // Show connection form if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen retro-bg-gradient p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🎉 Multiplayer Party Mode
            </h1>
            <p className="text-lg text-foreground-muted">
              Connecting to multiplayer server...
            </p>
            <div className="mt-4">
              <Link href="/">
                <RetroButton variant="secondary" size="md">
                  ← Back to Menu
                </RetroButton>
              </Link>
            </div>
          </div>

          <RetroCard title="Connection Status">
            <div className="text-center space-y-4">
              <div className="text-4xl">🔌</div>
              <p className="text-foreground-muted">
                {socketError
                  ? `Connection failed: ${socketError}`
                  : "Attempting to connect..."}
              </p>
              {socketError && (
                <RetroButton onClick={connect} variant="primary" size="md">
                  🔄 Retry Connection
                </RetroButton>
              )}
            </div>
          </RetroCard>
        </div>
      </div>
    );
  }

  // Show room selection if not in a room
  if (!currentRoom) {
    return (
      <div className="min-h-screen retro-bg-gradient p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🎉 Multiplayer Party Mode
            </h1>
            <p className="text-lg text-foreground-muted">
              Create a room or join an existing one to start playing!
            </p>
            <div className="mt-4">
              <Link href="/">
                <RetroButton variant="secondary" size="md">
                  ← Back to Menu
                </RetroButton>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <RetroCard title="🎮 Create Room">
              <div className="text-center space-y-4">
                <p className="text-sm text-foreground-muted">
                  Host a new party game and invite friends to join!
                </p>
                <RetroButton
                  onClick={() => setShowCreateForm(true)}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  🚀 Create Room
                </RetroButton>
              </div>
            </RetroCard>

            <RetroCard title="🎯 Join Room">
              <div className="text-center space-y-4">
                <p className="text-sm text-foreground-muted">
                  Join an existing room with a room code!
                </p>
                <RetroButton
                  onClick={() => setShowJoinForm(true)}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  🎯 Join Room
                </RetroButton>
              </div>
            </RetroCard>
          </div>

          {/* Create Room Form */}
          {showCreateForm && (
            <RetroCard title="Create New Room" className="mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono"
                    placeholder="Enter your name"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Target Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={targetColor}
                      onChange={(e) => setTargetColor(e.target.value)}
                      className="w-16 h-16 rounded border-2 border-gray-300"
                    />
                    <input
                      type="text"
                      value={targetColor}
                      onChange={(e) => setTargetColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                      placeholder="#ff0000"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <RetroButton
                    onClick={handleCreateRoom}
                    variant="primary"
                    size="md"
                    className="flex-1"
                    disabled={!playerName.trim()}
                  >
                    🚀 Create Room
                  </RetroButton>
                  <RetroButton
                    onClick={() => setShowCreateForm(false)}
                    variant="secondary"
                    size="md"
                    className="flex-1"
                  >
                    Cancel
                  </RetroButton>
                </div>
              </div>
            </RetroCard>
          )}

          {/* Join Room Form */}
          {showJoinForm && (
            <RetroCard title="Join Existing Room" className="mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono"
                    placeholder="Enter your name"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-center text-lg tracking-widest"
                    placeholder="ABC123"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <RetroButton
                    onClick={handleJoinRoom}
                    variant="primary"
                    size="md"
                    className="flex-1"
                    disabled={!playerName.trim() || !roomId.trim()}
                  >
                    🎯 Join Room
                  </RetroButton>
                  <RetroButton
                    onClick={() => setShowJoinForm(false)}
                    variant="secondary"
                    size="md"
                    className="flex-1"
                  >
                    Cancel
                  </RetroButton>
                </div>
              </div>
            </RetroCard>
          )}
        </div>
      </div>
    );
  }

  // Show game room
  return (
    <div className="min-h-screen retro-bg-gradient p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            🎉 Party Mode - Room {currentRoom}
          </h1>
          <p className="text-lg text-foreground-muted">
            {gameInfo?.gameState === "waiting" && "Waiting for players..."}
            {gameInfo?.gameState === "playing" &&
              "Game in progress! Find the target color!"}
            {gameInfo?.gameState === "finished" &&
              "Game finished! Check the results!"}
          </p>

          {gameInfo && (
            <div className="mt-2 space-x-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                👥 {gameInfo.playerCount}/{gameInfo.maxPlayers} Players
              </span>
              {isHost && (
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  👑 Host
                </span>
              )}
            </div>
          )}

          <div className="mt-4">
            <Link href="/">
              <RetroButton variant="secondary" size="md">
                ← Back to Menu
              </RetroButton>
            </Link>
          </div>
        </div>

        {/* Result Overlay */}
        {showResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">🎯 Game Finished!</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold mb-2">Final Leaderboard</h3>
                  {gameInfo?.leaderboard.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <span className="flex items-center">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && `${index + 1}.`}
                        <span className="ml-2">{player.name}</span>
                      </span>
                      <span className="font-bold">{player.bestScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <RetroButton
                  onClick={() => setShowResult(false)}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  🎮 New Game
                </RetroButton>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RetroCard title="Target Color">
            <div className="text-center space-y-4">
              <RetroColorSwatch
                color={targetColor}
                size="lg"
                showHex
                className="mx-auto"
              />
              <p className="font-mono text-sm text-foreground-muted">
                Find this color in your surroundings!
              </p>

              {gameInfo?.gameState === "playing" && (
                <div className="space-y-2">
                  <div className="font-mono text-sm font-bold text-foreground-muted">
                    Time: {timer}s
                  </div>
                  <RetroButton
                    onClick={handleCaptureColor}
                    variant="success"
                    size="lg"
                    className="w-full"
                    disabled={isLoading || !webcamReady}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <RetroSpinner className="mr-2" />
                        Capturing...
                      </span>
                    ) : !webcamReady ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">📷</span>
                        Camera Setting Up...
                      </span>
                    ) : (
                      "📸 CAPTURE COLOR"
                    )}
                  </RetroButton>
                </div>
              )}

              {gameInfo?.gameState === "waiting" && isHost && (
                <div className="space-y-2">
                  <RetroButton
                    onClick={handleStartGame}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    🚀 Start Game
                  </RetroButton>
                  <RetroButton
                    onClick={() =>
                      setTargetColor(
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                      )
                    }
                    variant="secondary"
                    size="md"
                    className="w-full"
                  >
                    🎲 Random Color
                  </RetroButton>
                </div>
              )}
            </div>
          </RetroCard>

          <RetroCard title="Camera View">
            <div className="text-center space-y-4">
              {!webcamReady && !cameraError && (
                <div className="space-y-3">
                  <div className="text-4xl">📷</div>
                  <p className="font-mono text-sm text-foreground-muted">
                    Initializing camera...
                  </p>
                </div>
              )}

              {webcamReady && <div className="text-4xl">✅</div>}

              <div className="relative">
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className={`w-full h-64 object-cover rounded-2xl border-2 shadow-lg ${
                    webcamReady
                      ? "border-green-500"
                      : "border-gray-300 opacity-50"
                  }`}
                  videoConstraints={{
                    facingMode: "user", // Always front-facing for party mode
                    width: { ideal: 640, min: 320 },
                    height: { ideal: 480, min: 240 },
                    frameRate: { ideal: 30, min: 15 },
                  }}
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                />

                {webcamReady && (
                  <>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 border-4 border-white rounded-full pointer-events-none shadow-lg animate-pulse" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-red-500 rounded-full" />
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      LIVE
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                {webcamReady ? (
                  <>
                    <p className="font-mono text-sm text-green-600 font-bold">
                      Camera Ready!
                    </p>
                    <p className="font-mono text-sm text-foreground-muted">
                      Point the crosshair at the target color and capture!
                    </p>
                  </>
                ) : (
                  <p className="font-mono text-sm text-foreground-muted">
                    Setting up camera...
                  </p>
                )}
              </div>

              {cameraError && (
                <div className="space-y-3">
                  <div className="text-4xl">❌</div>
                  <p className="font-mono text-sm text-red-600 font-bold">
                    Camera Error
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700">
                    <p>{cameraError}</p>
                  </div>
                </div>
              )}
            </div>
          </RetroCard>
        </div>

        {/* Players List */}
        {gameInfo && (
          <RetroCard title="Players" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameInfo.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    {player.id === gameInfo.hostId && (
                      <span className="text-purple-500">👑</span>
                    )}
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div className="text-right">
                    {gameInfo.gameState === "playing" ? (
                      <div className="text-sm">
                        <div>Score: {player.score}%</div>
                        <div>Attempts: {player.attempts}</div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div>Best: {player.bestScore}%</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RetroCard>
        )}

        {/* Game Events */}
        {events.length > 0 && (
          <RetroCard title="Game Activity" className="mb-6">
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {events.slice(-5).map((event, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  {event.type === "playerJoined" &&
                    `👋 ${(event.data as { playerName?: string })?.playerName || "A player"} joined the room`}
                  {event.type === "playerLeft" && `👋 A player left the room`}
                  {event.type === "gameStarted" && `🚀 Game started!`}
                  {event.type === "gameFinished" && `🏁 Game finished!`}
                  {event.type === "scoreSubmitted" &&
                    `📊 ${(event.data as { score?: number })?.score || 0}% score submitted`}
                  {event.type === "targetColorChanged" &&
                    `🎨 Target color changed`}
                </div>
              ))}
            </div>
          </RetroCard>
        )}

        <div className="text-center space-y-4">
          <RetroButton
            onClick={() => leaveRoom()}
            variant="secondary"
            size="md"
          >
            ← Leave Room
          </RetroButton>
        </div>
      </div>
    </div>
  );
};
