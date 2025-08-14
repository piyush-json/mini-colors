import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "foreground-muted": "hsl(var(--foreground-muted))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        "primary-hover": "hsl(var(--primary-hover))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        "secondary-hover": "hsl(var(--secondary-hover))",
        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
        "success-hover": "hsl(var(--success-hover))",
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
        "warning-hover": "hsl(var(--warning-hover))",
        error: "hsl(var(--error))",
        "error-foreground": "hsl(var(--error-foreground))",
        "error-hover": "hsl(var(--error-hover))",
        info: "hsl(var(--info))",
        "info-foreground": "hsl(var(--info-foreground))",
        "info-hover": "hsl(var(--info-hover))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        "card-border": "hsl(var(--card-border))",
        "card-hover": "hsl(var(--card-hover))",
        border: "hsl(var(--border))",
        "border-hover": "hsl(var(--border-hover))",
        input: "hsl(var(--input))",
        "input-border": "hsl(var(--input-border))",
        "input-border-focus": "hsl(var(--input-border-focus))",
        "input-focus-ring": "hsl(var(--input-focus-ring))",
      },
      fontFamily: {
        "geist-sans": ["var(--font-geist-sans)", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      animation: {
        "fade-out": "1s fadeOut 3s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
