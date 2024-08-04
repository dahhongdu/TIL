/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tag': '#fff9eb',
        'tag-hover': '#eadec2'
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
