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
          50: "#eef3fb",
          600: "#2557a7",
          700: "#1d4691",
        },
        cta: {
          500: "#0080ff",
        },
        accent: {
          500: "#ffcd1b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
