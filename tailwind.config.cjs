/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {},
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
