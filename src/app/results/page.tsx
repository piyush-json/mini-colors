"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShareMintScreen } from "@/components/ShareMintScreen";
import { useGameResults } from "@/lib/GameResultsContext";
import { useComposeCast, useMiniKit } from "@coinbase/onchainkit/minikit";
import html2canvas from "html2canvas";
import { useMiniKitUser } from "@/lib/useMiniKitUser";
import { getMintCost, useMintNFT } from "@/lib/nft-contract";
import { generateFarcasterShareUrl } from "@/lib/farcaster-share";
import { rgbOrHslToHex } from "@/lib/color-mixing-utils";
// import { useFrame } from "@/lib/FrameContext";

export default function ResultsPage() {
  const router = useRouter();
  const { results, clearResults, setGameMode } = useGameResults();
  const { composeCastAsync: composeCast } = useComposeCast();
  const { getUserName } = useMiniKitUser();
  const { mint, isPending: isMinting, address } = useMintNFT();

  useEffect(() => {
    if (!results) {
      router.push("/");
    }
  }, [results, router]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      console.log("Share button clicked");

      // convert both colors to hex if in rgb or hsl
      const convertToHex = (color: string) => {
        if (color.startsWith("rgb") || color.startsWith("hsl")) {
          return rgbOrHslToHex(color as `rgb${string}` | `hsl${string}`);
        }
        return color; // Already in hex or other format
      };

      const shareData = {
        targetColor: convertToHex(results.targetColor),
        capturedColor: convertToHex(results.capturedColor),
        similarity: results.similarity,
        userName: getUserName(),
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
      };
      const shareUrl = generateFarcasterShareUrl(shareData);
      console.log("Share URL:", shareUrl);
      await composeCast({
        text: `Just scored ${results.similarity}% in the color matching game! 🎨 Can you beat my score?`,
        embeds: [shareUrl],
      });
    } catch (error) {
      console.error("Error taking screenshot:", error);
      await composeCast({
        text: `Just scored ${results?.similarity}% in the color matching game! 🎨 Can you beat my score?`,
      });
    }
  };
  const handleMint = async () => {
    try {
      console.log("Mint button clicked");

      // Find the mintit div specifically
      const mintitElement = document.getElementById("mintit");
      if (!mintitElement) {
        console.error("Mintit element not found");
        return;
      }

      // Take screenshot of just the mintit div
      const canvas = await html2canvas(mintitElement, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to base64
      const base64Image = canvas.toDataURL("image/png");

      // Convert colors to hex format
      const convertToHex = (color: string) => {
        if (color.startsWith("rgb") || color.startsWith("hsl")) {
          return rgbOrHslToHex(color as `rgb${string}` | `hsl${string}`);
        }
        return color; // Already in hex or other format
      };

      // Prepare metadata for the color game API
      const gameMetadata = {
        targetColor: convertToHex(results.targetColor),
        capturedColor: convertToHex(results.capturedColor),
        similarity: results.similarity,
        timeTaken: results.timeTaken,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
        mode: results.gameType === "upload" ? "finding" : "color-mixing", // Map gameType to mode
        image: base64Image,
      };

      // Upload to the color game metadata API
      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_S3_URL}/color-game/metadata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameMetadata),
        },
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload color game metadata");
      }

      const response = await uploadResponse.json();
      const { imageUrl, uri: metadataUri } = response as {
        imageUrl: string;
        uri: string;
        success: boolean;
        message: string;
      };

      console.log("Metadata uploaded successfully!");
      console.log("NFT Metadata URI:", metadataUri);
      console.log("Image URL:", imageUrl);

      // Mint NFT
      await mint(metadataUri, getMintCost());
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT. Please try again.");
    }
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

  // Convert colors to hex format for consistent display
  const convertToHex = (color: string) => {
    if (color.startsWith("rgb") || color.startsWith("hsl")) {
      return rgbOrHslToHex(color as `rgb${string}` | `hsl${string}`);
    }
    return color; // Already in hex or other format
  };

  return (
    <div className="w-full grow flex flex-col items-center">
      <ShareMintScreen
        targetColor={convertToHex(results.targetColor)}
        capturedColor={convertToHex(results.capturedColor)}
        similarity={results.similarity}
        timeTaken={results.timeTaken}
        mode={results.mode}
        gameType={results.gameType}
        onShare={handleShare}
        onMint={handleMint}
        onContinue={handleContinue}
        onAttemptAgain={handleAttemptAgain}
        isMinting={isMinting}
      />
    </div>
  );
}
