"use client";

import { useMiniKitUser } from "@/lib/useMiniKitUser";
import { Header } from "@/components/header";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { getSafeAreaHeight } = useMiniKitUser();
  const minHeight = getSafeAreaHeight();

  return (
    <div
      className="min-h-full px-8 font-sintony w-screen flex flex-col items-center gap-8"
      style={{
        backgroundColor: "#FFFFE7",
        minHeight: minHeight,
      }}
    >
      <Header />
      {children}
    </div>
  );
}
