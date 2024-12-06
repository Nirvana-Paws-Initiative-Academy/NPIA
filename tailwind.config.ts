import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Fixed typo to properly glob files in "src"
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px", // Extra small devices (phones)
        sm: "640px", // Small devices
        md: "768px", // Medium devices (tablets)
        lg: "1024px", // Large devices (laptops)
        xl: "1280px", // Extra large devices (desktops)
        "2xl": "1536px", // Very large devices
        "3xl": "1920px", // Custom for Full HD screens
        "4xl": "2560px", // Custom for ultra-large screens
      },
      colors: {
        background: "var(--background)", // Added custom background color
        foreground: "var(--foreground)", // Added custom foreground color
      },
    },
  },
  plugins: [],
};

export default config;
