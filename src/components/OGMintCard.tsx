import { formatTimeTaken } from "@/lib/utils";

interface OGMintCardProps {
  targetColor: string;
  capturedColor: string;
  similarity: number;
  userName: string;
  timeTaken?: number;
}

const colorPalette = [
  "#FF9D9D",
  "#FFDB9D",
  "#C1FF9D",
  "#CB9DFF",
  "#FFF29D",
  "#5A9B7B",
  "#9DB4FF",
  "#FF9DE8",
  "#FFCE9D",
  "#C7FF9D",
  "#BF9DFF",
  "#C17C44",
  "#D0BBB5",
  "#9B3838",
  "#BFFF00",
  "#DFB43D",
];

const leftRightColorPalette = [
  "#2E62DB",
  "#A81C9A",
  "#F80000",
  "#FFDB9D",
  "#C1FF9D",
  "#CB9DFF",
  "#FFF29D",
  "#5A9B7B",
  "#9DB4FF",
  "#FF9DE8",
  "#FFCE9D",
  "#C7FF9D",
  "#BF9DFF",
  "#C17C44",
  "#D0BBB5",
  "#9B3838",
  "#BFFF00",
];

export const OGMintCard = ({
  targetColor,
  capturedColor,
  similarity,
  userName,
  timeTaken,
}: OGMintCardProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "white",
        border: "3px solid black",
        borderRadius: "12px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "600",
              color: "black",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
          </span>
          <span
            style={{
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "400",
              color: "#374151",
            }}
          >
            @{userName}
          </span>
        </div>
        {timeTaken && (
          <span
            style={{
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "400",
              color: "black",
            }}
          >
            Time Taken: {formatTimeTaken(timeTaken)}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "system-ui",
            fontSize: "54px",
            fontWeight: "400",
            color: "black",
            lineHeight: "42px",
          }}
        >
          {similarity.toFixed(2)}%
        </span>
        <span
          style={{
            fontFamily: "system-ui",
            fontSize: "24px",
            fontWeight: "400",
            color: "black",
            lineHeight: "16px",
          }}
        >
          It&apos;s a Match!
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
          marginTop: "32px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              border: "1px solid black",
              borderRadius: "19px",
              transform: "rotate(6deg)",
              backgroundColor: targetColor,
            }}
          />
          <div
            style={{
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "400",
              color: "black",
              textAlign: "center",
              display: "flex",
            }}
          >
            Target
            <br />
            colour
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2L2 8L8 14"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2L14 8L8 14"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              border: "1px solid black",
              borderRadius: "19px",
              transform: "rotate(-6deg)",
              backgroundColor: capturedColor,
            }}
          />
          <div
            style={{
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "400",
              color: "black",
              textAlign: "center",
              display: "flex",
            }}
          >
            My
            <br />
            colour
          </div>
        </div>
      </div>
      {/* Top color strip */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "16px",
          display: "flex",
          top: "-2px",
          left: "0",
        }}
      >
        {colorPalette.map((color, index) => (
          <div
            key={`top-${index}`}
            style={{
              flex: "1",
              height: "14px",
              borderTop: "2px solid black",
              borderLeft: "2px solid black",
              backgroundColor: color,
              ...(index === colorPalette.length - 1 && {
                borderRight: "2px solid black",
              }),
            }}
          />
        ))}
      </div>
      {/* Bottom color strip */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "16px",
          display: "flex",
          bottom: "-2px",
          left: "0",
        }}
      >
        {[...colorPalette].reverse().map((color, index) => (
          <div
            key={`bottom-${index}`}
            style={{
              flex: "1",
              height: "14px",
              borderLeft: index === 0 ? "none" : "2px solid black",
              backgroundColor: color,
              ...(index === colorPalette.length - 1 && {
                borderRight: "2px solid black",
              }),
            }}
          />
        ))}
      </div>
      {/* Left color strip */}
      <div
        style={{
          position: "absolute",
          width: "16px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          left: "-2px",
          top: "0",
        }}
      >
        {leftRightColorPalette.map((color, index) => (
          <div
            key={`left-${index}`}
            style={{
              width: "14px",
              flex: "1",
              borderLeft: "2px solid black",
              borderTop: "2px solid black",
              backgroundColor: color,
              ...(index === leftRightColorPalette.length - 1 && {
                borderBottom: "2px solid black",
              }),
            }}
          />
        ))}
      </div>
      {/* Right color strip */}
      <div
        style={{
          position: "absolute",
          width: "16px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          right: "-2px",
          top: "0",
        }}
      >
        {leftRightColorPalette.map((color, index) => (
          <div
            key={`right-${index}`}
            style={{
              width: "14px",
              flex: "1",
              borderTop: "2px solid black",
              backgroundColor: color,
              ...(index === leftRightColorPalette.length - 1 && {
                borderBottom: "2px solid black",
              }),
            }}
          />
        ))}
      </div>
    </div>
  );
};
