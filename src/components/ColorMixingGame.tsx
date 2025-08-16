"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useColorMixingGame } from "@/lib/useColorMixingGame";
import { useGameContext } from "@/lib/GameContext";

interface ColorMixingGameProps {
  targetColor?: string | null;
  onScoreSubmit?: (
    score: number,
    timeTaken: number,
    actualTargetColor?: string,
    actualCapturedColor?: string,
  ) => void;
  isMultiplayer?: boolean;
  disabled?: boolean;
  mode?: "daily" | "practice";
  timeLimit?: number; // Time limit in seconds
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
  targetColor,
  onScoreSubmit,
  isMultiplayer = false,
  disabled = false,
  mode = "practice",
  timeLimit,
}: ColorMixingGameProps = {}) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  const {
    state,
    targetColorHex,
    mixedColorHex,
    handleSliderChange,
    handleShadingChange,
    handleMix,
    getColorHex,
    initializeGame,
  } = useColorMixingGame({
    isMultiplayer,
    targetColor: targetColor || undefined,
    onScoreSubmit,
    mode,
  });

  const gameContext = useGameContext();

  useEffect(() => {
    if (targetColor) {
      initializeGame(targetColor, isMultiplayer);
      if (timeLimit) {
        setTimeRemaining(timeLimit);
        setGameStartTime(Date.now());
      }
    }
  }, [targetColor, isMultiplayer, timeLimit, initializeGame]);

  useEffect(() => {
    if (gameContext && state.timer !== undefined && gameContext.updateTimer) {
      gameContext.updateTimer(state.timer);
    }
  }, [state.timer, gameContext]);

  // Timer countdown effect
  useEffect(() => {
    if (
      timeLimit &&
      timeRemaining !== null &&
      timeRemaining > 0 &&
      !state.showResults
    ) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up - auto submit with current mix
            const timeTaken = gameStartTime
              ? Math.floor((Date.now() - gameStartTime) / 1000)
              : timeLimit;
            handleMix().then((attempt) => {
              if (attempt && onScoreSubmit) {
                onScoreSubmit(
                  attempt.matchPercentage,
                  timeTaken,
                  targetColorHex || targetColor || undefined,
                  mixedColorHex,
                );
              }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [
    timeLimit,
    timeRemaining,
    state.showResults,
    onScoreSubmit,
    targetColor,
    targetColorHex,
    mixedColorHex,
    gameStartTime,
    handleMix,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (mode === "daily" && !targetColor) {
    return (
      <div className="flex flex-col items-center gap-[55px] w-full  mx-auto">
        {/* Timer Display - Loading State */}
        {timeLimit && (
          <div className="flex justify-center">
            <div className="px-4 py-2 border-2 border-black rounded-lg font-hartone text-[18px] bg-gray-200 text-gray-500">
              Time: {formatTime(timeLimit)}
            </div>
          </div>
        )}

        {/* Target Color Display with Loading */}
        <div className="flex flex-col items-center gap-[17px] w-full">
          <div className="relative w-full h-[68px] border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center bg-[#f0f0f0]">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              <span className="font-sintony text-sm text-black">
                Loading...
              </span>
            </div>
          </div>
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

        {/* Disabled sliders during loading */}
        <div className="flex flex-col gap-[24px] w-full opacity-50">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center w-full gap-[30px]">
              <div className="relative w-[318px] h-[48px]">
                <div className="absolute top-[5px] w-[318px] h-[38px] bg-gray-200 border border-black rounded-[21px]" />
                <div className="absolute top-0 w-[48px] h-[48px] rounded-full border-[4px] border-black bg-gray-300" />
              </div>
              <div className="text-[22px] font-hartone leading-[16px] tracking-[7.5%] text-black text-right min-w-[40px]">
                0%
              </div>
            </div>
          ))}
        </div>

        {/* Disabled submit button */}
        <button
          disabled
          className="w-full h-[51px] bg-gray-300 border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] text-[30px] font-hartone leading-[33px] tracking-[7.5%] text-gray-500 flex items-center justify-center opacity-50 cursor-not-allowed"
        >
          SUBMIT
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-12 w-full  mx-auto">
      {/* Timer Display */}
      {timeLimit && timeRemaining !== null && (
        <div className="flex justify-center">
          <div
            className={cn(
              "px-4 py-2 border-2 border-black rounded-lg font-hartone text-[18px]",
              timeRemaining <= 10
                ? "bg-red-100 text-red-600"
                : "bg-white text-black",
            )}
          >
            Time: {formatTime(timeRemaining)}
          </div>
        </div>
      )}

      {/* Target and Your Color Display */}
      <div className="flex flex-col items-center gap-[17px] w-full">
        {/* Color Display */}
        <div
          className="relative w-full h-[68px] border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
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
      <div className="flex flex-col gap-3 w-full">
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
            const timeTaken = gameStartTime
              ? Math.floor((Date.now() - gameStartTime) / 1000)
              : state.startTime
                ? Math.floor((Date.now() - state.startTime) / 1000)
                : 0;
            onScoreSubmit(
              attempt.matchPercentage,
              timeTaken,
              targetColorHex || targetColor || undefined,
              mixedColorHex,
            );
          }
        }}
        disabled={
          disabled ||
          state.showResults ||
          (timeRemaining !== null && timeRemaining <= 0)
        }
        className={cn(
          "w-full h-[51px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]",
          "text-[30px] font-hartone leading-[33px] tracking-[7.5%] text-black",
          "flex items-center justify-center",
          "transition-all duration-150",
          "hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px]",
          "active:shadow-none active:translate-y-[4px]",
          (disabled ||
            state.showResults ||
            (timeRemaining !== null && timeRemaining <= 0)) &&
            "opacity-50 cursor-not-allowed hover:shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0",
        )}
      >
        SUBMIT
      </button>
    </div>
  );
};
