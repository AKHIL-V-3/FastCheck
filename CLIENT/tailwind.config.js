/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      width: {
        'custom': '90%', // Customize width to be 80% of the parent container
      }
    },
  },
  plugins: [

    require('tailwind-scrollbar'),
  ],
}

