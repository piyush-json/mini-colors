"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface GameSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roundNumber: number;
  onGameTypeSelect: (gameType: "findColor" | "colorMixing") => void;
  onInvitePlayers?: () => void;
}

export const GameSelectionDialog = ({
  isOpen,
  onClose,
  roundNumber,
  onGameTypeSelect,
  onInvitePlayers,
}: GameSelectionDialogProps) => {
  const [selectedGame, setSelectedGame] = useState<
    "findColor" | "colorMixing" | null
  >(null);

  const handleGameSelect = (gameType: "findColor" | "colorMixing") => {
    setSelectedGame(gameType);
  };

  const handleConfirm = () => {
    if (selectedGame) {
      onGameTypeSelect(selectedGame);
      setSelectedGame(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-black rounded-[34px] p-10 w-[80vw] max-w-sm mx-auto shadow-lg">
        <div className="flex flex-col gap-[42px]">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="font-hartone font-extralight text-[44px] leading-[42px] text-black">
              You are the denner
            </h2>
            <p className="font-sintony text-[14px] leading-[20px] text-black">
              Select which game you want to go with for round {roundNumber}
            </p>
          </div>

          {/* Game Selection */}
          <div className="flex gap-[13px]">
            <button
              onClick={() => handleGameSelect("findColor")}
              className={`w-[137px] h-[128px] border border-black rounded-lg flex items-end justify-center pb-4 transition-all duration-150 ${
                selectedGame === "findColor"
                  ? "bg-[#FFE254] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-[#F0F0F0] hover:bg-[#E8E8E8]"
              }`}
            >
              <span className="font-hartone text-[18px] tracking-wider text-black">
                FIND COLOUR
              </span>
            </button>

            <button
              onClick={() => handleGameSelect("colorMixing")}
              className={`w-[137px] h-[128px] border border-black rounded-lg flex items-end justify-center pb-4 transition-all duration-150 ${
                selectedGame === "colorMixing"
                  ? "bg-[#FFE254] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-[#F0F0F0] hover:bg-[#E8E8E8]"
              }`}
            >
              <span className="font-hartone text-[18px] tracking-wider text-black">
                MIX COLOUR
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {selectedGame && (
              <button
                onClick={handleConfirm}
                className="w-full h-[62px] bg-[#FFE254] border border-black rounded-[22px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[22px] tracking-wider text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              >
                START ROUND {roundNumber}
              </button>
            )}

            {/* {onInvitePlayers && (
              <button
                onClick={onInvitePlayers}
                className="w-full h-[62px] bg-white border border-black rounded-[22px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[22px] tracking-wider text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              >
                INVITE PLAYERS
              </button>
            )} */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
