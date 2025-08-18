"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useMiniKitUser } from "@/lib/useMiniKitUser";

interface JoinRoomFormProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  onJoinRoom: () => void;
  onBack: () => void;
}

export const JoinRoomForm = ({
  playerName,
  setPlayerName,
  roomId,
  setRoomId,
  onJoinRoom,
  onBack,
}: JoinRoomFormProps) => {
  const { getUserName } = useMiniKitUser();

  useEffect(() => {
    if (!playerName.trim()) {
      const defaultName = getUserName();
      if (defaultName && defaultName !== "Anonymous") {
        setPlayerName(defaultName);
      }
    }
  }, [playerName, setPlayerName, getUserName]);

  return (
    <div className="grow flex flex-col items-center bg-[#FFFFE7] pb-8 gap-6 font-mono w-full">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-hartone  font-extralight text-[39px] leading-[42px] text-black mb-2">
          JOIN ROOM
        </h1>
        <p className="font-sintony text-[14px] leading-[16px] text-black">
          Join your friends room
        </p>
      </div>

      {/* Form inputs */}
      <div className="space-y-4 w-full">
        <Input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full h-[52px] bg-white border border-black rounded-[12px] px-4 font-sintony text-[16px] text-black placeholder-gray-500 focus:ring-2 focus:ring-black"
        />

        <Input
          type="text"
          placeholder="Enter room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          className="w-full h-[52px] bg-white border border-black rounded-[12px] px-4 font-sintony text-[16px] text-black placeholder-gray-500 uppercase focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Action buttons */}
      <div className="space-y-3 grow w-full flex flex-col items-center justify-end">
        <button
          onClick={onJoinRoom}
          disabled={!playerName.trim() || !roomId.trim()}
          className={cn(
            "w-full h-14 sm:h-16 lg:h-[68px] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-lg sm:text-xl lg:text-[34px] leading-[37px] tracking-[2.55px] transition-all duration-150",
            playerName.trim() && roomId.trim()
              ? "bg-[#FFE254] text-black cursor-pointer hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed",
          )}
        >
          JOIN
        </button>

        <button
          onClick={onBack}
          className="w-full h-[52px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
        >
          BACK
        </button>
      </div>
    </div>
  );
};
