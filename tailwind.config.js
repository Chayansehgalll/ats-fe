/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#080B12",
          900: "#0E1320",
          800: "#151C2E",
          700: "#1E2A42",
          600: "#2A3A5C",
        },
        acid: {
          400: "#C8FF57",
          500: "#AAEB3A",
          600: "#8FD420",
        },
        coral: "#FF6B6B",
        sky: "#57C8FF",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        spin360: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        fillBar: {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
        pulse2: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.4 },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease forwards",
        spin360: "spin360 1s linear infinite",
        fillBar: "fillBar 1s ease forwards",
        pulse2: "pulse2 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
