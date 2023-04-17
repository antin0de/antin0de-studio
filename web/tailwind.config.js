/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        mono: ["monospace", "sans-serif"],
        display: ["monospace", "sans-serif"],
        body: ["monospace", "sans-serif"],
      },
    },
  },
  plugins: [],
};
