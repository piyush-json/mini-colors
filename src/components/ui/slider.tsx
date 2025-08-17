"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    thumbColor?: string;
    trackColor?: string;
  }
>(({ className, thumbColor, trackColor, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[38px] w-full grow overflow-hidden rounded-[21px] bg-white border border-black">
      <SliderPrimitive.Range
        className="absolute h-full transition-all duration-150 ease-out border-l border-black rounded-l-[20px]"
        style={{
          backgroundColor: trackColor || "hsl(var(--primary))",
          marginLeft: "1px",
          marginTop: "1px",
          height: "calc(100% - 2px)",
        }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-[48px] w-[48px] rounded-full border-[4px] border-black bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 hover:scale-105 hover:shadow-[0px_4px_8px_rgba(0,0,0,0.3)] active:scale-95 cursor-grab active:cursor-grabbing"
      style={{
        backgroundColor: thumbColor || "white",
      }}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
