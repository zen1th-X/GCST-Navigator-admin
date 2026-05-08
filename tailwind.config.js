/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        libraryBlue: '#1a56db',
        libraryBlueLight: '#dbeafe',
        sidebarBg: '#f8fafc',
      }
    },
  },
  plugins: [],
}
