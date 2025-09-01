import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LayoutContent } from "./layout-content";
import "@b3dotfun/sdk/index.css";

export const metadata: Metadata = {
  title: "Play Shade",
  description: "Mix colors. Guess shades. Win the day.",
  openGraph: {
    title: "Play Shade",
    description: "Mix colors. Guess shades. Win the day.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/hero.png`,
        width: 1200,
        height: 630,
        alt: "play Shades Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Play Shade",
    description: "Mix colors. Guess shades. Win the day.",
    images: [
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/hero.png`,
    ],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/hero.png`,
      button: {
        title: "Play Shade",
        action: {
          type: "launch_frame",
          name: "Play Shade",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className="font-mono bg-background text-foreground flex flex-col items-center justify-center"
        style={{ minHeight: "100vh" }}
      >
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
