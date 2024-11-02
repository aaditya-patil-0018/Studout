/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/html/utils/withMT");
const { dark } = require('daisyui/src/theming/themes');
module.exports = withMT({
  content: [
    "./templates/*.html",
    "./static/**/*.js",
    "./static/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        'textfield': '#F4F4F4',
        primary: {
          600: '#1f1f1f',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          // importing the built-in 'light' theme
          // and setting the color values for '--primary-muted'
          // (numbers are OKLCH values)
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#1f1f1f",
        },
      },
    ],
  },
});

