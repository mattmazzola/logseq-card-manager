/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      colors: {
        primary: '#002B36',
        secondary: '#023643',
        tertiary: '#08404F',
        highlight: '#B3C2C9',
        buttonbg: '#084958',
      },
    },
  },
  plugins: [],
}
