"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Target } from "lucide-react";

export function HowToPlay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          HOW TO PLAY
        </CardTitle>
        <CardDescription>DESTRUCTION INSTRUCTIONS</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm font-mono">
          {[
            "CHOOSE YOUR FAVORITE MINI-GAME",
            "ALLOW CAMERA ACCESS WHEN PROMPTED",
            "POINT YOUR CAMERA AT AN OBJECT WITH THE TARGET COLOR",
            "CAPTURE THE COLOR AND SEE YOUR SCORE!",
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-4">
              <Badge
                variant="outline"
                size="sm"
                className="min-w-6 text-center"
              >
                {i + 1}
              </Badge>
              <p className="font-black uppercase tracking-wide">{t}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default HowToPlay;
