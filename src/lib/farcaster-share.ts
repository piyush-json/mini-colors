export interface ShareData {
  targetColor: string;
  capturedColor: string;
  similarity: number;
  userName: string;
  date?: string;
  timeTaken?: number; // Time taken in seconds
}

export interface LeaderboardShareData {
  rank: number;
  score: number;
  userName: string;
  gameType: "all" | "color-mixing" | "finding";
  date?: string;
}

// Simple encoding to reduce length and make it less obvious
function encodeShareData(data: ShareData): string {
  // Remove # from colors and convert to short format
  const tc = data.targetColor.replace("#", "");
  const cc = data.capturedColor.replace("#", "");
  const s = data.similarity.toString(36); // base36 for shorter numbers
  const u = btoa(data.userName).replace(/[=+/]/g, ""); // base64 without padding chars
  const t = data.timeTaken ? data.timeTaken.toString(36) : ""; // base36 for time taken

  // Pack everything into a compact string with separators
  return `${tc}-${cc}-${s}-${u}${t ? `-${t}` : ""}`;
}

// Decode the compact string back to ShareData
function decodeShareData(encoded: string): ShareData | null {
  try {
    const parts = encoded.split("-");
    if (parts.length < 4) return null;

    // Handle both old format (4 parts) and new format (5 parts)
    const [tc, cc, s, u, t] = parts;

    // Restore padding for base64 decode if needed
    const paddedU = u + "=".repeat((4 - (u.length % 4)) % 4);

    const result: ShareData = {
      targetColor: `#${tc}`,
      capturedColor: `#${cc}`,
      similarity: parseInt(s, 36), // parse from base36
      userName: atob(paddedU),
    };

    if (parts.length >= 5 && t) {
      result.timeTaken = parseInt(t, 36);
    }

    return result;
  } catch (error) {
    console.error("Failed to decode share data:", error);
    return null;
  }
}

// Simple encoding for leaderboard data
function encodeLeaderboardShareData(data: LeaderboardShareData): string {
  const r = data.rank.toString(36); // base36 for rank
  const s = data.score.toString(36); // base36 for score
  const u = btoa(data.userName).replace(/[=+/]/g, ""); // base64 without padding chars
  const g =
    data.gameType === "all"
      ? "a"
      : data.gameType === "color-mixing"
        ? "c"
        : "f"; // game type
  const d = data.date ? btoa(data.date).replace(/[=+/]/g, "") : ""; // date

  return `${r}-${s}-${u}-${g}${d ? `-${d}` : ""}`;
}

// Decode leaderboard share data
function decodeLeaderboardShareData(
  encoded: string,
): LeaderboardShareData | null {
  try {
    const parts = encoded.split("-");
    if (parts.length < 4) return null;

    const [r, s, u, g, d] = parts;

    // Restore padding for base64 decode if needed
    const paddedU = u + "=".repeat((4 - (u.length % 4)) % 4);
    const paddedD = d ? d + "=".repeat((4 - (d.length % 4)) % 4) : "";

    const gameType = g === "a" ? "all" : g === "c" ? "color-mixing" : "finding";

    const result: LeaderboardShareData = {
      rank: parseInt(r, 36),
      score: parseInt(s, 36),
      userName: atob(paddedU),
      gameType,
    };

    if (d) {
      result.date = atob(paddedD);
    }

    return result;
  } catch (error) {
    console.error("Failed to decode leaderboard share data:", error);
    return null;
  }
}

export function generateFarcasterShareUrl(data: ShareData): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  console.log("data", data);
  const encoded = encodeShareData(data);

  const shareUrl = `${baseUrl}/share?d=${encoded}`;

  return shareUrl;
}

export function generateLeaderboardShareUrl(
  data: LeaderboardShareData,
  leaderboardData?: any,
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  console.log("data", data);
  // Create leaderboard data string
  let leaderboardParam = "";
  if (leaderboardData) {
    const allData = [...leaderboardData.leaderboard];

    // Add user's row if not in top 10
    if (
      leaderboardData.userRanking &&
      !leaderboardData.leaderboard.some((entry: any) => entry.isCurrentUser)
    ) {
      allData.push({
        rank: leaderboardData.userRanking.rank.toString(),
        userName: leaderboardData.userRanking.userName,
        score: leaderboardData.userRanking.score,
        isCurrentUser: true,
      });
    }

    // Encode all leaderboard data
    leaderboardParam = encodeURIComponent(JSON.stringify(allData));
  }

  // Generate OG image URL with all leaderboard data
  const ogImageUrl = `${baseUrl}/api/og/leaderboard?data=${leaderboardParam}&gameType=${data.gameType}&date=${data.date}`;

  return ogImageUrl;
}

export function parseShareParams(
  searchParams: URLSearchParams,
): ShareData | null {
  const encoded = searchParams.get("d");
  if (!encoded) return null;

  return decodeShareData(encoded);
}

export function parseLeaderboardShareParams(
  searchParams: URLSearchParams,
): LeaderboardShareData | null {
  const encoded = searchParams.get("d");
  if (!encoded) return null;

  return decodeLeaderboardShareData(encoded);
}
