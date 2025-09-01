import { cn } from "@/lib/utils";
import { useMiniKitUser } from "@/lib/useMiniKitUser";
import { MintCard } from "./MintCard";

interface ShareMintScreenProps {
  targetColor: string;
  capturedColor: string;
  similarity: number;
  timeTaken: number;
  mode: "daily" | "practice";
  gameType: "upload" | "mixing";
  onShare: () => void;
  onMint: () => void;
  onContinue: () => void;
  onAttemptAgain: () => void;
  className?: string;
  isMinting?: boolean;
}

export const ShareMintScreen = ({
  targetColor,
  capturedColor,
  similarity,
  timeTaken,
  mode,
  gameType,
  onShare,
  onMint,
  onContinue,
  onAttemptAgain,
  className,
  isMinting = false,
}: ShareMintScreenProps) => {
  const { getUserId, getUserName } = useMiniKitUser();

  return (
    <div className="flex flex-col gap-4 items-center w-full  grow pb-8">
      <div className="flex flex-col w-full items-center">
        <h1 className="font-hartone font-extralight text-[39px]  text-black text-center leading-[42px] w-full">
          YOU FOUND IT!
        </h1>
        <p className="font-sintony text-sm font-normal text-black text-center mt-2">
          {mode === "daily"
            ? "You completed today's challenge!"
            : "You made the colours, let's share it!"}
        </p>
        {mode === "daily" && (
          <p className="font-sintony text-xs font-normal text-gray-600 text-center mt-1">
            Come back tomorrow for a new challenge!
          </p>
        )}
      </div>
      <div className="w-full grow">
        <MintCard
          targetColor={targetColor}
          capturedColor={capturedColor}
          similarity={similarity}
          userName={getUserName()}
          timeTaken={timeTaken}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex  gap-3 w-full">
          <button
            className="grow h-[51px] bg-[#FFE254] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal text-black hover:bg-[#FFD700] transition-colors"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
            onClick={onShare}
          >
            SHARE
          </button>
          <button
            className={cn(
              "grow h-[51px] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal text-black transition-colors",
              isMinting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4ECDC4] hover:bg-[#3FB8B0]",
            )}
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
            onClick={onMint}
            disabled={isMinting}
          >
            {isMinting ? "MINTING..." : "MINT NOW"}
          </button>
        </div>

        {mode === "practice" && (
          <button
            className="w-full h-[51px] bg-white hover:bg-gray-50 border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal text-black transition-colors"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
            onClick={onAttemptAgain}
          >
            ATTEMPT AGAIN
          </button>
        )}
      </div>
    </div>
  );
};
