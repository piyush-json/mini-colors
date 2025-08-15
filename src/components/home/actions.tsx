"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Target, BarChart3, FileText, Lightbulb } from "lucide-react";

export function HomeActions() {
  return (
    <>
      <div className="text-center space-y-4">
        <Link href="/practice">
          <Button variant="secondary" size="lg" className="max-w-xs">
            <Target className="w-4 h-4 mr-2" />
            PRACTICE MODE (NO CAMERA)
          </Button>
        </Link>
        <div className="space-x-4">
          <Link href="/stats">
            <Button variant="secondary" size="default">
              <BarChart3 className="w-4 h-4 mr-2" />
              VIEW STATISTICS
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="secondary" size="default">
              <FileText className="w-4 h-4 mr-2" />
              VIEW HISTORY
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="p-4 border-4 border-foreground bg-muted shadow-[8px_8px_0px_hsl(var(--foreground))]">
          <p className="text-sm font-mono font-black uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 inline mr-2" />
            <strong>TIP:</strong> GOOD LIGHTING AND A STEADY HAND WILL IMPROVE
            YOUR COLOR ACCURACY!
          </p>
        </div>
      </div>
    </>
  );
}

export default HomeActions;
