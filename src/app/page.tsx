"use client";

import { Brush, Fire } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import Link from "next/link";

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
  return (
    <>
      <Title />
      <div className="flex flex-col items-center w-full grow justify-center relative">
        <div className="translate-y-[50%] bg-[#F6881D] border border-black rounded-[4px] pl-5 pr-3 py-2 flex items-center gap-2 relative z-10">
          <div className="absolute -bottom-1 -left-4 ">
            <Fire />
          </div>
          <span className="text-[20px] leading-[22px] text-[#FFFFE7] font-hartone">
            5 Days Streak
          </span>
        </div>
        <div
          className="w-full h-[320px] border border-black rounded-[30px]  relative"
          style={{
            backgroundColor: "#A6C598",
            boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)",
          }}
        >
          <div className="absolute right-0 translate-x-[5%] top-2">
            <Brush />
          </div>
        </div>
        <p className="text-[14px] leading-4 text-black font-normal font-sintony pt-5">
          the colour refreshes in 12h:03m:44s
        </p>
      </div>

      <div className="space-y-3 w-full">
        {/* Play Button */}
        <Link href="/game" className="block">
          <Button
            size="lg"
            className="w-full h-[68px] rounded-[39px] border border-black text-black font-normal text-[30px] sm:text-[34px] leading-[33px] sm:leading-[37px] tracking-[2.25px] sm:tracking-[2.55px]"
            style={{
              backgroundColor: "#FFE254",
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
            }}
          >
            PLAY
          </Button>
        </Link>

        <div className="flex gap-3">
          <Link href="/party" className="flex-1">
            <div
              className="w-full h-[52px] bg-white border border-black rounded-[39px] flex items-center justify-center gap-2 px-4"
              style={{ boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              <div className="w-6 h-8 relative">
                <svg width="24" height="35" viewBox="0 0 24 35" fill="none">
                  <path d="M12 3L8 32L16 32L12 3Z" fill="#CC1B65" />
                  <path d="M11 0L13 32L11 0Z" fill="#B81A6B" />
                  <circle
                    cx="10"
                    cy="5"
                    r="2"
                    fill="#ECC32E"
                    stroke="#272425"
                  />
                  <circle cx="6" cy="8" r="1" fill="#E8CE47" />
                  <circle cx="12" cy="0" r="1" fill="#E8CE47" />
                  <circle cx="16" cy="9" r="1" fill="#E8CE47" />
                </svg>
              </div>
              <span className="text-[16px] sm:text-[18px] leading-[18px] sm:leading-[20px] tracking-[1.2px] sm:tracking-[1.35px] text-black font-normal font-hartone">
                PARTY mODE
              </span>
            </div>
          </Link>

          {/* Leaderboard */}
          <Link href="/leaderboard" className="flex-1">
            <div
              className="w-full h-[52px] bg-white border border-black rounded-[39px] flex items-center justify-center gap-2 px-4"
              style={{ boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              <div className="w-9 h-8 flex items-end">
                <div
                  className="w-3 h-5 border border-black rounded-t-sm"
                  style={{ backgroundColor: "#FABABA" }}
                ></div>
                <div
                  className="w-3 h-8 border border-black rounded-t-sm"
                  style={{ backgroundColor: "#C1FABA" }}
                ></div>
                <div
                  className="w-3 h-4 border border-black rounded-t-sm"
                  style={{ backgroundColor: "#BACCFA" }}
                ></div>
              </div>
              <span className="text-[16px] sm:text-[18px] leading-[18px] sm:leading-[20px] tracking-[1.2px] sm:tracking-[1.35px] text-black font-normal font-hartone">
                LEADERBOARD
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
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
