/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        page: "#F3F1EC",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#ECE8E1",
        },
        overlay: "rgba(17,17,17,0.45)",
        primary: "#111111",
        secondary: "#5C5A57",
        muted: "#7A756E",
        border: {
          default: "#262626",
          subtle: "#D6D0C7",
        },
        accent: {
          DEFAULT: "#F4BE00",
          hover: "#D9A600",
          soft: "#F7E59E",
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
