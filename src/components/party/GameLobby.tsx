"use client";

import { QRCodeSVG } from "qrcode.react";

interface GameLobbyProps {
  gameInfo: any;
  isCurrentUserDenner: boolean;
  onSelectGameType: (gameType: "findColor" | "colorMixing") => void;
  currentRoom: string;
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  getRoomShareUrl: () => string;
}

export const GameLobby = ({
  gameInfo,
  isCurrentUserDenner,
  onSelectGameType,
  currentRoom,
  showQRCode,
  setShowQRCode,
  getRoomShareUrl,
}: GameLobbyProps) => (
  <div className="min-h-screen bg-[#FFFFE7] p-4 font-mono">
    <div className="w-full pt-8">
      {/* Room header */}
      <div className="text-center mb-8">
        <h1 className="font-hartone text-[32px] leading-[35px] text-black mb-2">
          Room: {currentRoom}
        </h1>

        {/* QR Code toggle */}
        <button
          onClick={() => setShowQRCode(!showQRCode)}
          className="font-sintony text-[14px] text-blue-600 underline mb-4"
        >
          {showQRCode ? "Hide" : "Show"} QR Code
        </button>

        {showQRCode && (
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 border border-black rounded-lg">
              <QRCodeSVG value={getRoomShareUrl()} size={128} />
            </div>
          </div>
        )}

        <div className="font-sintony text-[16px] text-black">
          Waiting for denner {gameInfo.dennerName} to select game type
        </div>
      </div>

      {/* Game selection */}
      <div className="w-full mb-6">
        <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
          <h2 className="font-hartone text-[24px] leading-[26px] text-black mb-4 text-center">
            🎮 Select Game Type
          </h2>

          {isCurrentUserDenner ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onSelectGameType("findColor")}
                className="h-[100px] bg-[#FFE254] border border-black rounded-[12px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              >
                🎯 Find Color
                <span className="font-sintony text-[12px] mt-1">
                  Match the target color
                </span>
              </button>

              <button
                onClick={() => onSelectGameType("colorMixing")}
                className="h-[100px] bg-[#FFE254] border border-black rounded-[12px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              >
                🎨 Color Mixing
                <span className="font-sintony text-[12px] mt-1">
                  Mix colors to match
                </span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="font-sintony text-[16px] text-black">
                Waiting for denner <strong>{gameInfo.dennerName}</strong> to
                select game type...
              </p>
            </div>
          )}
        </div>

        {/* Game Settings */}
        <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
          <h3 className="font-hartone text-[20px] leading-[22px] text-black mb-4">
            ⚙️ Game Settings
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
              <div className="font-hartone text-[16px] text-black">
                {gameInfo.maxRounds}
              </div>
              <div className="font-sintony text-[12px] text-gray-600">
                Rounds
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
              <div className="font-hartone text-[16px] text-black">
                {gameInfo.guessTime}s
              </div>
              <div className="font-sintony text-[12px] text-gray-600">
                Time Limit
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
              <div className="font-hartone text-[16px] text-black">
                {gameInfo.currentRound || 1}
              </div>
              <div className="font-sintony text-[12px] text-gray-600">
                Current Round
              </div>
            </div>
          </div>
        </div>

        {/* Players list */}
        <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
          <h3 className="font-hartone text-[20px] leading-[22px] text-black mb-4">
            👥 Players ({gameInfo.playerCount}/{gameInfo.maxPlayers})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {gameInfo.players?.map((player: any, index: number) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-sintony text-[14px] text-black">
                  {player.name} {player.id === gameInfo.hostId && "👑"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
