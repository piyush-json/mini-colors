import { cn } from "@/lib/utils";
import Image from "next/image";
import { Header } from "./header";
import { ArrowLeft, ArrowRight } from "./icons";

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
}: ShareMintScreenProps) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full  grow pb-8">
      <div className="flex flex-col items-center">
        <h1 className="font-hartone text-[39px] font-normal text-black text-center leading-[42px] w-full">
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
        <div
          className="w-full  h-[400px] bg-white border-[3px] border-black rounded-[12px] mx-auto relative mb-8 overflow-hidden"
          style={{ boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)" }}
        >
          {/* Target Color Circle */}
          <div
            className="absolute w-[120px] h-[120px] border border-black rounded-[19px] rotate-6"
            style={{
              backgroundColor: targetColor,
              left: "50%",
              top: "55%",
              transform: "translate(-30%, -50%) rotate(6deg)",
            }}
          />

          {/* Captured Color Circle */}
          <div
            className="absolute w-[120px] h-[120px] border border-black rounded-[19px] -rotate-6"
            style={{
              backgroundColor: capturedColor,
              left: "50%",
              top: "55%",
              transform: "translate(-70%, -50%) rotate(-6deg)",
            }}
          />
          <div
            className="absolute  top-[55%]  z-20"
            style={{
              left: "20%",
            }}
          >
            <ArrowLeft />
          </div>
          <div
            className="absolute  top-[55%]  z-20"
            style={{
              right: "20%",
            }}
          >
            <ArrowRight />
          </div>

          {/* Score Display */}
          <div className="absolute flex flex-col items-center gap-4 left-1/2 top-16 transform -translate-x-1/2">
            <span className="font-hartone text-[54px] font-normal text-black leading-[42px]">
              {similarity}%
            </span>
            <span className="font-sintony text-2xl font-normal text-black leading-4">
              It&apos;s a Match!
            </span>
          </div>

          {/* Color Labels */}
          <div className="absolute font-sintony text-sm font-normal text-black left-1/4 bottom-16 transform -translate-x-1/2 text-center">
            Target
            <br />
            colour
          </div>
          <div className="absolute font-sintony text-sm font-normal text-black right-1/4 bottom-16 transform translate-x-1/2 text-center">
            My
            <br />
            colour
          </div>

          {/* Color Palette Strips */}
          {/* Top color strip */}
          <div className="absolute w-full h-4 flex -top-[2px] left-0">
            {[
              "#FF9D9D",
              "#FFDB9D",
              "#C1FF9D",
              "#CB9DFF",
              "#FFF29D",
              "#5A9B7B",
              "#9DB4FF",
              "#FF9DE8",
              "#FFCE9D",
              "#C7FF9D",
              "#BF9DFF",
              "#C17C44",
              "#D0BBB5",
              "#9B3838",
              "#BFFF00",
              "#DFB43D",
            ].map((color, index) => (
              <div
                key={index}
                className="flex-1 h-3.5 border-t-2 border-l-2 border-black first:border-l-2 last:border-r-2"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Bottom color strip */}
          <div className="absolute w-full h-4 flex -bottom-[2px] left-0">
            {[
              "#FF9D9D",
              "#FFDB9D",
              "#C1FF9D",
              "#CB9DFF",
              "#FFF29D",
              "#5A9B7B",
              "#9DB4FF",
              "#FF9DE8",
              "#FFCE9D",
              "#C7FF9D",
              "#BF9DFF",
              "#C17C44",
              "#D0BBB5",
              "#9B3838",
              "#BFFF00",
              "#DFB43D",
            ]
              .reverse()
              .map((color, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 h-3.5  border-l-2 border-black first:border-l-2 last:border-r-2",
                    index == 0 && "border-l-0",
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
          </div>

          {/* Left color strip */}
          <div className="absolute w-4 h-full flex flex-col -left-[2px] top-0">
            {[
              "#2E62DB",
              "#A81C9A",
              "#F80000",
              "#FFDB9D",
              "#C1FF9D",
              "#CB9DFF",
              "#FFF29D",
              "#5A9B7B",
              "#9DB4FF",
              "#FF9DE8",
              "#FFCE9D",
              "#C7FF9D",
              "#BF9DFF",
              "#C17C44",
              "#D0BBB5",
              "#9B3838",
              "#BFFF00",
            ].map((color, index) => (
              <div
                key={index}
                className="w-3.5 flex-1 border-l-2 border-t-2 border-black first:border-t-2 last:border-b-2"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Right color strip */}
          <div className="absolute w-4 h-full flex flex-col -right-[2px] top-0">
            {[
              "#2E62DB",
              "#A81C9A",
              "#F80000",
              "#FFDB9D",
              "#C1FF9D",
              "#CB9DFF",
              "#FFF29D",
              "#5A9B7B",
              "#9DB4FF",
              "#FF9DE8",
              "#FFCE9D",
              "#C7FF9D",
              "#BF9DFF",
              "#C17C44",
              "#D0BBB5",
              "#9B3838",
              "#BFFF00",
            ].map((color, index) => (
              <div
                key={index}
                className="w-3.5 flex-1 border-t-2 border-black first:border-t-2 last:border-b-2"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
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
            className="grow h-[51px] bg-white border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal text-black hover:bg-gray-50 transition-colors"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
            onClick={onMint}
          >
            MINT NOW
          </button>
        </div>

        {mode === "practice" && (
          <button
            className="w-full h-[51px] bg-[#4ECDC4] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[24px] font-normal text-black hover:bg-[#3FB8B0] transition-colors"
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
