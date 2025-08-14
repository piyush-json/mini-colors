import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

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
      <body className="font-mono bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
