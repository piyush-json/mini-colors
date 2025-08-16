import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "COLOR HUNTER - BRUTALIST EDITION",
  description: "BRUTAL COLOR PERCEPTION TRAINING SYSTEM - NO BULLSHIT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono bg-background text-foreground h-full w-screen flex flex-col items-center justify-center">
        <Providers>
          <div
            className="min-h-screen px-8 font-sintony w-full flex flex-col items-center gap-8"
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
