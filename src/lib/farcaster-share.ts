export interface ShareData {
  targetColor: string;
  capturedColor: string;
  similarity: number;
  userName: string;
  date?: string;
  timeTaken?: number; // Time taken in seconds
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

  const encoded = encodeShareData(data);

  const shareUrl = `${baseUrl}/share?d=${encoded}`;

  return shareUrl;
}

export function parseShareParams(
  searchParams: URLSearchParams,
): ShareData | null {
  const encoded = searchParams.get("d");
  if (!encoded) return null;

  return decodeShareData(encoded);
}
