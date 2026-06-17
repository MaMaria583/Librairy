import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf8f0",
          100: "#faefd9",
          200: "#f5dbb3",
          300: "#eec07d",
          400: "#e59d44",
          500: "#de8220",
          600: "#cf6a17",
          700: "#ac5115",
          800: "#8a4119",
          900: "#703618",
          950: "#3c1a09",
        },
        sidebar: {
          DEFAULT: "#1a1a2e",
          hover: "#16213e",
          active: "#0f3460",
          border: "#2d2d4e",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
