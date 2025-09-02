import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dataParam = url.searchParams.get("data");
    const date =
      url.searchParams.get("date") || new Date().toISOString().split("T")[0];
    let displayData: {
      rank: number;
      userName: string;
      score: number;
      isCurrentUser: boolean;
    }[] = [];
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        displayData = parsedData.map((entry: any) => ({
          rank: parseInt(entry.rank),
          userName: entry.userName,
          score: entry.score,
          isCurrentUser: entry.isCurrentUser || false,
        }));
      } catch (error) {
        console.error("Error parsing leaderboard data:", error);
        // Fallback to empty data
        displayData = [];
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#FFFFE7",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            padding: "40px",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "40px",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "900",
                color: "#000000",
                margin: "0 0 16px 0",
                textTransform: "uppercase",
                letterSpacing: "4px",
                textShadow: "2px 2px 0px #FFD700",
                lineHeight: "1",
              }}
            >
              Leaderboard
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 24px",
                backgroundColor: "#FFFFFF",
                border: "3px solid #000000",
                borderRadius: "12px",
                boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  color: "#666666",
                  fontWeight: "600",
                }}
              >
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Leaderboard Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "600px",
              overflow: "hidden",
              paddingBottom: "8px",
            }}
          >
            {displayData.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px",
                  backgroundColor: "#FFFFFF",
                  border: "3px solid #000000",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    color: "#666666",
                    fontWeight: "600",
                  }}
                >
                  No scores yet today!
                </span>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  width: "100%",
                }}
              >
                {/* Left Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: "1",
                  }}
                >
                  {displayData
                    .filter((_, index) => index % 2 === 0)
                    .map((entry: any, index: number) => (
                      <div
                        key={`${entry.rank}-${entry.userName}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          backgroundColor: entry.isCurrentUser
                            ? "#FFE254"
                            : "#FFFFFF",
                          border: "3px solid #000000",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
                          minHeight: "60px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flex: "1",
                          }}
                        >
                          {/* Rank Badge */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "32px",
                              height: "32px",
                              backgroundColor:
                                entry.rank === 1
                                  ? "#FFD700"
                                  : entry.rank === 2
                                    ? "#C0C0C0"
                                    : entry.rank === 3
                                      ? "#CD7F32"
                                      : "#E5E5E5",
                              borderRadius: "50%",
                              fontSize: "14px",
                              fontWeight: "900",
                              color: "#000000",
                              border: "2px solid #000000",
                              boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 1)",
                              flexShrink: "0",
                            }}
                          >
                            {entry.rank}
                          </div>

                          {/* Username */}
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#000000",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.userName}
                            {entry.isCurrentUser && " (You)"}
                          </span>
                        </div>

                        {/* Score */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            backgroundColor: entry.isCurrentUser
                              ? "#FFD700"
                              : "#F0F0F0",
                            border: "2px solid #000000",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 1)",
                            flexShrink: "0",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "900",
                              color: "#000000",
                            }}
                          >
                            {entry.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Right Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: "1",
                  }}
                >
                  {displayData
                    .filter((_, index) => index % 2 === 1)
                    .map((entry: any, index: number) => (
                      <div
                        key={`${entry.rank}-${entry.userName}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          backgroundColor: entry.isCurrentUser
                            ? "#FFE254"
                            : "#FFFFFF",
                          border: "3px solid #000000",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
                          minHeight: "60px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flex: "1",
                          }}
                        >
                          {/* Rank Badge */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "32px",
                              height: "32px",
                              backgroundColor:
                                entry.rank === 1
                                  ? "#FFD700"
                                  : entry.rank === 2
                                    ? "#C0C0C0"
                                    : entry.rank === 3
                                      ? "#CD7F32"
                                      : "#E5E5E5",
                              borderRadius: "50%",
                              fontSize: "14px",
                              fontWeight: "900",
                              color: "#000000",
                              border: "2px solid #000000",
                              boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 1)",
                              flexShrink: "0",
                            }}
                          >
                            {entry.rank}
                          </div>

                          {/* Username */}
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#000000",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.userName}
                            {entry.isCurrentUser && " (You)"}
                          </span>
                        </div>

                        {/* Score */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            backgroundColor: entry.isCurrentUser
                              ? "#FFD700"
                              : "#F0F0F0",
                            border: "2px solid #000000",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 1)",
                            flexShrink: "0",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "900",
                              color: "#000000",
                            }}
                          >
                            {entry.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "#FFFFFF",
              border: "2px solid #000000",
              borderRadius: "8px",
              boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 1)",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                color: "#888888",
                fontWeight: "600",
              }}
            >
              @playshadedotfun
            </span>
          </div>
        </div>
      ),
      {
        width: 900,
        height: 800,
      },
    );
  } catch (error) {
    console.error("Error generating leaderboard OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
