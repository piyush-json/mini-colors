import { Metadata } from "next";
import { decodeLeaderboardData } from "@/lib/farcaster-share";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const dataParam = resolvedSearchParams.data as string;
  const gameType = (resolvedSearchParams.gameType as string) || "all";
  const date =
    (resolvedSearchParams.date as string) ||
    new Date().toISOString().split("T")[0];

  if (!dataParam) {
    return {
      title: "Leaderboard - Color Game",
      description: "Check out the daily leaderboard rankings!",
    };
  }

  try {
    const leaderboardData = decodeLeaderboardData(dataParam);
    const currentUser = leaderboardData.find((entry) => entry.isCurrentUser);

    if (!currentUser) {
      return {
        title: "Leaderboard - Color Game",
        description: "Check out the daily leaderboard rankings!",
      };
    }

    // Create OG image URL with the same encoded parameter
    const ogImageUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/og/leaderboard?data=${dataParam}&gameType=${gameType}&date=${date}`;
    const shareUrl = `${process.env.NEXT_PUBLIC_FURL || "http://localhost:3000"}/leaderboard-share?data=${dataParam}&gameType=${gameType}&date=${date}`;

    return {
      title: `${currentUser.userName} is ranked #${currentUser.rank} on the leaderboard!`,
      description: `Check out ${currentUser.userName}'s amazing ${currentUser.score}% score on the daily leaderboard!`,
      openGraph: {
        title: `${currentUser.userName} is ranked #${currentUser.rank} on the leaderboard!`,
        description: `Check out ${currentUser.userName}'s amazing ${currentUser.score}% score on the daily leaderboard!`,
        images: [
          {
            url: ogImageUrl,
            width: 900,
            height: 800,
            alt: `Leaderboard showing ${currentUser.userName} at rank #${currentUser.rank}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${currentUser.userName} is ranked #${currentUser.rank} on the leaderboard!`,
        description: `Check out ${currentUser.userName}'s amazing ${currentUser.score}% score on the daily leaderboard!`,
        images: [ogImageUrl],
      },
      other: {
        // Farcaster frame metadata for proper embed generation
        "fc:frame": JSON.stringify({
          version: "next",
          imageUrl: ogImageUrl,
          button: {
            title: `View ${currentUser.userName}'s Rank`,
            action: {
              type: "launch_frame",
              name: "Play Shade Leaderboard",
              url:
                process.env.NEXT_PUBLIC_FURL ||
                process.env.NEXT_PUBLIC_URL ||
                "http://localhost:3000",
              splashImageUrl: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/splash.png`,
              splashBackgroundColor: "#FFFFE7",
            },
          },
        }),
      },
    };
  } catch (error) {
    console.error("Error generating leaderboard metadata:", error);
    return {
      title: "Leaderboard - Color Game",
      description: "Check out the daily leaderboard rankings!",
    };
  }
}

export default function LeaderboardSharePage() {
  return (
    <div className="w-full h-screen bg-[#FFFFE7] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-hartone text-4xl uppercase tracking-wide font-normal text-black leading-[42px] mb-4">
          LEADERBOARD
        </h1>
        <p className="text-gray-600 mb-4">
          Redirecting to the main leaderboard...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
      </div>
    </div>
  );
}
