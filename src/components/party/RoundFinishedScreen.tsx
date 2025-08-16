"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface RoundFinishedScreenProps {
  gameInfo: any;
  isCurrentUserDenner: boolean;
  onContinueSession: () => void;
  onEndSession: () => void;
  showLeaderboard: boolean;
  setShowLeaderboard: (show: boolean) => void;
}

export const RoundFinishedScreen = ({
  gameInfo,
  isCurrentUserDenner,
  onContinueSession,
  onEndSession,
  showLeaderboard,
  setShowLeaderboard,
}: RoundFinishedScreenProps) => (
  <div className="w-full">
    <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="font-hartone text-[24px] leading-[26px] text-black mb-6 text-center">
        🏁 Round {gameInfo.currentRound} Complete!
      </h2>

      {/* Round Summary */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-hartone text-[16px] text-black">
              {gameInfo.gameType === "findColor" ? "🎯" : "🎨"}
            </div>
            <div className="font-sintony text-[12px] text-gray-600">
              {gameInfo.gameType === "findColor"
                ? "Find Color"
                : "Color Mixing"}
            </div>
          </div>
          <div>
            <div className="font-hartone text-[16px] text-black">
              {gameInfo.guessTime}s
            </div>
            <div className="font-sintony text-[12px] text-gray-600">
              Time Limit
            </div>
          </div>
          <div>
            <div className="font-hartone text-[16px] text-black">
              {gameInfo.currentRound}/{gameInfo.maxRounds}
            </div>
            <div className="font-sintony text-[12px] text-gray-600">
              Progress
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <Button
          onClick={() => setShowLeaderboard(true)}
          className="bg-[#FFE254] text-black border border-black hover:bg-yellow-300 font-hartone text-[18px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
        >
          View Leaderboard
        </Button>
      </div>

      {/* Denner controls */}
      {isCurrentUserDenner && (
        <div className="flex gap-4">
          {gameInfo.currentRound < gameInfo.maxRounds ? (
            <button
              onClick={onContinueSession}
              className="flex-1 h-[52px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
            >
              NEXT ROUND
            </button>
          ) : null}

          <button
            onClick={onEndSession}
            className="flex-1 h-[52px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
          >
            END SESSION
          </button>
        </div>
      )}

      {!isCurrentUserDenner && (
        <div className="text-center py-4">
          <p className="font-sintony text-[16px] text-black">
            Waiting for denner <strong>{gameInfo.dennerName}</strong> to
            continue...
          </p>
        </div>
      )}
    </div>

    {/* Leaderboard Modal */}
    <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
      <DialogContent className="bg-[#FFFFE7] border-2 border-black max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="font-hartone text-[24px] text-black">
            Round {gameInfo.currentRound} Leaderboard
          </DialogTitle>
          <DialogDescription className="font-sintony text-black">
            Here are the results for this round
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {gameInfo.players
            ?.sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
            .map((player: any, index: number) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-white border border-black rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-hartone text-[18px] text-black">
                    #{index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-sintony text-[16px] text-black">
                    {player.name}
                  </span>
                </div>
                <span className="font-hartone text-[18px] text-black">
                  {player.score || 0} pts
                </span>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  </div>
);
