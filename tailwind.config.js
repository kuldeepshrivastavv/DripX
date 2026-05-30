/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: {
          DEFAULT: '#39FF14',
          50: '#f0fff0',
          100: '#dbffdb',
          200: '#b9ffb9',
          300: '#83ff83',
          400: '#3eff3e',
          500: '#0bff0b',
          600: '#00e100',
          700: '#00ab00',
          800: '#058305',
          900: '#096909',
          950: '#003a00',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 15px rgba(57, 255, 20, 0.25)',
        'neon-strong': '0 0 25px rgba(57, 255, 20, 0.5)',
      }
    },
  },
  plugins: [],
}
