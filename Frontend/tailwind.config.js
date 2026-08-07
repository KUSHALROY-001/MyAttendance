/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: "#0D0D0F",
        darkCard: "#151518",
        darkHeader: "#161619",
        darkBorder: "#222228",
        darkHover: "#1C1C20",
      },
    },
  },
  plugins: [],
}

