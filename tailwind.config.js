/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};
