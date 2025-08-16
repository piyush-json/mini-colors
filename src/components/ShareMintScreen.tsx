import { cn } from "@/lib/utils";
import { Twitter } from "lucide-react";
import Image from "next/image";
import { Header } from "./header";

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
    <div className="flex flex-col items-center w-full justify-between grow pb-8">
      <div className="flex flex-col items-center">
        <h1 className="font-hartone text-[39px] font-normal text-black text-center leading-[42px] w-full">
          YOU FOUND IT!
        </h1>
        <p className="font-sintony text-sm font-normal text-black text-center">
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

      <div
        className="w-fulll h-[443px] bg-white border-2 border-black rounded-[12px] mx-auto relative"
        style={{ boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)" }}
      >
        <div
          className="absolute w-full h-[158px] border border-black rounded-[19px] rotate-6"
          style={{
            backgroundColor: targetColor,
            left: "167px",
            top: "187px",
          }}
        />

        {/* Captured Color Circle */}
        <div
          className="absolute w-full h-[166px] border border-black rounded-[19px] -rotate-6"
          style={{
            backgroundColor: capturedColor,
            left: "49px",
            top: "174px",
          }}
        />

        <div
          className="absolute flex flex-col items-center gap-4"
          style={{ left: "104px", top: "64px" }}
        >
          <span className="font-hartone text-[54px] font-normal text-black leading-[42px]">
            {similarity}%
          </span>
          <span className="font-sintony text-2xl font-normal text-black leading-4">
            It&apos;s a Match!
          </span>
        </div>

        <div
          className="absolute font-sintony text-sm font-normal text-black"
          style={{ left: "68px", top: "369px" }}
        >
          Target
          <br />
          colour
        </div>
        <div
          className="absolute font-sintony text-sm font-normal text-black"
          style={{ left: "258px", top: "366px" }}
        >
          My
          <br />
          colour
        </div>

        {/* Color Palette Strips */}
        <div className="absolute w-full h-4 flex" style={{ top: "253px" }}>
          {/* Top color strip */}
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
              className="w-6 h-3.5 border-t-2 border-l-2 border-black first:border-l-2 last:border-r-2"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="absolute w-[373px] h-4 flex" style={{ top: "427px" }}>
          {/* Bottom color strip (reversed) */}
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
                className="w-6 h-3.5 border-b-2 border-l-2 border-black first:border-l-2 last:border-r-2"
                style={{ backgroundColor: color }}
              />
            ))}
        </div>

        {/* Left color strip */}
        <div
          className="absolute w-4 h-[415px] flex flex-col"
          style={{ left: "-3px", top: "14px" }}
        >
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
              className="w-3.5 h-6 border-l-2 border-t-2 border-black first:border-t-2 last:border-b-2"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Right color strip */}
        <div
          className="absolute w-4 h-[415px] flex flex-col"
          style={{ left: "360px", top: "14px" }}
        >
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
              className="w-3.5 h-6 border-r-2 border-t-2 border-black first:border-t-2 last:border-b-2"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-[373px] mx-auto">
        <button
          className="w-full h-[51px] bg-[#FFE254] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal text-black"
          style={{
            boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
            letterSpacing: "7.5%",
          }}
          onClick={onShare}
        >
          SHARE
        </button>

        {mode === "practice" && (
          <button
            className="w-full h-[51px] bg-[#4ECDC4] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[24px] font-normal text-black"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
            onClick={onAttemptAgain}
          >
            ATTEMPT AGAIN
          </button>
        )}

        <button
          className="w-full h-[51px] bg-white border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal text-black"
          style={{
            boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
            letterSpacing: "7.5%",
          }}
          onClick={onMint}
        >
          MINT NOW
        </button>
      </div>
    </div>
  );
};
