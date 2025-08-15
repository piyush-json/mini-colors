"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Star,
  PartyPopper,
  Gamepad2,
  Palette,
  Gem,
  Lock,
  Rocket,
} from "lucide-react";

export function GameCardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            DAILY CHALLENGE
          </CardTitle>
          <CardDescription>DAILY DESTRUCTION QUOTA</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl flex justify-center">
            <Star className="w-12 h-12" />
          </div>
          <h3 className="font-mono text-lg font-black uppercase tracking-tighter">
            DAILY COLOR HUNT
          </h3>
          <p className="text-sm font-mono font-bold uppercase tracking-wide">
            A NEW COLOR EVERY DAY! CHALLENGE YOURSELF AND COMPETE ON THE GLOBAL
            LEADERBOARD. UNLIMITED ATTEMPTS TO BEAT YOUR BEST SCORE.
          </p>
          <Link href="/daily">
            <Button
              size="lg"
              className="w-full font-black text-lg tracking-tighter uppercase"
            >
              <Rocket className="w-4 h-4 mr-2" />
              START DAILY CHALLENGE
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PartyPopper className="w-5 h-5" />
            PARTY MODE
          </CardTitle>
          <CardDescription>LOCAL DESTRUCTION GATHERING</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl flex justify-center">
            <PartyPopper className="w-12 h-12" />
          </div>
          <h3 className="font-mono text-lg font-black uppercase tracking-tighter">
            LOCAL PARTY GAME
          </h3>
          <p className="text-sm font-mono font-bold uppercase tracking-wide">
            HOST A PARTY! ONE PERSON GIVES A COLOR, OTHERS HUNT FOR IT. PERFECT
            FOR GROUP FUN AND FRIENDLY COMPETITION.
          </p>
          <Link href="/party">
            <Button variant="secondary" size="lg" className="w-full">
              <Gamepad2 className="w-4 h-4 mr-2" />
              START PARTY MODE
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            COLOR MIXING
          </CardTitle>
          <CardDescription>BLEND DESTRUCTION METHOD</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl flex justify-center">
            <Palette className="w-12 h-12" />
          </div>
          <h3 className="font-mono text-lg font-black uppercase tracking-tighter">
            MIX TWO COLORS
          </h3>
          <p className="text-sm font-mono font-bold uppercase tracking-wide">
            BLEND COLORS IN PERFECT PROPORTIONS! MIX TWO COLORS TO CREATE THE
            TARGET COLOR. TEST YOUR COLOR THEORY KNOWLEDGE.
          </p>
          <Link href="/mixing">
            <Button variant="secondary" size="lg" className="w-full">
              <Palette className="w-4 h-4 mr-2" />
              START MIXING
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="w-5 h-5" />
            COMING SOON
          </CardTitle>
          <CardDescription>FUTURE DESTRUCTION</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl flex justify-center">
            <Gem className="w-12 h-12" />
          </div>
          <h3 className="font-mono text-lg font-black uppercase tracking-tighter">
            MYSTERY GAME
          </h3>
          <p className="text-sm font-mono font-bold uppercase tracking-wide">
            A BRAND NEW COLOR CHALLENGE IS IN DEVELOPMENT! STAY TUNED FOR
            EXCITING UPDATES AND NEW GAMEPLAY MODES.
          </p>
          <Button
            onClick={() => {}}
            disabled
            variant="secondary"
            size="lg"
            className="w-full opacity-50"
          >
            <Lock className="w-4 h-4 mr-2" />
            COMING SOON
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default GameCardGrid;
