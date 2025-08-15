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
import { Trophy } from "lucide-react";

export function Scoring() {
  const rows = [
    ["90-100%", "PERFECT MATCH!", "success"],
    ["80-89%", "EXCELLENT!", "success"],
    ["70-79%", "GREAT JOB!", "outline"],
    ["60-69%", "GOOD!", "accent"],
    ["Below 60%", "KEEP TRYING!", "secondary"],
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          SCORING SYSTEM
        </CardTitle>
        <CardDescription>DESTRUCTION METRICS</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm font-mono">
          {rows.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 border-2 border-foreground bg-muted"
            >
              <span className="font-black uppercase">{r[0]}</span>
              <Badge
                variant={r[2] as "success" | "outline" | "accent" | "secondary"}
              >
                {r[1]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Scoring;
