"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMiniKitUser } from "@/lib/useMiniKitUser";
import { GameInfo } from "@/lib/useSocketIO";

interface RoundTransitionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gameInfo: GameInfo;
  isCurrentUserDenner: boolean;
  onMoveToNext: () => void;
  onDismissGame: () => void;
}

export const RoundTransitionDialog = ({
  isOpen,
  onClose,
  gameInfo,
  isCurrentUserDenner,
  onMoveToNext,
  onDismissGame,
}: RoundTransitionDialogProps) => {
  const { getUserAvatar } = useMiniKitUser();

  const sortedPlayers = [...gameInfo.players].sort(
    (a, b) => b.sessionScore - a.sessionScore,
  );

  const getTrophyIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-6 h-6 rounded-full bg-yellow-400 border border-black flex items-center justify-center">
            <span className="text-[10px] font-bold text-black">1</span>
          </div>
        );
      case 2:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-400 border border-black flex items-center justify-center">
            <span className="text-[10px] font-bold text-black">2</span>
          </div>
        );
      case 3:
        return (
          <div className="w-6 h-6 rounded-full bg-orange-400 border border-black flex items-center justify-center">
            <span className="text-[10px] font-bold text-black">3</span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 border border-black flex items-center justify-center">
            <span className="text-[10px] font-bold text-black">{rank}</span>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-black rounded-[34px] p-10 max-w-sm mx-auto shadow-lg">
        <div className="flex flex-col items-center gap-11">
          {/* Header */}
          <div className="text-center">
            <h2 className="font-hartone font-extralight text-[44px] leading-[42px] text-black mb-0">
              ROUND {gameInfo.currentRound} IS OVER
            </h2>
          </div>

          {/* Leaderboard Section */}
          <div className="w-full">
            <h3 className="font-sintony font-bold text-[22px] text-center text-black mb-4">
              LEADERBOARD
            </h3>
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => {
                const pfpUrl = getUserAvatar(); // In a real implementation, you'd get each player's avatar
                return (
                  <div
                    key={player.id}
                    className="bg-white/30 border border-black rounded-lg h-[50px] flex items-center"
                  >
                    {/* Rank */}
                    <div className="w-[50px] h-[50px] border-r border-black flex items-center justify-center">
                      {getTrophyIcon(index + 1)}
                    </div>

                    {/* Player Info */}
                    <div className="flex items-center gap-1 px-2 flex-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 border border-black overflow-hidden">
                        {pfpUrl ? (
                          <img
                            src={pfpUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300"></div>
                        )}
                      </div>
                      <span className="font-sintony text-[12px] text-black tracking-wider">
                        {player.name}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="px-4">
                      <span className="font-hartone text-[16px] text-black tracking-wider">
                        {player.sessionScore}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          {isCurrentUserDenner && (
            <div className="flex gap-2.5 w-full">
              <button
                onClick={onDismissGame}
                className="flex-1 h-[42px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[16px] tracking-wider text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              >
                DISMISS GAME
              </button>
              <button
                onClick={onMoveToNext}
                className="flex-1 h-[42px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[16px] tracking-wider text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              >
                MOVE TO NEXT
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
