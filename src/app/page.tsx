"use client";

import React from "react";
import HomeHero from "@/components/home/hero";
import HowToPlay from "@/components/home/how-to-play";
import Scoring from "@/components/home/scoring";
import GameCardGrid from "@/components/home/game-cards";
import HomeActions from "@/components/home/actions";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <HomeHero />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <HowToPlay />
          <Scoring />
        </div>

        <GameCardGrid />

        <HomeActions />
      </div>
    </div>
  );
}
