"use client";

import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { useMiniKitUser } from "@/lib/useMiniKitUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TimerDisplay } from "@/lib/timer-utils";

interface CreateRoomFormProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  maxPlayers: number;
  setMaxPlayers: (count: number) => void;
  maxRounds: number;
  setMaxRounds: (rounds: number) => void;
  guessTime: number;
  setGuessTime: (time: number) => void;
  onCreateRoom: () => void;
  onBack: () => void;
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
}

export const CreateRoomForm = ({
  playerName,
  setPlayerName,
  maxPlayers,
  setMaxPlayers,
  maxRounds,
  setMaxRounds,
  guessTime,
  setGuessTime,
  onCreateRoom,
  onBack,
  showQRCode,
  setShowQRCode,
}: CreateRoomFormProps) => {
  const { getUserName } = useMiniKitUser();

  useEffect(() => {
    // Set default name if available and playerName is empty
    if (!playerName.trim()) {
      const defaultName = getUserName();
      if (defaultName && defaultName !== "Anonymous") {
        setPlayerName(defaultName);
      }
    }
  }, [playerName, setPlayerName, getUserName]);

  return (
    <div className="grow pb-8 bg-[#FFFFE7] font-mono w-full flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center ">
        <h1 className="font-hartone text-[39px] leading-[42px] font-extralight text-black ">
          CREATE ROOM
        </h1>
        <p className="font-sintony text-[14px] leading-[16px] text-black">
          Create room with your friends
        </p>
      </div>

      {/* Game settings */}
      <div className="bg-white border-2 border-black rounded-[21px] w-full p-8 gap-8 flex flex-col items-center">
        <div className="space-y-6 w-full">
          {/* Rounds */}
          <div className="w-full">
            <label className="font-hartone text-[18px] leading-[42px] text-black">
              Rounds
            </label>
            <Select
              value={maxRounds.toString()}
              onValueChange={(value) => setMaxRounds(Number(value))}
            >
              <SelectTrigger className="w-full h-[40px] bg-white border border-black rounded-[7px] font-sintony text-[16px] text-black focus:ring-2 focus:ring-black">
                <SelectValue placeholder="Select rounds" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-black">
                <SelectItem
                  value="1"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  1 Round
                </SelectItem>
                <SelectItem
                  value="3"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  3 Rounds
                </SelectItem>
                <SelectItem
                  value="5"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  5 Rounds
                </SelectItem>
                <SelectItem
                  value="10"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  10 Rounds
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Guess Time */}
          <div className="w-full">
            <label className="font-hartone text-[18px] leading-[42px] text-black">
              GUESS TIME
            </label>
            <Select
              value={guessTime.toString()}
              onValueChange={(value) => setGuessTime(Number(value))}
            >
              <SelectTrigger className="w-full h-[40px] bg-white border border-black rounded-[7px] font-sintony text-[16px] text-black focus:ring-2 focus:ring-black">
                <SelectValue placeholder="Select time limit" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-black">
                <SelectItem
                  value="15"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  15 seconds
                </SelectItem>
                <SelectItem
                  value="30"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  30 seconds
                </SelectItem>
                <SelectItem
                  value="60"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  60 seconds
                </SelectItem>
                <SelectItem
                  value="120"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  2 minutes
                </SelectItem>
                <SelectItem
                  value="300"
                  className="font-sintony text-[16px] text-black hover:bg-[#FFFFE7]"
                >
                  5 minutes
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* No of Players - Now an Input */}
          <div className="w-full">
            <label className="font-hartone text-[18px] leading-[42px] text-black">
              NO OF PLAYERS
            </label>
            <Input
              type="number"
              min={2}
              max={12}
              value={maxPlayers}
              onChange={(e) =>
                setMaxPlayers(Math.min(12, Math.max(2, Number(e.target.value))))
              }
              className="w-full h-[40px] bg-white border border-black rounded-[7px] px-3 font-sintony text-[16px] text-black focus:ring-2 focus:ring-black"
              placeholder="Enter number of players (2-12)"
            />
          </div>
        </div>

        {/* Invite button */}
        {/* <button
        onClick={() => setShowQRCode(!showQRCode)}
        className="bg-black text-[#FFFFE7] font-hartone text-[16px] leading-[16px] tracking-[1.2px] px-[35px] py-[10px] rounded-[8px] hover:bg-gray-800 transition-colors w-full"
      >
        {showQRCode ? "HIDE QR" : "INVITE"}
      </button>

      {showQRCode && (
        <div className="flex justify-center mt-6">
          <div className="bg-white p-4 border border-black rounded-lg">
            <QRCodeSVG
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}/party`
                  : "https://example.com/party"
              }
              size={128}
            />
            <p className="text-center mt-2 font-sintony text-[12px] text-gray-600">
              Scan to join party mode
            </p>
          </div>
        </div>
      )} */}
      </div>

      {/* Player name input */}
      <Input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="w-full h-[52px] bg-white border border-black rounded-[12px] px-4 font-sintony text-[16px] text-black placeholder-gray-500 focus:ring-2 focus:ring-black"
      />

      {/* Action buttons */}
      <div className="space-y-3 w-full grow flex flex-col items-center justify-end">
        <button
          onClick={onCreateRoom}
          disabled={!playerName.trim()}
          className={cn(
            "w-full h-14 sm:h-16 lg:h-[68px] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone text-lg sm:text-xl lg:text-[34px] leading-[37px] tracking-[2.55px] transition-all duration-150",
            playerName.trim()
              ? "bg-[#FFE254] text-black cursor-pointer hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed",
          )}
        >
          PLAY
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
