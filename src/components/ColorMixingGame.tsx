"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useColorMixingGame } from "@/lib/useColorMixingGame";
import { useGameContext } from "@/lib/GameContext";

interface ColorMixingGameProps {
  targetColor?: string | null;
  onScoreSubmit?: (score: number, timeTaken: number) => void;
  isMultiplayer?: boolean;
  disabled?: boolean;
}

interface ColorSliderProps {
  value: number;
  onChange: (value: number) => void;
  colorHex: string;
  disabled?: boolean;
}

const ColorSlider = ({
  value,
  onChange,
  colorHex,
  disabled = false,
}: ColorSliderProps) => {
  return (
    <div className="flex items-center w-full gap-[30px]">
      <div className="relative w-[318px] h-[48px]">
        {/* Track Background */}
        <div className="absolute top-[5px] w-[318px] h-[38px] bg-white border border-black rounded-[21px]">
          {/* Filled Rectangle */}
          <div
            className="absolute top-[1px] left-[1px] h-[36px] rounded-[20px] border-l border-black transition-all duration-200"
            style={{
              backgroundColor: colorHex,
              width: `${(value / 100) * 315}px`,
            }}
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 w-[48px] h-[48px] rounded-full border-[4px] border-black bg-white transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: colorHex,
            left: `${(value / 100) * 270}px`,
          }}
        />

        {/* Hidden range input for interaction */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>

      {/* Percentage Label */}
      <div className="text-[22px] font-hartone leading-[16px] tracking-[7.5%] text-black text-right min-w-[40px]">
        {value}%
      </div>
    </div>
  );
};

export const ColorMixingGame = ({
  targetColor = "#A6C598",
  onScoreSubmit,
  isMultiplayer = false,
  disabled = false,
}: ColorMixingGameProps = {}) => {
  // Use the color mixing game hook
  const {
    state,
    targetColorHex,
    mixedColorHex,
    handleSliderChange,
    handleShadingChange,
    handleMix,
    getColorHex,
  } = useColorMixingGame({
    isMultiplayer,
    targetColor: targetColor || "#A6C598",
    onScoreSubmit,
  });

  // Get game context to sync timer
  const gameContext = useGameContext();

  // Sync the timer with the game context so header can display it
  useEffect(() => {
    if (gameContext && state.timer !== undefined && gameContext.updateTimer) {
      // Update the game context timer with the mixing game timer
      gameContext.updateTimer(state.timer);
    }
  }, [state.timer, gameContext]);

  // Don't render if no challenge loaded
  if (!state.currentChallenge) {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-[378px] mx-auto">
        <div className="text-center">
          <div className="font-hartone text-xl uppercase tracking-wide mb-4">
            Loading challenge...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-[55px] w-full max-w-[378px] mx-auto">
      {/* Target and Your Color Display */}
      <div className="flex flex-col items-center gap-[17px] w-full">
        {/* Color Display */}
        <div
          className="relative w-full h-[88px] border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
          style={{ backgroundColor: targetColorHex }}
        >
          {!targetColor && (
            <div className="absolute inset-0 bg-[#f0f0f0] flex items-center justify-center rounded-[12px]">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                <span className="font-sintony text-sm text-black">
                  Loading...
                </span>
              </div>
            </div>
          )}
          {/* Right half showing mixed color */}
          {targetColor && (
            <div
              className="absolute right-0 top-0 w-1/2 h-full border-l border-black"
              style={{ backgroundColor: mixedColorHex }}
            />
          )}
        </div>

        {/* Labels */}
        <div className="flex justify-between items-center w-[287px]">
          <div className="px-1">
            <div className="text-[14px] font-sintony font-bold leading-[16px] tracking-[-1%] text-black">
              Target colour
            </div>
          </div>
          <div className="text-[14px] font-sintony font-bold leading-[16px] tracking-[-1%] text-black">
            Your colour
          </div>
        </div>
      </div>

      {/* Color Sliders */}
      <div className="flex flex-col gap-[24px] w-full">
        {/* Primary Color 1 */}
        <ColorSlider
          value={state.colorPercentages.color1.percentage}
          onChange={(value) => handleSliderChange("color1", value)}
          colorHex={getColorHex(
            state.colorPercentages.color1.color.r,
            state.colorPercentages.color1.color.g,
            state.colorPercentages.color1.color.b,
          )}
          disabled={disabled}
        />

        {/* Primary Color 2 */}
        <ColorSlider
          value={state.colorPercentages.color2.percentage}
          onChange={(value) => handleSliderChange("color2", value)}
          colorHex={getColorHex(
            state.colorPercentages.color2.color.r,
            state.colorPercentages.color2.color.g,
            state.colorPercentages.color2.color.b,
          )}
          disabled={disabled}
        />

        {/* Distractor Color */}
        <ColorSlider
          value={state.colorPercentages.distractor.percentage}
          onChange={(value) => handleSliderChange("distractor", value)}
          colorHex={getColorHex(
            state.colorPercentages.distractor.color.r,
            state.colorPercentages.distractor.color.g,
            state.colorPercentages.distractor.color.b,
          )}
          disabled={disabled}
        />

        {/* White Shading */}
        <ColorSlider
          value={state.colorPercentages.white}
          onChange={(value) => handleShadingChange("white", value)}
          colorHex="#FFFFFF"
          disabled={disabled}
        />

        {/* Black Shading */}
        <ColorSlider
          value={state.colorPercentages.black}
          onChange={(value) => handleShadingChange("black", value)}
          colorHex="#000000"
          disabled={disabled}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={async () => {
          const attempt = await handleMix();
          console.log("Mix submitted:", attempt);
          if (attempt && onScoreSubmit) {
            const timeTaken = state.startTime
              ? Math.floor((Date.now() - state.startTime) / 1000)
              : 0;
            onScoreSubmit(attempt.matchPercentage, timeTaken);
          }
        }}
        disabled={disabled || state.showResults}
        className={cn(
          "w-full h-[51px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]",
          "text-[30px] font-hartone leading-[33px] tracking-[7.5%] text-black",
          "flex items-center justify-center",
          "transition-all duration-150",
          "hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px]",
          "active:shadow-none active:translate-y-[4px]",
          disabled &&
            "opacity-50 cursor-not-allowed hover:shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0",
        )}
      >
        SUBMIT
      </button>
    </div>
  );
};
