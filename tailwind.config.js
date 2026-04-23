/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        page: "#F4F4F6",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#E8E8EE",
        },
        overlay: "rgba(17,17,17,0.45)",
        primary: "#111111",
        secondary: "#5C5A64",
        muted: "#72707A",
        border: {
          default: "#262626",
          subtle: "#D9D9E1",
        },
        brand: {
          DEFAULT: "#2B00D4",
          hover: "#2200B0",
          soft: "#E2DCFB",
        },
        accent: {
          DEFAULT: "#F24A14",
          hover: "#D63E0E",
          soft: "#FBE0D4",
        },
        success: {
          DEFAULT: "#0E7C66",
          soft: "#DCEFE9",
        },
        warning: {
          DEFAULT: "#B07100",
          soft: "#F5E6C5",
        },
        danger: {
          DEFAULT: "#A14A3B",
          soft: "#F3E0DB",
        },
        info: {
          DEFAULT: "#48627A",
          soft: "#E4EBF0",
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', "Georgia", "serif"],
        sans: ['"Inter"', "Arial", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};
