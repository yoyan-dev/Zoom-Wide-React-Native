/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // 🔵 PRIMARY (Brand Blue - Core Identity)
        primary: {
          50: "#EAF3FF",
          100: "#D6E8FF",
          200: "#ADD1FF",
          300: "#84BBFF",
          400: "#5AA4FF",
          500: "#2F72B8", // MAIN BRAND
          600: "#245E98",
          700: "#1B4A78",
          800: "#123658",
          900: "#0A2238",
        },

        // 🟠 ACCENT (Construction Orange)
        accent: {
          50: "#FFF3E8",
          100: "#FFE4CC",
          200: "#FFC999",
          300: "#FFAE66",
          400: "#FF9333",
          500: "#F28C28", // MAIN ACCENT
          600: "#D87412",
          700: "#A95A0E",
          800: "#7A410A",
          900: "#4B2806",
        },

        // ⚫ NEUTRAL (UI + Text)
        neutral: {
          50: "#F7F7F8",
          100: "#ECEDEF",
          200: "#D9DCE1",
          300: "#B8BEC7",
          400: "#8E97A3",
          500: "#667080",
          600: "#47505C",
          700: "#2F3742",
          800: "#1F252D",
          900: "#111418",
        },

        // 🧠 SYSTEM COLORS (IMPORTANT FOR APP UX)
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",

        // 🎯 BACKGROUND / SURFACE (for clean UI system)
        background: "#FFFFFF",
        surface: "#F7F7F8",
        card: "#FFFFFF",
        border: "#E5E7EB",

        // 📝 TEXT COLORS (consistent naming)
        text: {
          primary: "#111418",
          secondary: "#47505C",
          muted: "#8E97A3",
          inverse: "#FFFFFF",
        },
      },
    },
  },

  plugins: [],
};
