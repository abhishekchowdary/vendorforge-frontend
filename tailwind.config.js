/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5e9ff',
          100: '#e9d1ff',
          200: '#d1a8ff',
          300: '#b97eff',
          400: '#a257ff',
          500: '#8b2fff',
          600: '#711fdb',
          700: '#5a18af',
          800: '#451186',
          900: '#2d0a57',
          950: '#1a0733'
        }
      },
      boxShadow: {
        card: '0 8px 24px rgba(130, 60, 255, 0.15)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      ringColor: {
        brand: '#5a18af'
      }
    }
  },
  plugins: []
};
