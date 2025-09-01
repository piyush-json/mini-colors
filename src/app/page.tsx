"use client";

import {
  Brush,
  Fire,
  LeaderBoard,
  PartyIcon,
  Practice,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { useDailyColor, useGameResults } from "@/lib/GameResultsContext";
import { useUserStreak } from "@/lib/useUserStreak";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Title = () => {
  return (
    <div className="text-center -rotate-2 pt-4 w-full flex flex-col items-center ">
      <h1 className="text-[52px] sm:text-[62.89px] leading-[80%]  text-center text-[#FFE254]  font-hartone [-webkit-text-stroke:2px_black]">
        Can you find
      </h1>
      <h1 className="text-[52px] sm:text-[62.89px] leading-[80%]  text-center text-[#FFE254]  font-hartone [-webkit-text-stroke:2px_black]">
        this colour?
      </h1>
    </div>
  );
};

export default function HomePage() {
  const { dailyColor, isLoadingDailyColor } = useDailyColor();
  const { setGameMode } = useGameResults();
  const { streak, isLoading: isLoadingStreak } = useUserStreak();
  const router = useRouter();

  const handlePlayClick = () => {
    setGameMode("daily");
    router.push("/game");
  };

  const handlePracticeClick = () => {
    setGameMode("practice");
    router.push("/game");
  };

  // Calculate next GMT midnight
  const now = new Date();
  const nextRefresh = new Date();
  nextRefresh.setUTCDate(nextRefresh.getUTCDate() + 1);
  nextRefresh.setUTCHours(0, 0, 0, 0);

  const diff = nextRefresh.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const refreshTime = `${hours.toString().padStart(2, "0")}h:${minutes.toString().padStart(2, "0")}m`;

  return (
    <>
      <Title />
      <div className="flex flex-col items-center w-full grow justify-center relative ">
        <div className="translate-y-[50%] bg-[#F6881D] border border-black rounded-[4px] pl-5 pr-3 py-2 flex items-center gap-2 relative z-10">
          <div className="absolute -bottom-1 -left-4 ">
            <Fire />
          </div>
          <span className="text-[20px] leading-[22px] text-[#FFFFE7] font-hartone">
            {isLoadingStreak
              ? "Loading..."
              : streak > 0
                ? `${streak} Day${streak === 1 ? "" : "s"} Streak`
                : "Start Your Streak!"}
          </span>
        </div>
        <div
          className="w-full h-[220px] border border-black rounded-[30px]  relative"
          style={{
            backgroundColor: isLoadingDailyColor
              ? "#f0f0f0"
              : dailyColor || "#A6C598",
            boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)",
          }}
        >
          {isLoadingDailyColor && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          )}
          <div className="absolute right-0 translate-x-[5%] top-5">
            <Brush />
          </div>
        </div>
        <p className="text-[14px] leading-4 text-black font-normal font-sintony pt-2">
          the colour refreshes in {refreshTime}
        </p>
      </div>

      <div className="space-y-3 w-full">
        {/* Play Button */}
        <Button
          size="lg"
          className="w-full h-[68px] rounded-[39px] border border-black text-black font-normal text-[34px] leading-[33px] sm:leading-[37px] tracking-[2.25px] sm:tracking-[2.55px]"
          style={{
            backgroundColor: "#FFE254",
            boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
          }}
          onClick={handlePlayClick}
        >
          PLAY
        </Button>

        <div className="flex gap-3">
          <Link
            href="/party"
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div
              className="w-full h-[52px] bg-white border border-black rounded-[39px] flex items-center justify-center gap-2 px-4"
              style={{ boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              <PartyIcon />
            </div>
            <span className="text-[12px] leading-[16px] text-black font-sintony">
              Party
            </span>
          </Link>

          <Link
            href="/leaderboard"
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div
              className="w-full h-[52px] bg-white border border-black rounded-[39px] flex items-center justify-center gap-2 px-4"
              style={{ boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              <LeaderBoard />
            </div>
            <span className="text-[12px] leading-[16px] text-black font-sintony">
              Leaderboard
            </span>
          </Link>
          <div className="flex-1 flex flex-col items-center gap-2">
            <button
              className="w-full flex-1 h-[52px] bg-white border border-black rounded-[39px] flex items-center justify-center gap-2 px-4"
              style={{ boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)" }}
              onClick={handlePracticeClick}
            >
              <Practice />
            </button>
            <span className="text-[12px] leading-[16px] text-black font-sintony">
              Practice
            </span>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-4"></div>
    </>
  );
}

// <div className="flex flex-col items-center gap-4 mb-6 px-8">
//   <div
//     className="w-full h-[88px] border border-black rounded-xl relative"
//     style={{
//       backgroundColor: "#A6C598",
//       boxShadow: "0px 6px 0px 0px rgba(0, 0, 0, 1)",
//     }}
//   >
//     {/* Split color display */}
//     <div
//       className="absolute left-0 top-0 w-1/2 h-full rounded-l-xl"
//       style={{ backgroundColor: "#BFF4A7" }}
//     ></div>
//     <div
//       className="absolute right-0 top-0 w-1/2 h-full rounded-r-xl"
//       style={{ backgroundColor: "#A6C598" }}
//     ></div>
//   </div>
//   <p className="text-[14px] leading-4 font-bold text-center text-black font-sintony">
//     Target colour
//   </p>
// </div>
