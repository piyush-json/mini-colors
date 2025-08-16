import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import Webcam from "react-webcam";
import Image from "next/image";
import { useGameContextRequired } from "@/lib/GameContext";
import { cn } from "@/lib/utils";
interface FindColorGameProps {
  targetColor?: string | null;
  onScoreSubmit: (
    score: number,
    timeTaken: number,
    actualTargetColor?: string,
  ) => void;
  isMultiplayer?: boolean;
  className?: string;
  timeLimit?: number; // Time limit in seconds
}

export const FindColorGame = ({
  targetColor,
  onScoreSubmit,
  isMultiplayer = false,
  className = "",
  timeLimit,
}: FindColorGameProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  const {
    gameStage,
    capturedImage,
    webcamReady,
    cameraError,
    isLoading,
    gameFinished,
    webcamRef,
    canvasRef,
    initializeGame,
    openCamera,
    captureColorPhoto,
    retakePhoto,
    submitResult,
    handleWebcamReady,
    handleWebcamError,
  } = useGameContextRequired();

  useEffect(() => {
    if (targetColor) {
      initializeGame(targetColor, isMultiplayer);
      if (timeLimit) {
        setTimeRemaining(timeLimit);
        setGameStartTime(Date.now());
      }
    }
  }, [targetColor, isMultiplayer, timeLimit, initializeGame]);

  // Timer countdown effect
  useEffect(() => {
    if (
      timeLimit &&
      timeRemaining !== null &&
      timeRemaining > 0 &&
      !gameFinished
    ) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up - auto submit with 0 score
            const timeTaken = gameStartTime
              ? Math.floor((Date.now() - gameStartTime) / 1000)
              : timeLimit;
            onScoreSubmit(0, timeTaken, targetColor || undefined);
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
    gameFinished,
    onScoreSubmit,
    targetColor,
    gameStartTime,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("space-y-6 w-full mx-auto", className)}>
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

      {/* Target Color Display */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-full h-[88px] border border-black rounded-[12px] flex items-center justify-center"
          style={{
            backgroundColor: targetColor || "#f0f0f0",
            boxShadow: "0px 6px 0px 0px rgba(0, 0, 0, 1)",
          }}
        >
          {!targetColor && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              <span className="font-sintony text-sm text-black">
                Loading...
              </span>
            </div>
          )}
        </div>
        <p className="font-sintony text-sm font-bold text-black">
          Target colour
        </p>
      </div>

      {/* Game Stage - Initial */}
      {gameStage === "initial" && (
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-full h-[360px] bg-[#FFFFFF] border border-black rounded-[9px] flex flex-col items-center justify-center gap-4 cursor-pointer"
            style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
            onClick={openCamera}
          >
            <div className="w-[84px] h-[84px] border border-black rounded-full flex items-center justify-center">
              <div className="w-[46px] h-[47px] bg-white flex items-center justify-center">
                <Camera className="w-10 h-9 text-black" />
              </div>
            </div>
            <p className="font-sintony text-sm font-normal text-black text-center">
              Tap to open up the camera
            </p>
          </div>

          <button
            className={cn(
              "w-full h-[51px] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal",
              "bg-[#CECCC3] text-[#847E7E] cursor-not-allowed",
            )}
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
          >
            FOUND IT
          </button>
        </div>
      )}

      {/* Game Stage - Camera */}
      {gameStage === "camera" && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full h-[360px] border border-black rounded-[9px] overflow-hidden">
            {cameraError ? (
              <div className="w-full h-full bg-red-100 border border-red-300 rounded flex items-center justify-center p-4">
                <p className="text-red-600 text-sm text-center">
                  {cameraError}
                </p>
              </div>
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: { ideal: "environment" },
                    width: 640,
                    height: 480,
                  }}
                  onUserMedia={handleWebcamReady}
                  onUserMediaError={handleWebcamError}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Red circle crosshair overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[54px] h-[54px] border-4 border-[#EF4E4E] rounded-full"></div>
                </div>
              </>
            )}
          </div>

          <div
            className={cn(
              "w-full h-[51px] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal",
              {
                "bg-[#FFE254] text-black cursor-pointer":
                  webcamReady && !isLoading,
                "bg-[#CECCC3] text-[#847E7E] cursor-not-allowed":
                  !webcamReady || isLoading,
              },
            )}
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
            onClick={isLoading || !webcamReady ? undefined : captureColorPhoto}
          >
            {isLoading ? "CAPTURING..." : "FOUND IT"}
          </div>
        </div>
      )}

      {/* Game Stage - Captured */}
      {gameStage === "captured" && capturedImage && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full h-[360px] border border-black rounded-[9px] overflow-hidden">
            <Image
              src={capturedImage}
              alt="Captured"
              fill
              className="object-cover"
            />
            {/* Retake button positioned over the image */}
            <div className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2">
              <div
                className="w-[87px] h-[29px] bg-white border border-black rounded-[39px] flex items-center justify-center cursor-pointer font-hartone text-[16px] font-normal text-black"
                style={{
                  boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 1)",
                  letterSpacing: "7.5%",
                }}
                onClick={retakePhoto}
              >
                Retake
              </div>
            </div>
          </div>

          <button
            className="w-full h-[51px] bg-[#FFE254] border border-black rounded-[39px] flex items-center justify-center cursor-pointer font-hartone text-[30px] font-normal text-black"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
            onClick={() => {
              console.log("Submitting result...");
              submitResult((score: number, timeTaken: number) => {
                const actualTimeTaken = gameStartTime
                  ? Math.floor((Date.now() - gameStartTime) / 1000)
                  : timeTaken;
                onScoreSubmit(score, actualTimeTaken, targetColor || undefined);
              });
            }}
          >
            SUBMIT
          </button>
        </div>
      )}
    </div>
  );
};
