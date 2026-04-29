import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--color-bg-base)",
          surface: "var(--color-bg-surface)",
          hover: "var(--color-bg-hover)",
          accent: "var(--color-bg-accent)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          DEFAULT: "var(--color-border-default)",
          accent: "var(--color-border-accent)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          faint: "var(--color-text-faint)",
        },
        accent: "var(--color-accent)",
        // Fixed dark scale for code blocks (always dark, regardless of theme)
        ink: {
          base: "#0e0c0a",
          surface: "#15110d",
          border: "#2a241d",
          text: "#f5f1ea",
          muted: "#8b7e6f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tight2: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
