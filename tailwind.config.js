/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    require('preline/plugin'),
  ],
  variants: {
    extend: {
      borderColor: ['responsive', 'hover', 'focus', 'active'],
      ringColor: ['responsive', 'hover', 'focus', 'active'],
    },
  },
}

