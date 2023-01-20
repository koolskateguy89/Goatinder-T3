/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      spacing: {
        4.5: "1.125rem",
      },
    },
  },
  // prettier-ignore
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("daisyui"),
  ],

  daisyui: {
    themes: ["light", "dark"],
  },
};
