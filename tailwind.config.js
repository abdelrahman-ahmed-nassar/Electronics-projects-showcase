/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        orbitron: ["var(--font-orbitron)"],
        exo: ["var(--font-exo2)"],
      },
      colors: {
        navy: "#0a192f",
        "electric-blue": "#4d94ff",
        "mint-green": "#64ffda",
        amber: "#ffb300",
        magenta: "#ff3366",
        primary: {
          DEFAULT: "#64ffda", // Mint green
          50: "#F3FFFB",
          100: "#E0FFF6",
          200: "#B3FFE9",
          300: "#8BFFDF",
          400: "#64ffda", // Default primary mint green
          500: "#32F7CB",
          600: "#12E8BA",
          700: "#0CBEA8",
          800: "#0A9A89",
          900: "#087F72",
        },
        secondary: {
          DEFAULT: "#4d94ff", // Electric blue
          50: "#F0F6FF",
          100: "#E1ECFF",
          200: "#C3DAFF",
          300: "#A5C7FF",
          400: "#8BB0FF",
          500: "#4d94ff", // Default secondary electric blue
          600: "#2A7BFF",
          700: "#0062FF",
          800: "#0055E1",
          900: "#0047BD",
        },
        accent: {
          DEFAULT: "#ffb300", // Amber
          50: "#FFF8E6",
          100: "#FFEFC3",
          200: "#FFE499",
          300: "#FFDA70",
          400: "#ffb300", // Default accent amber
          500: "#EDA600",
          600: "#D39500",
          700: "#B07C00",
          800: "#8D6300",
          900: "#735000",
        },
        dark: {
          DEFAULT: "#0a192f", // Navy blue
          50: "#ECEEF5",
          100: "#D9DEEB",
          200: "#B3BDD7",
          300: "#8C9BC3",
          400: "#667AAF",
          500: "#495992",
          600: "#344177",
          700: "#1F2851",
          800: "#0a192f", // Default dark navy
          900: "#060E1A",
        },
        // Additional colors from the design
        magenta: {
          DEFAULT: "#ff3366",
          50: "#FFF0F5",
          100: "#FFE0EA",
          200: "#FFC1D5",
          300: "#FFA3C0",
          400: "#FF699B",
          500: "#ff3366", // Default magenta
          600: "#FF0A47",
          700: "#E0002F",
          800: "#BC0028",
          900: "#980020",
        },
      },
      animation: {
        progress: "progress 1.5s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "data-transfer": "data-transfer 1.5s linear infinite",
        "circuit-flow": "circuit-flow 10s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "text-glow": "text-glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        progress: {
          "0%": { width: "0%" },
          "50%": { width: "70%" },
          "100%": { width: "100%" },
        },
        "data-transfer": {
          "0%": { left: "-10%", opacity: "0.8" },
          "100%": { left: "100%", opacity: "0.2" },
        },
        "circuit-flow": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(0, 210, 255, 0.5), 0 0 10px rgba(0, 210, 255, 0.2)",
            opacity: "0.8",
          },
          "100%": {
            boxShadow:
              "0 0 10px rgba(0, 210, 255, 0.8), 0 0 20px rgba(0, 210, 255, 0.4)",
            opacity: "1",
          },
        },
        "text-glow": {
          "0%": {
            textShadow: "0 0 4px rgba(100, 255, 218, 0.5)",
          },
          "100%": {
            textShadow: "0 0 8px rgba(100, 255, 218, 0.8)",
          },
        },
      },
      backgroundImage: {
        "circuit-pattern": "url('/images/circuit-pattern.svg')",
      },
    },
  },
  plugins: [],
};
