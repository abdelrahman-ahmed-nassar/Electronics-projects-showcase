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
        navy: '#0a192f',
        'electric-blue': '#4d94ff',
        'mint-green': '#64ffda',
        amber: '#ffb300',
        magenta: '#ff3366',
      }
    },
  },
  plugins: [],
};
