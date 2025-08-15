import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono font-black uppercase tracking-wider text-sm transition-all duration-75 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-4 sm:border-8 transform hover:translate-x-1 sm:hover:translate-x-2 hover:translate-y-1 sm:hover:translate-y-2 active:translate-x-2 sm:active:translate-x-4 active:translate-y-2 sm:active:translate-y-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-primary shadow-[4px_4px_0px_hsl(var(--foreground))] sm:shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_hsl(var(--foreground))] sm:hover:shadow-[4px_4px_0px_hsl(var(--foreground))] active:shadow-[0px_0px_0px_hsl(var(--foreground))]",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive shadow-[4px_4px_0px_hsl(var(--foreground))] sm:shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_hsl(var(--foreground))] sm:hover:shadow-[4px_4px_0px_hsl(var(--foreground))] active:shadow-[0px_0px_0px_hsl(var(--foreground))]",
        outline:
          "border-foreground bg-background text-foreground shadow-[4px_4px_0px_hsl(var(--foreground))] sm:shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_hsl(var(--foreground))] sm:hover:shadow-[4px_4px_0px_hsl(var(--foreground))] active:shadow-[0px_0px_0px_hsl(var(--foreground))]",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary shadow-[4px_4px_0px_hsl(var(--foreground))] sm:shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_hsl(var(--foreground))] sm:hover:shadow-[4px_4px_0px_hsl(var(--foreground))] active:shadow-[0px_0px_0px_hsl(var(--foreground))]",
        accent:
          "bg-accent text-accent-foreground border-accent shadow-[4px_4px_0px_hsl(var(--foreground))] sm:shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_hsl(var(--foreground))] sm:hover:shadow-[4px_4px_0px_hsl(var(--foreground))] active:shadow-[0px_0px_0px_hsl(var(--foreground))]",
        success:
          "bg-success text-success-foreground border-success shadow-[4px_4px_0px_hsl(var(--foreground))] sm:shadow-[8px_8px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_hsl(var(--foreground))] sm:hover:shadow-[4px_4px_0px_hsl(var(--foreground))] active:shadow-[0px_0px_0px_hsl(var(--foreground))]",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground shadow-none hover:shadow-none active:shadow-none",
        link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none hover:shadow-none active:shadow-none",
      },
      size: {
        default: "h-12 sm:h-16 px-4 sm:px-8 py-2 sm:py-4",
        sm: "h-10 sm:h-12 px-3 sm:px-6 py-2 sm:py-3 text-xs",
        lg: "h-16 sm:h-20 px-6 sm:px-12 py-3 sm:py-6 text-lg",
        icon: "h-12 w-12 sm:h-16 sm:w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
