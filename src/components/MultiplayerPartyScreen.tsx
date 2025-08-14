import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
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
      <div className="min-h-screen bg-background p-4 font-mono">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
              🎉 PARTY
              <br />
              <span className="text-accent">MODE</span>
            </h1>
            <p className="font-black text-xl uppercase tracking-wide text-muted-foreground">
              CONNECTING TO DESTRUCTION SERVER...
            </p>
            <div className="mt-4">
              <Link href="/">
                <Button variant="secondary" size="lg">
                  ← BACK TO MENU
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>🔌 CONNECTION STATUS</CardTitle>
              <CardDescription>NETWORK PROTOCOL INITIALIZATION</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="font-black text-8xl">🔌</div>
              {socketError ? (
                <Badge variant="destructive" className="text-lg">
                  CONNECTION FAILED: {socketError}
                </Badge>
              ) : (
                <Badge variant="accent" className="text-lg">
                  ATTEMPTING CONNECTION...
                </Badge>
              )}
              {socketError && (
                <Button
                  onClick={connect}
                  variant="accent"
                  size="lg"
                  className="w-full"
                >
                  🔄 RETRY CONNECTION
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show room selection if not in a room
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-background p-4 font-mono">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
              🎉 PARTY
              <br />
              <span className="text-accent">MODE</span>
            </h1>
            <p className="font-black text-xl uppercase tracking-wide text-muted-foreground">
              CREATE OR JOIN DESTRUCTION ROOM!
            </p>
            <div className="mt-4">
              <Link href="/">
                <Button variant="secondary" size="lg">
                  ← BACK TO MENU
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="hover:translate-x-4 hover:translate-y-4 hover:shadow-[24px_24px_0px_hsl(var(--foreground))] transition-all duration-150">
              <CardHeader>
                <CardTitle>🎮 CREATE ROOM</CardTitle>
                <CardDescription>HOST NEW DESTRUCTION SESSION</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                  HOST A NEW PARTY GAME AND INVITE FRIENDS TO JOIN!
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  variant="accent"
                  size="lg"
                  className="w-full"
                >
                  🚀 CREATE ROOM
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:translate-x-4 hover:translate-y-4 hover:shadow-[24px_24px_0px_hsl(var(--foreground))] transition-all duration-150">
              <CardHeader>
                <CardTitle>🎯 JOIN ROOM</CardTitle>
                <CardDescription>ENTER EXISTING DESTRUCTION</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                  JOIN AN EXISTING ROOM WITH A ROOM CODE!
                </p>
                <Button
                  onClick={() => setShowJoinForm(true)}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  🎯 JOIN ROOM
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Create Room Form */}
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>🚀 CREATE NEW ROOM</CardTitle>
                <CardDescription>
                  SETUP YOUR DESTRUCTION SESSION
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="font-black text-sm uppercase tracking-wide mb-2 block">
                    YOUR NAME:
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER YOUR NAME"
                    className="w-full p-4 border-4 border-foreground bg-background font-mono font-bold uppercase tracking-wide focus:outline-none focus:translate-x-1 focus:translate-y-1 shadow-[8px_8px_0px_hsl(var(--foreground))]"
                    maxLength={20}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleCreateRoom}
                    variant="accent"
                    size="lg"
                    disabled={!playerName.trim()}
                  >
                    🚀 CREATE ROOM
                  </Button>
                  <Button
                    onClick={() => setShowCreateForm(false)}
                    variant="secondary"
                    size="lg"
                  >
                    ❌ CANCEL
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Join Room Form */}
          {showJoinForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>🎯 JOIN EXISTING ROOM</CardTitle>
                <CardDescription>ENTER THE BATTLEFIELD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="font-black text-sm uppercase tracking-wide mb-2 block">
                    YOUR NAME:
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER YOUR NAME"
                    className="w-full p-4 border-4 border-foreground bg-background font-mono font-bold uppercase tracking-wide focus:outline-none focus:translate-x-1 focus:translate-y-1 shadow-[8px_8px_0px_hsl(var(--foreground))]"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="font-black text-sm uppercase tracking-wide mb-2 block">
                    ROOM CODE:
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="w-full p-4 border-4 border-foreground bg-background font-mono font-bold uppercase tracking-widest text-center text-lg focus:outline-none focus:translate-x-1 focus:translate-y-1 shadow-[8px_8px_0px_hsl(var(--foreground))]"
                    maxLength={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleJoinRoom}
                    variant="secondary"
                    size="lg"
                    disabled={!playerName.trim() || !roomId.trim()}
                  >
                    🎯 JOIN ROOM
                  </Button>
                  <Button
                    onClick={() => setShowJoinForm(false)}
                    variant="outline"
                    size="lg"
                  >
                    ❌ CANCEL
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show main game lobby/room
  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            🎉 PARTY
            <br />
            <span className="text-accent">ROOM</span>
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Badge variant="outline" className="text-lg">
              ROOM: {currentRoom}
            </Badge>
            {gameInfo && (
              <>
                <Badge variant="accent" className="text-lg">
                  PLAYERS: {gameInfo.playerCount}/{gameInfo.maxPlayers}
                </Badge>
                <Badge variant="secondary" className="text-lg">
                  DENNER: {gameInfo.dennerName}
                </Badge>
                {gameInfo.currentRound > 0 && (
                  <Badge variant="success" className="text-lg">
                    ROUND: {gameInfo.currentRound}/{gameInfo.maxRounds}
                  </Badge>
                )}
              </>
            )}
          </div>

          <Badge
            variant="accent"
            className="text-lg w-full text-center p-4 mb-4"
          >
            {getGameStateDisplay()}
          </Badge>

          <div className="flex justify-center space-x-4">
            <Link href="/">
              <Button variant="secondary" size="sm">
                ← BACK TO MENU
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowQRCode(!showQRCode)}
            >
              📱 SHARE ROOM
            </Button>
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
                <Button
                  onClick={() => setShowQRCode(false)}
                  variant="accent"
                  size="lg"
                >
                  ❌ CLOSE
                </Button>
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
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>👥 PLAYERS</CardTitle>
              <CardDescription>DESTRUCTION PARTICIPANTS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameInfo.players.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 border-4 border-foreground bg-muted"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-lg uppercase tracking-wide">
                          {player.id === gameInfo.hostId && "👑 "}
                          {player.name}
                        </div>
                        <div className="text-sm">
                          <Badge variant="outline" className="mt-2">
                            SESSION: {player.sessionScore}PTS
                          </Badge>
                          {gameInfo.gameState === "playing" && (
                            <Badge variant="accent" className="mt-2 ml-2">
                              ROUND: {player.score}PTS
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Events */}
        {events.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>⚡ GAME ACTIVITY</CardTitle>
              <CardDescription>REAL-TIME DESTRUCTION FEED</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {events.slice(-10).map((event, index) => (
                  <div
                    key={index}
                    className="p-2 border-2 border-foreground bg-muted font-mono text-sm"
                  >
                    <span className="font-black uppercase tracking-wide">
                      {event.type === "playerJoined" &&
                        `👋 ${(event.data as { playerName?: string })?.playerName || "A PLAYER"} JOINED THE ROOM`}
                      {event.type === "playerLeft" &&
                        `👋 A PLAYER LEFT THE ROOM`}
                      {event.type === "gameTypeSelected" &&
                        `🎮 GAME TYPE SELECTED`}
                      {event.type === "roundStarted" && `🚀 ROUND STARTED!`}
                      {event.type === "roundFinished" && `🏁 ROUND FINISHED!`}
                      {event.type === "dennerChanged" &&
                        `👑 NEW DENNER SELECTED`}
                      {event.type === "sessionEnded" && `🎊 SESSION ENDED!`}
                      {event.type === "scoreSubmitted" &&
                        `📊 ${(event.data as { score?: number })?.score || 0}% SCORE SUBMITTED`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>🎮 SELECT GAME TYPE</CardTitle>
        <CardDescription>CHOOSE YOUR DESTRUCTION METHOD</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCurrentUserDenner ? (
          <>
            <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              AS THE DENNER, CHOOSE WHICH GAME TO PLAY THIS ROUND:
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => onSelectGameType("findColor")}
                variant="accent"
                size="lg"
                className="w-full h-auto p-6 flex-col space-y-2"
              >
                <div className="font-black text-2xl">🎯</div>
                <div className="font-black text-lg uppercase">
                  FIND COLOR GAME
                </div>
                <div className="font-bold text-sm uppercase tracking-wide opacity-80">
                  USE CAMERA TO FIND MATCHING COLORS
                </div>
              </Button>
              <Button
                onClick={() => onSelectGameType("colorMixing")}
                variant="secondary"
                size="lg"
                className="w-full h-auto p-6 flex-col space-y-2"
              >
                <div className="font-black text-2xl">🎨</div>
                <div className="font-black text-lg uppercase">
                  COLOR MIXING GAME
                </div>
                <div className="font-bold text-sm uppercase tracking-wide opacity-80">
                  MIX COLORS TO MATCH THE TARGET
                </div>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="font-black text-8xl">⏳</div>
            <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
              WAITING FOR DENNER{" "}
              <span className="text-accent">{gameInfo.dennerName}</span> TO
              SELECT THE GAME TYPE...
            </p>
          </div>
        )}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>📋 SESSION INFO</CardTitle>
        <CardDescription>CURRENT DESTRUCTION STATUS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="font-bold uppercase tracking-wide">
            CURRENT DENNER:
          </span>
          <Badge variant="accent">{gameInfo.dennerName}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="font-bold uppercase tracking-wide">ROUND:</span>
          <Badge variant="secondary">
            {gameInfo.currentRound}/{gameInfo.maxRounds}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="font-bold uppercase tracking-wide">PLAYERS:</span>
          <Badge variant="outline">
            {gameInfo.playerCount}/{gameInfo.maxPlayers}
          </Badge>
        </div>
      </CardContent>
    </Card>
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
    <Card
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
            <Button
              onClick={onStartRound}
              variant="accent"
              size="lg"
              className="w-full"
            >
              🚀 Start Round {gameInfo.currentRound + 1}
            </Button>
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
    </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>🎯 TARGET COLOR</CardTitle>
        <CardDescription>MATCH THIS EXACT COLOR</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div
          className="w-full h-32 border-8 border-foreground shadow-[16px_16px_0px_hsl(var(--foreground))] mx-auto"
          style={{ backgroundColor: gameInfo.targetColor }}
        />
        <Badge variant="outline" className="mt-2">
          {gameInfo.targetColor}
        </Badge>
        <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
          {gameInfo.gameType === "findColor"
            ? "FIND THIS COLOR IN YOUR SURROUNDINGS!"
            : "MIX RGB VALUES TO MATCH THIS COLOR!"}
        </p>

        <div className="space-y-2">
          <div className="font-mono text-sm font-bold text-foreground-muted">
            Time: {timer}s
          </div>
          {gameInfo.gameType === "findColor" && (
            <Button
              onClick={onCaptureColor}
              variant="success"
              size="lg"
              className="w-full"
              disabled={isLoading || !webcamReady}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="mr-2" />
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
            </Button>
          )}
        </div>
      </CardContent>
    </Card>

    {gameInfo.gameType === "findColor" && (
      <Card>
        <CardHeader>
          <CardTitle>📷 CAMERA VIEW</CardTitle>
          <CardDescription>USE YOUR CAMERA TO HUNT COLORS</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
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
                CAMERA ERROR
              </p>
              <div className="bg-destructive/10 border-4 border-destructive p-4 font-mono text-sm text-destructive">
                <p className="font-bold uppercase tracking-wide">
                  {cameraError}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
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
    <Card title={`🏁 Round ${gameInfo.currentRound} Results`}>
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
                <Button
                  onClick={onContinueSession}
                  variant="accent"
                  size="lg"
                  className="w-full"
                >
                  ➡️ Continue to Next Round
                  <br />
                  <span className="text-sm font-normal">
                    New denner will be selected
                  </span>
                </Button>
              ) : (
                <div className="md:col-span-2">
                  <Button
                    onClick={onEndSession}
                    variant="accent"
                    size="lg"
                    className="w-full"
                  >
                    🎊 View Final Results
                    <br />
                    <span className="text-sm font-normal">
                      All rounds completed
                    </span>
                  </Button>
                </div>
              )}
              <Button
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
              </Button>
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
    </Card>
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
    <Card title="🎊 Session Complete!">
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
            <Button onClick={onLeaveRoom} variant="accent" size="lg">
              🚪 Leave Room
            </Button>
            <Link href="/">
              <Button variant="secondary" size="lg">
                🏠 Back to Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  </div>
);
