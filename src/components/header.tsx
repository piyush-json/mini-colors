"use client";

import { Fire } from "@/components/icons";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameContext } from "@/lib/GameContext";

export const BackButton = () => {
  return (
    <div
      className="w-[41px] h-[41px] bg-white border border-black rounded-[5px] flex items-center justify-center"
      style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
    >
      <ChevronLeft className="w-6 h-6 text-black" />
    </div>
  );
};

export const Timer = () => {
  const gameContext = useGameContext();
  const timer = gameContext?.timer || 0;

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  console.log("Timer value:", timer);
  return (
    <div
      className="w-[41px] h-[41px] bg-white border border-black rounded-[5px] flex items-center justify-center"
      style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
    >
      {timer > 0 ? (
        <span className="font-sintony text-xs font-bold text-black">
          {formatTime(timer)}
        </span>
      ) : (
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          className="w-[25px] h-[25px]"
        >
          <circle
            cx="12.5"
            cy="12.5"
            r="11.82"
            fill="#FFF2A9"
            stroke="#433930"
            strokeWidth="1"
          />
          <path d="M12.22 7.02L12.74 12.69L12.22 7.02Z" fill="#433930" />
          <path d="M11.35 5.83L13.65 7.72L11.35 5.83Z" fill="#433930" />
          <path d="M12.65 13.47L17.45 19.12L12.65 13.47Z" fill="#433930" />
          <circle cx="13.45" cy="13.96" r="1.05" fill="#EBCB42" />
        </svg>
      )}
    </div>
  );
};

export const UserProfile = () => {
  return (
    <div className="bg-transparent border border-black rounded-[7px] px-1  h-[41px] flex gap-2 items-center">
      <div className="w-[31px] h-[31px] bg-[#EEBDBD] border border-black rounded-[3px] flex items-center justify-center">
        {/* Profile image placeholder */}
      </div>
      <span className="text-[12px] leading-4 text-center text-black font-normal font-sintony">
        0x8h...9e3
      </span>
    </div>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div className="flex justify-between items-center border-b-2 border-black pb-5 pt-7 w-full">
      {isHomePage ? (
        <Fire />
      ) : (
        <Link href="/" className="flex items-center">
          <BackButton />
        </Link>
      )}
      <div className="flex items-center gap-1">
        <Timer />
        <UserProfile />
      </div>
    </div>
  );
};
