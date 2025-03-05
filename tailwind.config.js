/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50", // Deep blue-gray
        secondary: "#E74C3C", // Coral red
        accent: "#3498DB", // Bright blue
        neutral: "#ECF0F1", // Light gray
        "base-100": "#FFFFFF", // White
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#2C3E50",
          secondary: "#E74C3C",
          accent: "#3498DB",
          neutral: "#ECF0F1",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },
};
