import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "COLOR HUNTER",
  description: "Find the color, win the game!",
  openGraph: {
    title: "COLOR HUNTER",
    description: "Find the color, win the game!",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/hero.png`,
        width: 1200,
        height: 630,
        alt: "Color Hunter Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "COLOR HUNTER",
    description: "Find the color, win the game!",
    images: [
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/hero.png`,
    ],
  },
  other: {
    // Farcaster frame metadata for the main app
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/hero.png`,
      button: {
        title: "Play COLOR HUNTER",
        action: {
          type: "launch_frame",
          name: "COLOR HUNTER",
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
      <body className="font-mono bg-background text-foreground flex flex-col items-center justify-center">
        <Providers>
          <div
            className="min-h-screen px-8 font-sintony w-screen flex flex-col items-center gap-8"
            style={{ backgroundColor: "#FFFFE7" }}
          >
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
