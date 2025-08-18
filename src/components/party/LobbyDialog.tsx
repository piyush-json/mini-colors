"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { useMiniKitUser } from "@/lib/useMiniKitUser";
import { Rank1, Rank2, Rank3 } from "../icons";
import { GameInfo } from "@/lib/useSocketIO";

interface LobbyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gameInfo: GameInfo;
  isCurrentUserDenner: boolean;
  onStartNextRound?: () => void;
  onEndSession?: () => void;
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  getRoomShareUrl: () => string;
}

const getRankIcon = (rank: string) => {
  switch (rank) {
    case "1":
      return (
        <div className="w-[50px] h-[50px] bg-white border-r border-black rounded-[5px]  flex items-center justify-center">
          <Rank1 />
        </div>
      );
    case "2":
      return (
        <div className="w-[50px] h-[50px] bg-white border-r border-black rounded-[5px]  flex items-center justify-center">
          <Rank2 />
        </div>
      );
    case "3":
      return (
        <div className="w-[50px] h-[50px] bg-white border-r border-black rounded-[5px]  flex items-center justify-center">
          <Rank3 />
        </div>
      );
    default:
      return (
        <div className="w-[50px] h-[50px] bg-white border-r border-black rounded-[5px]  flex items-center justify-center">
          <div className="w-[23px] h-[23px] rounded-full bg-black/10 flex items-center justify-center">
            <p className="text-[10px] font-hartone text-black opacity-45">
              {rank}
            </p>
          </div>
        </div>
      );
  }
};

export const LobbyDialog = ({
  isOpen,
  onClose,
  gameInfo,
  isCurrentUserDenner,
  onStartNextRound,
  onEndSession,
  showQRCode,
  setShowQRCode,
  getRoomShareUrl,
}: LobbyDialogProps) => {
  const { getUserAvatar } = useMiniKitUser();

  const isRound1 = gameInfo.currentRound <= 1;
  const sortedPlayers = isRound1
    ? gameInfo.players
    : [...(gameInfo.players || [])].sort(
        (a, b) => (b.sessionScore || 0) - (a.sessionScore || 0),
      );
  console.log(isCurrentUserDenner, onStartNextRound, onEndSession);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-black rounded-[34px] p-10 max-w-md mx-auto shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-8">
          {/* Room header */}
          <div className="text-center">
            <h1 className="font-hartone text-[32px] leading-[35px] text-black mb-2">
              Room: {gameInfo.roomId}
            </h1>

            {/* QR Code toggle */}
            {/* <button
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
            )} */}
          </div>

          {/* Top Section: Players (Round 1) or Leaderboard (Other Rounds) */}
          <div className="w-full">
            {isRound1 ? (
              <div className="w-full flex flex-col items-center">
                <h3 className="font-hartone text-[20px] leading-[22px] text-black mb-4">
                  Players ({gameInfo.playerCount}/{gameInfo.maxPlayers})
                </h3>
                <div className="grid grid-cols-1 gap-1 w-full">
                  {gameInfo.players?.map((player: any) => {
                    return (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 p-3 border border-black rounded-lg"
                      >
                        <span className="font-sintony text-[14px] text-black">
                          {player.name}{" "}
                          {player.id === gameInfo.dennerId && "👑"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Leaderboard for other rounds */
              <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
                <h3 className="font-sintony font-bold text-[22px] text-center text-black mb-4">
                  LEADERBOARD
                </h3>
                <div className="space-y-3">
                  {sortedPlayers.map((player, index) => {
                    const pfpUrl = getUserAvatar();
                    return (
                      <div
                        key={player.id}
                        className="bg-white/30 border border-black rounded-lg h-[50px] flex items-center"
                      >
                        {/* Rank */}
                        <div className="w-[50px] h-[50px] border-r border-black flex items-center justify-center">
                          {getRankIcon((index + 1).toString())}
                        </div>

                        {/* Player Info */}
                        <div className="flex items-center gap-1 px-2 flex-1">
                          <span className="font-sintony text-[12px] text-black tracking-wider">
                            {player.name}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="px-4">
                          <span className="font-hartone text-[16px] text-black tracking-wider">
                            {player.sessionScore || 0}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Game Type Selection (only for Round 1) */}
          {/* Removed game type selection - only show denner controls */}

          {/* Bottom Section: Denner Controls */}
          {isCurrentUserDenner && onStartNextRound && onEndSession ? (
            <div className="flex gap-2.5 w-full">
              <button
                onClick={onEndSession}
                className="flex-1 h-[42px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[16px] tracking-wider text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              >
                END SESSION
              </button>
              <button
                onClick={onStartNextRound}
                className="flex-1 h-[42px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[16px] tracking-wider text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              >
                START NEXT ROUND
              </button>
            </div>
          ) : (
            <div className="text-center text-black">
              {`Waiting for denner ${gameInfo.dennerName} to start next round`}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
