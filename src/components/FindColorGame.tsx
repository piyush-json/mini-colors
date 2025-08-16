import { useEffect } from "react";
import { Camera } from "lucide-react";
import Webcam from "react-webcam";
import Image from "next/image";
import { useGameContextRequired } from "@/lib/GameContext";
import { cn } from "@/lib/utils";
interface FindColorGameProps {
  targetColor: string;
  onScoreSubmit: (score: number, timeTaken: number) => void;
  isMultiplayer?: boolean;
  className?: string;
}

export const FindColorGame = ({
  targetColor,
  onScoreSubmit,
  isMultiplayer = false,
  className = "",
}: FindColorGameProps) => {
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
    initializeGame(targetColor, isMultiplayer);
  }, [targetColor, isMultiplayer, initializeGame]);

  return (
    <div className={cn("space-y-6 w-full mx-auto", className)}>
      {/* Target Color Display */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-[373px] h-[88px] border border-black rounded-[12px]"
          style={{
            backgroundColor: targetColor,
            boxShadow: "0px 6px 0px 0px rgba(0, 0, 0, 1)",
          }}
        />
        <p className="font-sintony text-sm font-bold text-black">
          Target colour
        </p>
      </div>

      {/* Game Stage - Initial */}
      {gameStage === "initial" && (
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-[373px] h-[360px] bg-[#FFFFFF] border border-black rounded-[9px] flex flex-col items-center justify-center gap-4 cursor-pointer"
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

          <div
            className={cn(
              "w-[373px] h-[51px] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal",
              "bg-[#CECCC3] text-[#847E7E] cursor-not-allowed",
            )}
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
          >
            FOUND IT
          </div>
        </div>
      )}

      {/* Game Stage - Camera */}
      {gameStage === "camera" && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-[373px] h-[360px] border border-black rounded-[9px] overflow-hidden">
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
              "w-[373px] h-[51px] border border-black rounded-[39px] flex items-center justify-center font-hartone text-[30px] font-normal",
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
          <div className="relative w-[373px] h-[360px] border border-black rounded-[9px] overflow-hidden">
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

          <div
            className="w-[373px] h-[51px] bg-[#FFE254] border border-black rounded-[39px] flex items-center justify-center cursor-pointer font-hartone text-[30px] font-normal text-black"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
            onClick={() => {
              console.log("Submitting result...");
              submitResult(onScoreSubmit);
            }}
          >
            SUBMIT
          </div>
        </div>
      )}
    </div>
  );
};
