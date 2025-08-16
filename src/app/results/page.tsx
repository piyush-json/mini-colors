"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShareMintScreen } from "@/components/ShareMintScreen";
import { useGameResults } from "@/lib/GameResultsContext";

export default function ResultsPage() {
  const router = useRouter();
  const { results, clearResults, setGameMode } = useGameResults();

  // Redirect to game if no results
  useEffect(() => {
    if (!results) {
      router.push("/game");
    }
  }, [results, router]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const handleShare = () => {
    console.log("Share button clicked");
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
  };

  const handleMint = () => {
    console.log("Mint button clicked");
    alert("Mint functionality coming soon!");
  };

  const handleContinue = () => {
    clearResults();
    router.push("/game");
  };

  const handleAttemptAgain = () => {
    clearResults();
    setGameMode("practice");
    router.push("/game");
  };

  return (
    <ShareMintScreen
      targetColor={results.targetColor}
      capturedColor={results.capturedColor}
      similarity={results.similarity}
      timeTaken={results.timeTaken}
      mode={results.mode}
      gameType={results.gameType}
      onShare={handleShare}
      onMint={handleMint}
      onContinue={handleContinue}
      onAttemptAgain={handleAttemptAgain}
    />
  );
}
