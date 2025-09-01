import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OGMintCard } from "@/components/OGMintCard";
import { parseShareParams } from "@/lib/farcaster-share";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareData = parseShareParams(searchParams);

    if (!shareData) {
      return new Response("Missing or invalid data parameter", { status: 400 });
    }

    const { targetColor, capturedColor, similarity, userName, timeTaken } =
      shareData;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            fontFamily: "system-ui",
            padding: "40px",
          }}
        >
          {/* Scale and center the MintCard for 1.91:1 aspect ratio */}
          <div
            style={{
              transform: "scale(1.2)",
              width: "400px", // Fixed width to ensure proper scaling
              display: "flex",
              justifyContent: "center",
            }}
          >
            <OGMintCard
              targetColor={targetColor}
              capturedColor={capturedColor}
              similarity={similarity}
              userName={userName}
              timeTaken={timeTaken}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630, // Proper OG image dimensions (1.91:1 ratio)
        headers: {
          // Cache for 10 minutes - balance between performance and freshness
          "Cache-Control": "public, max-age=600, s-maxage=600",
          "Content-Type": "image/png",
        },
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
