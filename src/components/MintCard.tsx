import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "./icons";

interface MintCardProps {
  targetColor: string;
  capturedColor: string;
  similarity: number;
  userName: string;
}

const colorPalette = [
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
];

const leftRightColorPalette = [
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
];

export const MintCard = ({
  targetColor,
  capturedColor,
  similarity,
  userName,
}: MintCardProps) => {
  return (
    <div
      id="mintit"
      className="w-full h-[400px] bg-white border-[3px] border-black rounded-[12px] mx-auto flex flex-col items-center relative overflow-hidden p-8 pt-[17%]"
      style={{ boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)" }}
    >
      {/* Header Section */}
      <div className="flex flex-col justify-between items-start left-8 top-8  absolute ">
        {/* Date and Username */}
        <span className="font-sintony text-sm font-semibold text-black">
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })}
        </span>
        <span className="font-sintony text-sm font-normal text-gray-700">
          @{userName}
        </span>
      </div>

      {/* Score Section */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <span className="font-hartone text-[54px] font-normal text-black leading-[42px]">
          {similarity.toFixed(2)}%
        </span>
        <span className="font-sintony text-2xl font-normal text-black leading-4">
          It&apos;s a Match!
        </span>
      </div>

      {/* Color Circles Section */}
      <div className="flex items-center justify-center gap-8 relative w-full grow">
        <div className="flex flex-col items-start gap-2 absolute left-10 top-15 z-5">
          <div
            className="w-[120px] h-[120px] border border-black rounded-[19px] transform -rotate-6"
            style={{ backgroundColor: targetColor }}
          />
          <p className="font-sintony text-sm font-normal pl-4 pt-4 text-black text-center">
            Target
            <br />
            colour
          </p>
        </div>

        {/* Arrow */}
        <div className="absolute left-8 top-[40%] z-10">
          <ArrowLeft />
        </div>
        <div className="absolute right-14 top-[50%] z-10">
          <ArrowRight />
        </div>

        {/* Captured Color Circle */}
        <div className="flex flex-col items-end gap-2 absolute right-10 top-10 z-1">
          <div
            className="w-[120px] h-[120px] border border-black rounded-[19px] transform rotate-6"
            style={{ backgroundColor: capturedColor }}
          />
          <p className="font-sintony text-sm font-normal text-black text-center pr-4 pt-4">
            My
            <br />
            colour
          </p>
        </div>
      </div>

      {/* Color Palette Borders */}
      {/* Top color strip */}
      <div className="absolute w-full h-4 flex -top-[2px] left-0">
        {colorPalette.map((color, index) => (
          <div
            key={`top-${index}`}
            className="flex-1 h-3.5 border-t-2 border-l-2 border-black first:border-l-2 last:border-r-2"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Bottom color strip */}
      <div className="absolute w-full h-4 flex -bottom-[2px] left-0">
        {[...colorPalette].reverse().map((color, index) => (
          <div
            key={`bottom-${index}`}
            className={cn(
              "flex-1 h-3.5 border-l-2 border-black first:border-l-2 last:border-r-2",
              index === 0 && "border-l-0",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Left color strip */}
      <div className="absolute w-4 h-full flex flex-col -left-[2px] top-0">
        {leftRightColorPalette.map((color, index) => (
          <div
            key={`left-${index}`}
            className="w-3.5 flex-1 border-l-2 border-t-2 border-black first:border-t-2 last:border-b-2"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Right color strip */}
      <div className="absolute w-4 h-full flex flex-col -right-[2px] top-0">
        {leftRightColorPalette.map((color, index) => (
          <div
            key={`right-${index}`}
            className="w-3.5 flex-1 border-t-2 border-black first:border-t-2 last:border-b-2"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};
