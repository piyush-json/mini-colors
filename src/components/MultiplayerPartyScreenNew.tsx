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
import { QRCodeSVG } from "qrcode.react";

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
  const isCurrentUserDenner =
    gameInfo?.hostId ===
    gameInfo?.players.find((p) => p.name === playerName)?.id;

  // Connect to server on component mount
  useEffect(() => {
    connect();
  }, [connect]);

  // Handle game state changes
  useEffect(() => {
    if (gameInfo) {
      if (gameInfo.gameState === "playing") {
        setIsPlaying(true);
        setTimer(0);
      } else if (
        gameInfo.gameState === "roundFinished" ||
        gameInfo.gameState === "sessionFinished"
      ) {
        setIsPlaying(false);
        setShowResult(true);
      } else {
        setIsPlaying(false);
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
        case "roundStarted":
          setIsPlaying(true);
          setTimer(0);
          break;
        case "roundFinished":
          setIsPlaying(false);
          setShowResult(true);
          break;
        case "sessionEnded":
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
        denner: gameInfo.dennerName,
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
    setShowCreateForm(false);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) return;

    joinRoom(roomId.trim().toUpperCase(), playerName.trim());
    setShowJoinForm(false);
  };

  const handleSelectGameType = (gameType: "findColor" | "colorMixing") => {
    if (currentRoom && isCurrentUserDenner) {
      selectGameType(currentRoom, gameType);
    }
  };

  const handleStartRound = () => {
    if (currentRoom && isCurrentUserDenner) {
      startRound(currentRoom);
    }
  };

  const handleEndRound = () => {
    if (currentRoom && isCurrentUserDenner) {
      endRound(currentRoom);
    }
  };

  const handleContinueSession = () => {
    if (currentRoom && isCurrentUserDenner) {
      continueSession(currentRoom);
    }
  };

  const handleEndSession = () => {
    if (currentRoom && isCurrentUserDenner) {
      endSession(currentRoom);
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

  const getGameStateDisplay = () => {
    if (!gameInfo) return "Loading...";

    switch (gameInfo.gameState) {
      case "lobby":
        return `Lobby - Waiting for denner ${gameInfo.dennerName} to select game type`;
      case "gameSelection":
        return `Game selected: ${gameInfo.gameType} - Waiting for denner to start round`;
      case "playing":
        return `Round ${gameInfo.currentRound}/${gameInfo.maxRounds} in progress!`;
      case "roundFinished":
        return `Round ${gameInfo.currentRound} finished - Waiting for denner decision`;
      case "sessionFinished":
        return "Session finished! Check final leaderboard";
      default:
        return "Unknown state";
    }
  };

  const getRoomShareUrl = () => {
    if (typeof window !== "undefined" && currentRoom) {
      return `${window.location.origin}/party?room=${currentRoom}`;
    }
    return "";
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

  // Show main game lobby/room
  return (
    <div className="min-h-screen retro-bg-gradient p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            🎉 Party Room {currentRoom}
          </h1>
          <p className="text-lg text-foreground-muted">
            {getGameStateDisplay()}
          </p>

          {gameInfo && (
            <div className="mt-2 space-x-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                👥 {gameInfo.playerCount}/{gameInfo.maxPlayers} Players
              </span>
              <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                👑 Denner: {gameInfo.dennerName}
              </span>
              {gameInfo.currentRound > 0 && (
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  🎯 Round {gameInfo.currentRound}/{gameInfo.maxRounds}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 space-x-2">
            <Link href="/">
              <RetroButton variant="secondary" size="sm">
                ← Back to Menu
              </RetroButton>
            </Link>
            <RetroButton
              variant="secondary"
              size="sm"
              onClick={() => setShowQRCode(!showQRCode)}
            >
              📱 Share Room
            </RetroButton>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">📱 Share Room</h2>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <QRCodeSVG value={getRoomShareUrl()} size={200} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Room Code:</p>
                  <div className="bg-gray-100 px-4 py-2 rounded font-mono text-xl tracking-widest">
                    {currentRoom}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Share Link:</p>
                  <div className="bg-gray-100 px-4 py-2 rounded text-sm break-all">
                    {getRoomShareUrl()}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <RetroButton
                  onClick={() => setShowQRCode(false)}
                  variant="primary"
                  size="lg"
                >
                  Close
                </RetroButton>
              </div>
            </div>
          </div>
        )}

        {/* Game State Content */}
        {gameInfo?.gameState === "lobby" && (
          <LobbyScreen
            gameInfo={gameInfo}
            isCurrentUserDenner={isCurrentUserDenner}
            onSelectGameType={handleSelectGameType}
          />
        )}

        {gameInfo?.gameState === "gameSelection" && (
          <GameSelectionScreen
            gameInfo={gameInfo}
            isCurrentUserDenner={isCurrentUserDenner}
            onStartRound={handleStartRound}
          />
        )}

        {gameInfo?.gameState === "playing" && (
          <PlayingScreen
            gameInfo={gameInfo}
            timer={timer}
            isLoading={isLoading}
            webcamReady={webcamReady}
            cameraError={cameraError}
            onCaptureColor={handleCaptureColor}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
          />
        )}

        {gameInfo?.gameState === "roundFinished" && (
          <RoundFinishedScreen
            gameInfo={gameInfo}
            isCurrentUserDenner={isCurrentUserDenner}
            onContinueSession={handleContinueSession}
            onEndSession={handleEndSession}
          />
        )}

        {gameInfo?.gameState === "sessionFinished" && (
          <SessionFinishedScreen
            gameInfo={gameInfo}
            onLeaveRoom={() => leaveRoom()}
          />
        )}

        {/* Players List */}
        {gameInfo && (
          <RetroCard title="Players" className="mt-6">
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
                  <div className="text-right text-sm">
                    <div>Session: {player.sessionScore}pts</div>
                    {gameInfo.gameState === "playing" && (
                      <div>Round: {player.score}pts</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RetroCard>
        )}

        {/* Game Events */}
        {events.length > 0 && (
          <RetroCard title="Game Activity" className="mt-6">
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {events.slice(-5).map((event, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  {event.type === "playerJoined" &&
                    `👋 ${(event.data as { playerName?: string })?.playerName || "A player"} joined the room`}
                  {event.type === "playerLeft" && `👋 A player left the room`}
                  {event.type === "gameTypeSelected" && `🎮 Game type selected`}
                  {event.type === "roundStarted" && `🚀 Round started!`}
                  {event.type === "roundFinished" && `🏁 Round finished!`}
                  {event.type === "dennerChanged" && `👑 New denner selected`}
                  {event.type === "sessionEnded" && `🎊 Session ended!`}
                  {event.type === "scoreSubmitted" &&
                    `📊 ${(event.data as { score?: number })?.score || 0}% score submitted`}
                </div>
              ))}
            </div>
          </RetroCard>
        )}
      </div>
    </div>
  );
};

// Component for lobby state
const LobbyScreen = ({
  gameInfo,
  isCurrentUserDenner,
  onSelectGameType,
}: {
  gameInfo: any;
  isCurrentUserDenner: boolean;
  onSelectGameType: (gameType: "findColor" | "colorMixing") => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <RetroCard title="🎮 Select Game Type">
      <div className="space-y-4">
        {isCurrentUserDenner ? (
          <>
            <p className="text-sm text-foreground-muted mb-4">
              As the denner, choose which game to play this round:
            </p>
            <div className="space-y-3">
              <RetroButton
                onClick={() => onSelectGameType("findColor")}
                variant="primary"
                size="lg"
                className="w-full"
              >
                🎯 Find Color Game
                <br />
                <span className="text-sm font-normal">
                  Use camera to find matching colors
                </span>
              </RetroButton>
              <RetroButton
                onClick={() => onSelectGameType("colorMixing")}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                🎨 Color Mixing Game
                <br />
                <span className="text-sm font-normal">
                  Mix colors to match the target
                </span>
              </RetroButton>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-4xl">⏳</div>
            <p className="text-foreground-muted">
              Waiting for denner <strong>{gameInfo.dennerName}</strong> to
              select the game type...
            </p>
          </div>
        )}
      </div>
    </RetroCard>

    <RetroCard title="📋 Session Info">
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Current Denner:</span>
          <span className="font-bold">{gameInfo.dennerName}</span>
        </div>
        <div className="flex justify-between">
          <span>Round:</span>
          <span>
            {gameInfo.currentRound}/{gameInfo.maxRounds}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Players:</span>
          <span>
            {gameInfo.playerCount}/{gameInfo.maxPlayers}
          </span>
        </div>
      </div>
    </RetroCard>
  </div>
);

// Component for game selection state
const GameSelectionScreen = ({
  gameInfo,
  isCurrentUserDenner,
  onStartRound,
}: {
  gameInfo: any;
  isCurrentUserDenner: boolean;
  onStartRound: () => void;
}) => (
  <div className="max-w-2xl mx-auto mb-6">
    <RetroCard
      title={`🎮 ${gameInfo.gameType === "findColor" ? "Find Color" : "Color Mixing"} Game`}
    >
      <div className="text-center space-y-4">
        <div className="text-6xl">
          {gameInfo.gameType === "findColor" ? "🎯" : "🎨"}
        </div>
        <h3 className="text-xl font-bold">
          {gameInfo.gameType === "findColor"
            ? "Find Color Game"
            : "Color Mixing Game"}
        </h3>
        <p className="text-foreground-muted">
          {gameInfo.gameType === "findColor"
            ? "Players will use their camera to find objects matching the target color"
            : "Players will mix RGB values to match the target color as closely as possible"}
        </p>

        {isCurrentUserDenner ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">Ready to start the round?</p>
            <RetroButton
              onClick={onStartRound}
              variant="primary"
              size="lg"
              className="w-full"
            >
              🚀 Start Round {gameInfo.currentRound + 1}
            </RetroButton>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-foreground-muted">
              Waiting for denner <strong>{gameInfo.dennerName}</strong> to start
              the round...
            </p>
          </div>
        )}
      </div>
    </RetroCard>
  </div>
);

// Component for playing state
const PlayingScreen = ({
  gameInfo,
  timer,
  isLoading,
  webcamReady,
  cameraError,
  onCaptureColor,
  onUserMedia,
  onUserMediaError,
}: {
  gameInfo: any;
  timer: number;
  isLoading: boolean;
  webcamReady: boolean;
  cameraError: string | null;
  onCaptureColor: () => void;
  onUserMedia: () => void;
  onUserMediaError: (error: string | DOMException) => void;
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <RetroCard title="🎯 Target Color">
      <div className="text-center space-y-4">
        <RetroColorSwatch
          color={gameInfo.targetColor}
          size="lg"
          showHex
          className="mx-auto"
        />
        <p className="font-mono text-sm text-foreground-muted">
          {gameInfo.gameType === "findColor"
            ? "Find this color in your surroundings!"
            : "Mix RGB values to match this color!"}
        </p>

        <div className="space-y-2">
          <div className="font-mono text-sm font-bold text-foreground-muted">
            Time: {timer}s
          </div>
          {gameInfo.gameType === "findColor" && (
            <RetroButton
              onClick={onCaptureColor}
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
          )}
        </div>
      </div>
    </RetroCard>

    {gameInfo.gameType === "findColor" && (
      <RetroCard title="📷 Camera View">
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
                webcamReady ? "border-green-500" : "border-gray-300 opacity-50"
              }`}
              videoConstraints={{
                facingMode: "user",
                width: { ideal: 640, min: 320 },
                height: { ideal: 480, min: 240 },
                frameRate: { ideal: 30, min: 15 },
              }}
              onUserMedia={onUserMedia}
              onUserMediaError={onUserMediaError}
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
    )}
  </div>
);

// Component for round finished state
const RoundFinishedScreen = ({
  gameInfo,
  isCurrentUserDenner,
  onContinueSession,
  onEndSession,
}: {
  gameInfo: any;
  isCurrentUserDenner: boolean;
  onContinueSession: () => void;
  onEndSession: () => void;
}) => (
  <div className="max-w-4xl mx-auto mb-6">
    <RetroCard title={`🏁 Round ${gameInfo.currentRound} Results`}>
      <div className="space-y-6">
        {/* Round Leaderboard */}
        <div>
          <h3 className="font-bold mb-4 text-center">Round Leaderboard</h3>
          <div className="space-y-2">
            {gameInfo.players
              .sort((a: any, b: any) => b.score - a.score)
              .map((player: any, index: number) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg"
                >
                  <span className="flex items-center">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `${index + 1}.`}
                    <span className="ml-2 font-medium">{player.name}</span>
                  </span>
                  <span className="font-bold">{player.score}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Session Progress */}
        <div>
          <h3 className="font-bold mb-4 text-center">Session Progress</h3>
          <div className="flex justify-center items-center space-x-4">
            <span className="text-2xl">📊</span>
            <span>
              Round {gameInfo.currentRound} of {gameInfo.maxRounds} completed
            </span>
          </div>
        </div>

        {/* Denner Actions */}
        {isCurrentUserDenner && (
          <div className="border-t pt-6">
            <h3 className="font-bold mb-4 text-center">Denner Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameInfo.currentRound < gameInfo.maxRounds ? (
                <RetroButton
                  onClick={onContinueSession}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  ➡️ Continue to Next Round
                  <br />
                  <span className="text-sm font-normal">
                    New denner will be selected
                  </span>
                </RetroButton>
              ) : (
                <div className="md:col-span-2">
                  <RetroButton
                    onClick={onEndSession}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    🎊 View Final Results
                    <br />
                    <span className="text-sm font-normal">
                      All rounds completed
                    </span>
                  </RetroButton>
                </div>
              )}
              <RetroButton
                onClick={onEndSession}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                🏁 End Session Early
                <br />
                <span className="text-sm font-normal">
                  Show final leaderboard
                </span>
              </RetroButton>
            </div>
          </div>
        )}

        {!isCurrentUserDenner && (
          <div className="text-center space-y-2">
            <p className="text-foreground-muted">
              Waiting for denner <strong>{gameInfo.dennerName}</strong> to
              decide...
            </p>
          </div>
        )}
      </div>
    </RetroCard>
  </div>
);

// Component for session finished state
const SessionFinishedScreen = ({
  gameInfo,
  onLeaveRoom,
}: {
  gameInfo: any;
  onLeaveRoom: () => void;
}) => (
  <div className="max-w-4xl mx-auto mb-6">
    <RetroCard title="🎊 Session Complete!">
      <div className="space-y-6 text-center">
        <div className="text-6xl">🏆</div>

        <h2 className="text-3xl font-bold">Final Leaderboard</h2>

        {/* Final Leaderboard */}
        <div className="space-y-3">
          {gameInfo.sessionLeaderboard.map((player: any, index: number) => (
            <div
              key={player.id}
              className={`flex justify-between items-center py-4 px-6 rounded-2xl ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-200 to-yellow-300 border-2 border-yellow-400"
                  : index === 1
                    ? "bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-gray-400"
                    : index === 2
                      ? "bg-gradient-to-r from-orange-200 to-orange-300 border-2 border-orange-400"
                      : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `${index + 1}.`}
                </span>
                <span className="font-bold text-lg">{player.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">
                  {player.sessionScore} pts
                </div>
                <div className="text-sm text-gray-600">
                  Rounds: {player.roundScores.join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 space-y-4">
          <p className="text-lg text-foreground-muted">
            Thanks for playing! 🎉
          </p>
          <div className="space-x-4">
            <RetroButton onClick={onLeaveRoom} variant="primary" size="lg">
              🚪 Leave Room
            </RetroButton>
            <Link href="/">
              <RetroButton variant="secondary" size="lg">
                🏠 Back to Menu
              </RetroButton>
            </Link>
          </div>
        </div>
      </div>
    </RetroCard>
  </div>
);
