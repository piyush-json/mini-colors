"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { sdk } from "@farcaster/miniapp-sdk";
import { ExternalLink } from "lucide-react";

interface TokenLiveSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenLiveSheet = ({ isOpen, onClose }: TokenLiveSheetProps) => {
  const handleTradeClick = () => {
    sdk.actions.openUrl(
      "https://www.clanker.world/clanker/0x41eC005F5D0e4eB272812d0ea1b0EEF1F66Fcb07",
    );
  };

  const handleInfoClick = () => {
    sdk.actions.openUrl(
      "https://x.com/playshade_fun/status/1963659721891783039",
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="bg-[#FFFFE7] border-2 border-black rounded-t-2xl max-h-[80vh]"
      >
        <SheetHeader className="text-center space-y-4 pb-6">
          <SheetTitle className="font-hartone text-2xl font-normal text-black text-center">
            Play Shade token is Live!
          </SheetTitle>
          <SheetDescription className="font-sintony text-base text-gray-600 text-center">
            Our token is now live and ready for trading. Check it out!
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Trade Button */}
          <button
            onClick={handleTradeClick}
            className="w-full px-8 py-4 bg-[#4ECDC4] hover:bg-[#3FB8B0] border border-black rounded-full font-hartone text-lg font-light text-black transition-colors flex items-center justify-center gap-2"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
          >
            Trade on Clanker
            <ExternalLink className="h-4 w-4" />
          </button>

          {/* Info Button */}
          <button
            onClick={handleInfoClick}
            className="w-full px-8 py-4 bg-[#FFE254] hover:bg-[#E6CC4A] border border-black rounded-full font-hartone text-lg font-light text-black transition-colors flex items-center justify-center gap-2"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
          >
            Learn More
            <ExternalLink className="h-4 w-4" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-8 py-3 bg-gray-100 hover:bg-gray-200 border border-black rounded-full font-hartone text-base font-light text-gray-600 transition-colors"
            style={{
              boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
          >
            Maybe Later
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
