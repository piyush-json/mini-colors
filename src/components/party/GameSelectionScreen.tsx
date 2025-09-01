"use client";

import { Button } from "@/components/ui/button";

interface GameSelectionScreenProps {
  gameInfo: any;
  isCurrentUserDenner: boolean;
  onGameTypeSelect: (gameType: "mix" | "find") => void;
}

export const GameSelectionScreen = ({
  gameInfo,
  isCurrentUserDenner,
  onGameTypeSelect,
}: GameSelectionScreenProps) => (
  <div className="w-full">
    <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="font-hartone text-[24px] leading-[26px] text-black mb-6 text-center">
        Choose Next Game
      </h2>

      <div className="text-center mb-6">
        <p className="font-sintony text-[16px] text-black">
          Round {gameInfo.currentRound + 1} of {gameInfo.maxRounds}
        </p>
      </div>

      {isCurrentUserDenner ? (
        <div className="space-y-4">
          <p className="font-sintony text-[16px] text-black text-center mb-6">
            As the host, choose the game type for this round:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onGameTypeSelect("mix")}
              className="h-[80px] bg-[#FFE254] border border-black rounded-[12px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
            >
              <span className="text-[24px] mb-1">🎨</span>
              COLOR MIXING
            </button>

            <button
              onClick={() => onGameTypeSelect("find")}
              className="h-[80px] bg-[#FFE254] border border-black rounded-[12px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
            >
              <span className="text-[24px] mb-1">🔍</span>
              FIND COLOR
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
          <p className="font-sintony text-[16px] text-black">
            Waiting for host <strong>{gameInfo.dennerName}</strong> to choose
            the next game...
          </p>
        </div>
      )}

      {/* Players list */}
      <div className="mt-8 border-t border-black pt-6">
        <h3 className="font-hartone text-[18px] text-black mb-4">
          Players in Lobby
        </h3>
        <div className="space-y-2">
          {gameInfo.players?.map((player: any) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-gray-50 border border-black rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-sintony text-[16px] text-black">
                  {player.name}
                  {player.id === gameInfo.dennerId && (
                    <span className="ml-2 text-[12px] bg-[#FFE254] border border-black px-2 py-1 rounded-full font-hartone">
                      HOST
                    </span>
                  )}
                </span>
              </div>
              <span className="font-hartone text-[14px] text-black">
                {player.score || 0} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
