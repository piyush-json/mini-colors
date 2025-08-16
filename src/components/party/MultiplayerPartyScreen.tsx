"use client";

import { useState, useEffect } from "react";
import { useSocket } from "../socket-provider";
import { FindColorGame } from "../FindColorGame";
import { ColorMixingGame } from "../ColorMixingGame";
import { LandingScreen } from "./LandingScreen";
import { CreateRoomForm } from "./CreateRoomForm";
import { JoinRoomForm } from "./JoinRoomForm";
import { GameLobby } from "./GameLobby";
import { RoundFinishedScreen } from "./RoundFinishedScreen";
import { SessionFinishedScreen } from "./SessionFinishedScreen";
import { GameSelectionScreen } from "./GameSelectionScreen";
import { TimerDisplay } from "@/lib/timer-utils";

export const MultiplayerPartyScreen = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Room configuration state
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [maxRounds, setMaxRounds] = useState<number>(3);
  const [guessTime, setGuessTime] = useState<number>(30);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Leaderboard modals
  const [showFinalLeaderboard, setShowFinalLeaderboard] = useState(false);

  const {
    isConnected,
    error,
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
    extendTime,
    setTargetColor,
    clearEvents,
    clearError,
  } = useSocket();

  const isCurrentUserDenner =
    gameInfo?.hostId ===
    gameInfo?.players?.find((p) => p.name === playerName)?.id;

  useEffect(() => {
    connect();
  }, [connect, isConnected]);

  // Handle socket events for notifications
  useEffect(() => {
    if (events && events.length > 0) {
      const latestEvent = events[events.length - 1];

      switch (latestEvent.type) {
        case "dennerChanged":
          const data = latestEvent.data as any;
          const reasonText =
            data.reason === "hostDisconnected"
              ? "disconnected"
              : data.reason === "hostLeft"
                ? "left the room"
                : "changed";

          console.log(
            `🔄 Denner changed to ${data.dennerName} (previous denner ${reasonText})`,
          );
          break;

        case "playerJoined":
          const joinData = latestEvent.data as any;
          console.log(`👋 ${joinData.playerName} joined the room`);
          break;

        case "playerLeft":
          console.log(`👋 A player left the room`);
          break;

        case "roundStarted":
          const roundData = latestEvent.data as any;
          console.log(`🎮 Round ${roundData.gameInfo?.currentRound} started`);
          break;

        case "roundFinished":
          console.log(`🏁 Round finished`);
          break;
          
        case "timeExtended":
          const timeData = latestEvent.data as any;
          console.log(`⏰ Time extended by ${timeData.additionalSeconds} seconds`);
          // Extend the local timer
          setTimeLeft((prev) => (prev || 0) + timeData.additionalSeconds);
          break;
      }
    }
  }, [events]);

  // Timer effect for game countdown
  useEffect(() => {
    if (gameInfo?.gameState === "playing" && gameInfo?.guessTime) {
      // Initialize timer when game starts
      setTimeLeft(gameInfo.guessTime);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval);
            // Timer expired - auto-submit score of 0
            if (currentRoom) {
              submitScore(currentRoom, 0, gameInfo.guessTime);
            }
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeLeft(null);
    }
  }, [gameInfo?.gameState, gameInfo?.guessTime, currentRoom, submitScore]);

  const handleCreateRoom = () => {
    if (playerName.trim()) {
      createRoom(playerName, "#ff0000", {
        maxPlayers,
        maxRounds,
        guessTime,
      });
      setShowCreateForm(false);
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim() && roomId.trim()) {
      joinRoom(roomId, playerName);
      setShowJoinForm(false);
    }
  };

  const handleGameTypeSelect = (gameType: "mix" | "find") => {
    if (currentRoom) {
      const socketGameType = gameType === "mix" ? "colorMixing" : "findColor";
      selectGameType(currentRoom, socketGameType);
    }
  };

  const handleContinueSession = () => {
    if (isCurrentUserDenner && currentRoom) {
      continueSession(currentRoom);
    }
  };

  const handleNewSession = () => {
    if (isCurrentUserDenner && currentRoom) {
      endSession(currentRoom);
    }
  };

  const handleBackToLanding = () => {
    leaveRoom();
    setPlayerName("");
    setRoomId("");
    setShowJoinForm(false);
    setShowCreateForm(false);
    setShowQRCode(false);
    setShowLeaderboard(false);
    setShowFinalLeaderboard(false);
  };

  const getRoomShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${window.location.pathname}?roomId=${gameInfo?.roomId}`;
    }
    return "";
  };

  // Landing screen - show join/create buttons
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#FFFFE7] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="font-sintony text-sm text-black">
            Connecting to server...
          </p>
          {error && (
            <p className="font-sintony text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (!gameInfo && !showJoinForm && !showCreateForm) {
    return (
      <LandingScreen
        onShowCreate={() => setShowCreateForm(true)}
        onShowJoin={() => setShowJoinForm(true)}
      />
    );
  }

  // Create room form
  if (showCreateForm) {
    return (
      <CreateRoomForm
        playerName={playerName}
        setPlayerName={setPlayerName}
        maxPlayers={maxPlayers}
        setMaxPlayers={setMaxPlayers}
        maxRounds={maxRounds}
        setMaxRounds={setMaxRounds}
        guessTime={guessTime}
        setGuessTime={setGuessTime}
        onCreateRoom={handleCreateRoom}
        onBack={() => setShowCreateForm(false)}
        showQRCode={showQRCode}
        setShowQRCode={setShowQRCode}
      />
    );
  }

  // Join room form
  if (showJoinForm) {
    return (
      <JoinRoomForm
        playerName={playerName}
        setPlayerName={setPlayerName}
        roomId={roomId}
        setRoomId={setRoomId}
        onJoinRoom={handleJoinRoom}
        onBack={() => setShowJoinForm(false)}
      />
    );
  }

  // Game states
  if (gameInfo) {
    // Lobby state - waiting for game to start
    if (gameInfo.gameState === "lobby") {
      return (
        <GameLobby
          gameInfo={gameInfo}
          isCurrentUserDenner={isCurrentUserDenner}
          showQRCode={showQRCode}
          setShowQRCode={setShowQRCode}
          getRoomShareUrl={getRoomShareUrl}
          onSelectGameType={(gameType) => {
            if (currentRoom) {
              selectGameType(currentRoom, gameType);
              startRound(currentRoom);
            }
          }}
          currentRoom={currentRoom || ""}
        />
      );
    }

    // Game selection state (between rounds)
    if (gameInfo.gameState === "gameSelection") {
      return (
        <GameSelectionScreen
          gameInfo={gameInfo}
          isCurrentUserDenner={isCurrentUserDenner}
          onGameTypeSelect={handleGameTypeSelect}
        />
      );
    }

    // Playing state
    if (gameInfo.gameState === "playing") {
      return (
        <div className="min-h-screen bg-[#FFFFE7] p-4">
          <div className="max-w-lg mx-auto pt-4">
            {/* Timer display */}
            {timeLeft !== null && (
              <div className="text-center mb-6">
                <TimerDisplay
                  timeLeft={timeLeft}
                  totalTime={gameInfo?.guessTime || 30}
                  urgencyLevel={
                    timeLeft <= 10
                      ? "critical"
                      : timeLeft <= 30
                        ? "warning"
                        : "normal"
                  }
                  showProgress={true}
                  showUrgencyMessage={true}
                />

                {/* Denner timer controls */}
                {isCurrentUserDenner && timeLeft > 0 && (
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        // Extend time for all players via server
                        if (currentRoom) {
                          extendTime(currentRoom, 30);
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 text-white border border-black rounded-lg shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] active:shadow-none active:translate-y-[2px] font-sintony text-[14px] transition-all duration-150"
                    >
                      +30s
                    </button>
                    <span className="px-2 py-2 font-sintony text-[12px] text-gray-600 flex items-center">
                      Denner controls
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Game component */}
            {gameInfo.gameType === "findColor" ? (
              <FindColorGame
                timeLimit={gameInfo.guessTime}
                onScoreSubmit={(score, timeTaken) => {
                  if (currentRoom) {
                    submitScore(currentRoom, score, timeTaken);
                  }
                }}
              />
            ) : (
              <ColorMixingGame
                timeLimit={gameInfo.guessTime}
                onScoreSubmit={(score, timeTaken) => {
                  if (currentRoom) {
                    submitScore(currentRoom, score, timeTaken);
                  }
                }}
              />
            )}
          </div>
        </div>
      );
    }

    // Round finished state
    if (gameInfo.gameState === "roundFinished") {
      return (
        <div className="min-h-screen bg-[#FFFFE7] p-4">
          <div className="max-w-lg mx-auto pt-8">
            <RoundFinishedScreen
              gameInfo={gameInfo}
              isCurrentUserDenner={isCurrentUserDenner}
              onContinueSession={handleContinueSession}
              onEndSession={handleNewSession}
              showLeaderboard={showLeaderboard}
              setShowLeaderboard={setShowLeaderboard}
            />
          </div>
        </div>
      );
    }

    // Session finished state
    if (gameInfo.gameState === "sessionFinished") {
      return (
        <div className="min-h-screen bg-[#FFFFE7] p-4">
          <div className="max-w-lg mx-auto pt-8">
            <SessionFinishedScreen
              gameInfo={gameInfo}
              isCurrentUserDenner={isCurrentUserDenner}
              onNewSession={handleNewSession}
              onBackToLanding={handleBackToLanding}
              showFinalLeaderboard={showFinalLeaderboard}
              setShowFinalLeaderboard={setShowFinalLeaderboard}
            />
          </div>
        </div>
      );
    }
  }

  // Fallback
  return (
    <div className="min-h-screen bg-[#FFFFE7] p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
        <p className="font-sintony text-[16px] text-black">Connecting...</p>
      </div>
    </div>
  );
};
