"use client";

import { useMiniKitUser } from "@/lib/useMiniKitUser";
import { Header } from "@/components/header";
import { TokenLiveSheet } from "@/components/TokenLiveSheet";
import { useState } from "react";
import { Coins } from "lucide-react";
import { usePathname } from "next/navigation";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { getSafeAreaHeight } = useMiniKitUser();
  const minHeight = getSafeAreaHeight();
  const [isTokenLiveSheetOpen, setIsTokenLiveSheetOpen] = useState(true);
  const pathname = usePathname();
  return (
    <div
      className="min-h-full px-8 font-sintony w-screen flex flex-col items-center gap-8 relative"
      style={{
        backgroundColor: "#FFFFE7",
        minHeight: minHeight,
      }}
    >
      <Header />
      {children}

      {/* Floating Token Button */}
      {!isTokenLiveSheetOpen && pathname == "/" && (
        <button
          onClick={() => setIsTokenLiveSheetOpen(true)}
          className="fixed right-4 bottom-0 transform -translate-y-1/2 z-50 w-14 h-14 bg-[#FFE254] hover:bg-[#E6CC4A] border-2 border-black rounded-full flex items-center justify-center transition-colors shadow-lg"
          style={{
            boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
          }}
        >
          <Coins className="h-6 w-6 text-black" />
        </button>
      )}

      <TokenLiveSheet
        isOpen={isTokenLiveSheetOpen}
        onClose={() => {
          setIsTokenLiveSheetOpen(false);
        }}
      />
    </div>
  );
}
