import { Metadata } from "next";
import { parseShareParams } from "@/lib/farcaster-share";
import { MintCard } from "@/components/MintCard";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    d?: string; // encoded data
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = new URLSearchParams(
    resolvedSearchParams as Record<string, string>,
  );
  const shareData = parseShareParams(urlSearchParams);

  if (!shareData) {
    return {
      title: "Color Game",
      description: "Match colors and share your results!",
    };
  }

  // Create OG image URL with the same encoded parameter
  const ogImageUrl = `${process.env.NEXT_PUBLIC_FURL || "http://localhost:3000"}/api/og?d=${resolvedSearchParams.d}`;
  const shareUrl = `${process.env.NEXT_PUBLIC_FURL || "http://localhost:3000"}/share?d=${resolvedSearchParams.d}`;

  return {
    title: `${shareData.userName} scored ${shareData.similarity}% color match!`,
    description: `Check out this amazing color match result - ${shareData.similarity}% accuracy!`,
    openGraph: {
      title: `${shareData.userName} scored ${shareData.similarity}% color match!`,
      description: `Check out this amazing color match result - ${shareData.similarity}% accuracy!`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Color match result: ${shareData.similarity}% accuracy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${shareData.userName} scored ${shareData.similarity}% color match!`,
      description: `Check out this amazing color match result - ${shareData.similarity}% accuracy!`,
      images: [ogImageUrl],
    },
    other: {
      // Farcaster frame metadata for proper embed generation
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: ogImageUrl,
        button: {
          title: `View ${shareData.userName}'s ${shareData.similarity}% Match`,
          action: {
            type: "launch_frame",
            name: "Color Match Game",
            url:
              process.env.NEXT_PUBLIC_FURL ||
              process.env.NEXT_PUBLIC_URL ||
              "http://localhost:3000",
            splashImageUrl: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/splash.png`,
            splashBackgroundColor: "#f5f5f5",
          },
        },
      }),
    },
  };
}

export default async function SharePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = new URLSearchParams(
    resolvedSearchParams as Record<string, string>,
  );
  const shareData = parseShareParams(urlSearchParams);

  if (!shareData) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Color Game</h1>
          <p className="text-gray-600">Share your color matching results!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Amazing Color Match!
          </h1>
          <p className="text-gray-600">
            {shareData.userName} achieved {shareData.similarity}% accuracy
          </p>
        </div>

        <MintCard
          targetColor={shareData.targetColor}
          capturedColor={shareData.capturedColor}
          similarity={shareData.similarity}
          userName={shareData.userName}
        />

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="w-full h-[68px] rounded-[39px] border border-black text-black font-normal text-[24px] leading-[33px] sm:leading-[37px] font-sintony px-4 py-2"
            style={{
              backgroundColor: "#FFE254",
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
            }}
          >
            Try the Color Game
          </Link>
        </div>
      </div>
    </div>
  );
}
