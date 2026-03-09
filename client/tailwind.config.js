/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Dark industrial transit theme - extend as needed later
      colors: {
        transit: {
          dark: "#0f1419",
          panel: "#1a2332",
          accent: "#f59e0b",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
