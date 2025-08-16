"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SessionFinishedScreenProps {
  gameInfo: any;
  isCurrentUserDenner: boolean;
  onNewSession: () => void;
  onBackToLanding: () => void;
  showFinalLeaderboard: boolean;
  setShowFinalLeaderboard: (show: boolean) => void;
}

export const SessionFinishedScreen = ({
  gameInfo,
  isCurrentUserDenner,
  onNewSession,
  onBackToLanding,
  showFinalLeaderboard,
  setShowFinalLeaderboard,
}: SessionFinishedScreenProps) => {
  const winner = gameInfo.players?.reduce((prev: any, current: any) =>
    (prev.score || 0) > (current.score || 0) ? prev : current,
  );

  return (
    <div className="w-full">
      <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
        <h2 className="font-hartone text-[24px] leading-[26px] text-black mb-6 text-center">
          🎉 Session Complete!
        </h2>

        {winner && (
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFE254] border border-black flex items-center justify-center">
              <span className="font-hartone text-[24px] text-black">👑</span>
            </div>
            <h3 className="font-hartone text-[20px] text-black">
              {winner.name} Wins!
            </h3>
            <p className="font-sintony text-[16px] text-black">
              Final Score: {winner.score || 0} points
            </p>
          </div>
        )}

        <div className="text-center mb-6">
          <Button
            onClick={() => setShowFinalLeaderboard(true)}
            className="bg-[#FFE254] text-black border border-black hover:bg-yellow-300 font-hartone text-[18px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
          >
            Final Leaderboard
          </Button>
        </div>

        {/* Denner controls */}
        {isCurrentUserDenner && (
          <div className="flex gap-4">
            <button
              onClick={onNewSession}
              className="flex-1 h-[52px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
            >
              NEW SESSION
            </button>
            <button
              onClick={onBackToLanding}
              className="flex-1 h-[52px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
            >
              LEAVE PARTY
            </button>
          </div>
        )}

        {!isCurrentUserDenner && (
          <div className="text-center py-4">
            <p className="font-sintony text-[16px] text-black">
              Session ended! Waiting for denner{" "}
              <strong>{gameInfo.dennerName}</strong>...
            </p>
            <button
              onClick={onBackToLanding}
              className="mt-4 h-[52px] px-8 bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
            >
              LEAVE PARTY
            </button>
          </div>
        )}
      </div>

      {/* Final Leaderboard Modal */}
      <Dialog
        open={showFinalLeaderboard}
        onOpenChange={setShowFinalLeaderboard}
      >
        <DialogContent className="bg-[#FFFFE7] border-2 border-black max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="font-hartone text-[24px] text-black">
              Final Leaderboard
            </DialogTitle>
            <DialogDescription className="font-sintony text-black">
              Session results for all {gameInfo.maxRounds} rounds
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {gameInfo.players
              ?.sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
              .map((player: any, index: number) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 border border-black rounded-lg ${
                    index === 0 ? "bg-[#FFE254]" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-hartone text-[18px] text-black">
                      {index === 0 ? "👑" : `#${index + 1}`}
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
};
