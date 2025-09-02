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

// Database entry from leaderboard table
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  gameType: string;
  timeTaken: string;
}

// User ranking data
export interface UserRanking {
  userId: string;
  userName: string;
  score: number;
  gameType: string;
  rank: number;
}

// Database query result
export interface LeaderboardQueryResult {
  topScores: LeaderboardEntry[];
  userRanking: UserRanking | null;
}

// Formatted leaderboard entry for display
export interface FormattedLeaderboardEntry {
  rank: string;
  userName: string;
  score: number;
  isCurrentUser: boolean;
}

// API response structure
export interface LeaderboardApiResponse {
  date: string;
  gameType: string;
  leaderboard: FormattedLeaderboardEntry[];
  userRanking: {
    rank: number;
    score: number;
    userName: string;
  } | null;
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

export function generateFarcasterShareUrl(data: ShareData): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  console.log("data", data);
  const encoded = encodeShareData(data);

  const shareUrl = `${baseUrl}/share?d=${encoded}`;

  return shareUrl;
}

// Custom encoding for leaderboard data to reduce URL length
function encodeLeaderboardData(data: FormattedLeaderboardEntry[]): string {
  // Format: userName|score;userName|score;... (rank is implicit from position)
  // Current user is marked with a special prefix: @userName|score
  // Truncate long usernames to max 20 chars
  // Use base36 for numbers to make them shorter
  return data
    .map((entry) => {
      const truncatedName =
        entry.userName.length > 20
          ? entry.userName.substring(0, 20)
          : entry.userName;
      const encodedName = btoa(truncatedName).replace(/[=+/]/g, ""); // base64 without padding
      const currentUserPrefix = entry.isCurrentUser ? "@" : "";
      return `${currentUserPrefix}${encodedName}|${entry.score.toString(36)}`;
    })
    .join(";");
}

// Custom decoding for leaderboard data
export function decodeLeaderboardData(
  encoded: string,
): FormattedLeaderboardEntry[] {
  try {
    const entries = encoded.split(";");

    return entries.map((entry, index) => {
      // Check if this entry has the @ prefix (current user marker)
      const isCurrentUser = entry.startsWith("@");
      const cleanEntry = isCurrentUser ? entry.substring(1) : entry;

      const [encodedName, score] = cleanEntry.split("|");

      // Decode username
      const paddedName =
        encodedName + "=".repeat((4 - (encodedName.length % 4)) % 4);
      const userName = atob(paddedName);

      return {
        rank: (index + 1).toString(),
        userName,
        score: parseInt(score, 36), // parse from base36
        isCurrentUser,
      };
    });
  } catch (error) {
    console.error("Failed to decode leaderboard data:", error);
    return [];
  }
}

export function generateLeaderboardShareUrl(
  data: LeaderboardShareData,
  leaderboardData?: LeaderboardApiResponse,
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  let leaderboardParam = "";
  if (leaderboardData) {
    const allData = [...leaderboardData.leaderboard];

    if (
      leaderboardData.userRanking &&
      !leaderboardData.leaderboard.some((entry) => entry.isCurrentUser)
    ) {
      allData.push({
        rank: leaderboardData.userRanking.rank.toString(),
        userName: leaderboardData.userRanking.userName,
        score: leaderboardData.userRanking.score,
        isCurrentUser: true,
      });
    }

    leaderboardParam = encodeLeaderboardData(allData);
  }

  const ogImageUrl = `${baseUrl}/api/og/leaderboard?data=${leaderboardParam}&gameType=${data.gameType}&date=${data.date}`;
  console.log("ogImageUrl", ogImageUrl);
  return ogImageUrl;
}

export function parseShareParams(
  searchParams: URLSearchParams,
): ShareData | null {
  const encoded = searchParams.get("d");
  if (!encoded) return null;

  return decodeShareData(encoded);
}
