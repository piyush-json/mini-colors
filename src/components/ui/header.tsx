"use client";

import { Brush, Fire } from "@/components/icons";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BackButton = () => {
  return (
    <div
      className="w-[41px] h-[41px] bg-white border border-black rounded-[5px] flex items-center justify-center"
      style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
    >
      <ChevronLeft className="w-6 h-6 text-black" />
    </div>
  );
};

const Timer = () => {
  return (
    <div
      className="w-[41px] h-[41px] bg-white border border-black rounded-[5px] flex items-center justify-center"
      style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
    >
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
    </div>
  );
};

const UserProfile = () => {
  return (
    <div className="bg-transparent border border-black rounded-[7px] px-1 h-[41px] flex gap-2 items-center">
      <div className="w-[31px] h-[31px] bg-[#EEBDBD] border border-black rounded-[3px] flex items-center justify-center">
        {/* Profile image placeholder */}
      </div>
      <span className="text-[12px] leading-4 text-center text-black font-normal font-sintony">
        0x8h...9e3
      </span>
    </div>
  );
};

interface HeaderProps {
  showGameIcon?: boolean;
  showBackButton?: boolean;
}

export const Header = ({
  showGameIcon = false,
  showBackButton = false,
}: HeaderProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Determine what left icon to show based on props and current page
  const getLeftIcon = () => {
    if (showBackButton || (!isHomePage && !showGameIcon)) {
      return (
        <Link href="/" className="flex items-center">
          <BackButton />
        </Link>
      );
    }

    if (showGameIcon) {
      return (
        <div
          className="w-[41px] h-[41px] bg-white border border-black rounded-[5px] flex items-center justify-center"
          style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
        >
          {/* <Brush className="w-6 h-6" /> */}
        </div>
      );
    }

    // Default for home page
    return <Fire />;
  };

  return (
    <div className="flex justify-between items-center border-b-2 border-black pb-5 pt-7 w-full">
      {getLeftIcon()}
      <div className="flex items-center gap-1">
        <Timer />
        <UserProfile />
      </div>
    </div>
  );
};

export default Header;
