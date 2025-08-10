/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1623",
        card: "#121A2A",
        accent: "#66E1F5",
      }
    },
  },
  plugins: [],
};
