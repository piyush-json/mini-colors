"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to game page since results are now shown there
    router.replace("/game");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFFFE7] flex items-center justify-center">
      <div className="text-center">
        <p className="font-sintony text-lg">Redirecting to game...</p>
      </div>
    </div>
  );
}
