/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EAF3FF",
          100: "#D6E8FF",
          200: "#ADD1FF",
          300: "#84BBFF",
          400: "#5AA4FF",
          500: "#2F72B8", // main blue
          600: "#245E98",
          700: "#1B4A78",
          800: "#123658",
          900: "#0A2238",
        },
        accent: {
          50: "#FFF3E8",
          100: "#FFE4CC",
          200: "#FFC999",
          300: "#FFAE66",
          400: "#FF9333",
          500: "#F28C28", // main orange
          600: "#D87412",
          700: "#A95A0E",
          800: "#7A410A",
          900: "#4B2806",
        },
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
      },
    },
  },
  plugins: [],
};
