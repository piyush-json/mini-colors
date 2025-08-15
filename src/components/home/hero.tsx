"use client";

import React from "react";

export function HomeHero() {
  return (
    <div className="text-center mb-8">
      <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
        COLOR
        <br />
        <span className="text-accent">HUNTER</span>
      </h1>
      <p className="text-xl font-bold uppercase tracking-wide max-w-2xl mx-auto">
        TEST YOUR COLOR PERCEPTION SKILLS! CHOOSE FROM 4 EXCITING MINI-GAMES TO
        CHALLENGE YOUR COLOR MATCHING ABILITIES.
      </p>
    </div>
  );
}

export default HomeHero;
