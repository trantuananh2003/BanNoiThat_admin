/** @type {import('tailwindcss').Config} */

module.exports = {

  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },

  plugins: [],

}