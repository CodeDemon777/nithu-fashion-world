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
        burgundy: {
          DEFAULT: "#57000D",
          deep: "#3D0008",
          dark: "#4A0009",
          wine: "#720013",
          rich: "#620A16",
          light: "#851525",
        },
        cream: {
          DEFAULT: "#FFF7F0",
          ivory: "#FDF4EC",
          soft: "#FFFBF7",
          warm: "#F7EBE1",
        },
        blush: {
          DEFAULT: "#F3D7CE",
          soft: "#EFC2B8",
          light: "#FAEDE6",
          dark: "#D8A498",
        },
        gold: {
          DEFAULT: "#C89B5A",
          light: "#E5C78C",
          dark: "#9E7432",
          accent: "#D4AF37",
          shimmer: "#F3E3B6",
        },
        charcoal: {
          DEFAULT: "#24191A",
          muted: "#756365",
          light: "#A08E90",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-allura)", "cursive"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(87, 0, 13, 0.15)",
        "luxury-lg": "0 20px 40px -15px rgba(87, 0, 13, 0.25)",
        gold: "0 4px 20px rgba(200, 155, 90, 0.25)",
        card: "0 4px 20px rgba(87, 0, 13, 0.06)",
        "card-hover": "0 12px 30px rgba(87, 0, 13, 0.15)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
