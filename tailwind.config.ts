import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdfb",
          100: "#d0fbf4",
          200: "#a6f3e7",
          300: "#6fe6d6",
          400: "#39d2bf",
          500: "#18b7a6",
          600: "#109386",
          700: "#10756c",
          800: "#125e57",
          900: "#124e49"
        }
      },
      boxShadow: {
        card: "0 1px 0 rgba(15, 23, 42, 0.04), 0 8px 20px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
} satisfies Config;

