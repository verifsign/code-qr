import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1a4e8a",
          "blue-dark": "#123a6a",
          "blue-light": "#2a6db8",
          teal: "#2a9d8f",
          "teal-light": "#3dbdad",
          "teal-pale": "#e6f7f5",
        },
        neutral: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#6c757d",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
        },
      },
      fontSize: {
        base: ["18px", "1.7"],
        lg: ["20px", "1.6"],
        xl: ["22px", "1.5"],
        "2xl": ["26px", "1.4"],
        "3xl": ["30px", "1.3"],
        "4xl": ["36px", "1.2"],
        "5xl": ["44px", "1.1"],
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
