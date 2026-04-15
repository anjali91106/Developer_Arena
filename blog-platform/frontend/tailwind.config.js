/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ec4899',
        'primary-dark': '#db2777',
        'secondary': '#a78bfa',
        'accent': '#f472b6',
        'background': '#fdf2f8',
        'surface': '#fce7f3',
      }
    },
  },
  plugins: [],
}

