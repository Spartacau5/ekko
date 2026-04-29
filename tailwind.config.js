/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Anti-Flash White — primary canvas
        page: "#F2F3F4",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#EBEAED", // Lace Cap
        },
        overlay: "rgba(2,0,53,0.45)",
        // Midnight Blue — primary text
        primary: "#020035",
        secondary: "#4A4A55",
        muted: "#6B7280",
        border: {
          default: "#020035",
          subtle: "#E0E0E4",
        },
        // Dark Royalty — interactive / links / active states
        brand: {
          DEFAULT: "#02066F",
          hover: "#01054F",
          soft: "#E6E7F2",
        },
        // Kimchi Orange — CTA / accent / AI suggestions
        accent: {
          DEFAULT: "#ED4B00",
          hover: "#C53E00",
          soft: "#FCE3D6",
        },
        // Deep Sea Exploration — dark panels (e.g. stakeholder graph)
        deep: {
          DEFAULT: "#2000B1",
          hover: "#1A0094",
        },
        success: {
          DEFAULT: "#16A34A",
          soft: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#F59E0B",
          soft: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#EF4444",
          soft: "#FEE2E2",
        },
        info: {
          DEFAULT: "#02066F",
          soft: "#E6E7F2",
        },
      },
      fontFamily: {
        display: ['"Nasalization"', '"Poppins"', "system-ui", "sans-serif"],
        sans: ['"Poppins"', '"Inter"', "system-ui", "sans-serif"],
        serif: ['"Source Serif 4"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', '"Menlo"', "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(2,0,53,0.05)",
        elevated: "0 12px 32px rgba(2,0,53,0.10)",
      },
    },
  },
  plugins: [],
};
