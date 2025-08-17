"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShareMintScreen } from "@/components/ShareMintScreen";
import { useGameResults } from "@/lib/GameResultsContext";
import { useComposeCast } from "@coinbase/onchainkit/minikit";
import html2canvas from "html2canvas";
import { useMiniKitUser } from "@/lib/useMiniKitUser";
import { getMintCost } from "@/lib/nft-contract";
import { generateFarcasterShareUrl } from "@/lib/farcaster-share";
// import { useFrame } from "@/lib/FrameContext";

export default function ResultsPage() {
  const router = useRouter();
  const { results, clearResults, setGameMode } = useGameResults();
  const { composeCastAsync: composeCast } = useComposeCast();
  const { getUserAddress, getUserName } = useMiniKitUser();
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    if (!results) {
      router.push("/");
    }
  }, [results, router]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      console.log("Share button clicked");

      const shareData = {
        targetColor: results.targetColor,
        capturedColor: results.capturedColor,
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
        text: `Just scored ${results.similarity}% in the color matching game! 🎨 Can you beat my score? #ColorGame #OnchainKit`,
        embeds: [shareUrl],
      });
    } catch (error) {
      console.error("Error taking screenshot:", error);
      await composeCast({
        text: `Just scored ${results?.similarity}% in the color matching game! 🎨 Can you beat my score? #ColorGame #OnchainKit`,
      });
    }
  };
  const handleMint = async () => {
    try {
      setIsMinting(true);
      console.log("Mint button clicked");

      const userAddress = getUserAddress();
      if (
        !userAddress ||
        userAddress === "0x0000000000000000000000000000000000000000"
      ) {
        alert("Please connect your wallet to mint NFT");
        return;
      }

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

      // Prepare metadata for the color game API
      const gameMetadata = {
        targetColor: results.targetColor,
        capturedColor: results.capturedColor,
        similarity: results.similarity,
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

      // Prepare NFT minting parameters
      const mintParams = {
        to: userAddress,
        tokenURI: metadataUri,
        similarity: results.similarity,
        targetColor: results.targetColor,
        capturedColor: results.capturedColor,
        gameMode: results.gameType === "upload" ? "finding" : "color-mixing",
      };

      // Get mint cost
      const mintCost = getMintCost();
      console.log("Mint cost:", mintCost.toString(), "wei");

      // For demonstration, show the mint details
      const mintCostEth = Number(mintCost) / 1e18;
      alert(
        `NFT Ready to Mint!\n\n` +
          `Metadata URI: ${metadataUri}\n` +
          `Mint Cost: ${mintCostEth} ETH\n` +
          `Target Color: ${results.targetColor}\n` +
          `Your Color: ${results.capturedColor}\n` +
          `Similarity: ${results.similarity}%\n\n` +
          `In a real implementation, this would trigger an NFT mint transaction.`,
      );

      // TODO: Implement actual NFT minting logic here
      // const txHash = await mintColorGameNFT(mintParams);
      // console.log("NFT minted! Transaction hash:", txHash);
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT. Please try again.");
    } finally {
      setIsMinting(false);
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

  return (
    <div className="w-full grow flex flex-col items-center">
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
        isMinting={isMinting}
      />
    </div>
  );
}
