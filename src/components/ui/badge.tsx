import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border-4 px-4 py-2 font-mono font-black text-xs uppercase tracking-wider transition-all duration-75 focus:outline-none transform hover:translate-x-1 hover:translate-y-1",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_hsl(var(--foreground))]",
        secondary:
          "border-secondary bg-secondary text-secondary-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_hsl(var(--foreground))]",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_hsl(var(--foreground))]",
        success:
          "border-success bg-success text-success-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_hsl(var(--foreground))]",
        warning:
          "border-warning bg-warning text-warning-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_hsl(var(--foreground))]",
        info: "border-info bg-info text-info-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_hsl(var(--foreground))]",
        accent:
          "border-accent bg-accent text-accent-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_hsl(var(--foreground))]",
        outline:
          "border-foreground bg-background text-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_hsl(var(--foreground))]",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-2",
        lg: "text-base px-4 py-3",
        xl: "text-lg px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
