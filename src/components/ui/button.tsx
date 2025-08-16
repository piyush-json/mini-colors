import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-hartone font-normal uppercase tracking-widest text-base transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border transform hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-black rounded-[39px] shadow-soft hover:shadow-soft-sm active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground border-black rounded-[39px] shadow-soft hover:shadow-soft-sm active:shadow-none",
        outline:
          "border-black bg-background text-foreground rounded-[39px] shadow-soft hover:shadow-soft-sm active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground border-black rounded-[39px] shadow-soft hover:shadow-soft-sm active:shadow-none",
        accent:
          "bg-accent text-accent-foreground border-black rounded-[39px] shadow-soft hover:shadow-soft-sm active:shadow-none",
        success:
          "bg-success text-success-foreground border-black rounded-[39px] shadow-soft hover:shadow-soft-sm active:shadow-none",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground shadow-none hover:shadow-none active:shadow-none rounded-[39px]",
        link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none hover:shadow-none active:shadow-none rounded-[39px]",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 px-6 py-2 text-sm",
        lg: "h-16 px-12 py-4 text-lg",
        icon: "h-12 w-12",
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
