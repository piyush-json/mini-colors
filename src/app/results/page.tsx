"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ShareMintScreen } from "@/components/ShareMintScreen";
import { useEffect, useState } from "react";

interface GameResults {
  targetColor: string;
  capturedColor: string;
  similarity: number;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<GameResults | null>(null);

  useEffect(() => {
    const targetColor = searchParams.get("targetColor");
    const capturedColor = searchParams.get("capturedColor");
    const similarity = searchParams.get("similarity");

    if (targetColor && capturedColor && similarity) {
      setResults({
        targetColor,
        capturedColor,
        similarity: parseInt(similarity),
      });
    } else {
      router.push("/game");
    }
  }, [searchParams, router]);

  const handleShare = () => {
    console.log("Share button clicked");
    if (results) {
      const shareText = `I just scored ${results.similarity}% in the Color Finding Game! 🎯`;
      if (navigator.share) {
        navigator.share({
          title: "Color Game Results",
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareText);
        alert("Results copied to clipboard!");
      }
    }
  };

  const handleMint = () => {
    console.log("Mint button clicked");
    // Implement mint functionality - could integrate with Web3 wallet
    alert("Mint functionality coming soon!");
  };

  const handleContinue = () => {
    // Navigate back to game or main menu
    router.push("/game");
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-[#FFFFE7] flex items-center justify-center">
        <div className="text-center">
          <p className="font-sintony text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <ShareMintScreen
      targetColor={results.targetColor}
      capturedColor={results.capturedColor}
      similarity={results.similarity}
      onShare={handleShare}
      onMint={handleMint}
      onContinue={handleContinue}
    />
  );
}
