/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: '#f0f5ff',
            100: '#e0ecff',
            500: '#2563eb',
            700: '#1d4ed8',
            800: '#1e3a8a',
            900: '#0f2c59',
            950: '#0a192f',
          },
          saffron: {
            50: '#fffbeb',
            100: '#fef3c7',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
          },
          green: {
            50: '#ecfdf5',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'glow-saffron': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(15, 44, 89, 0.4)',
        'card': '0 10px 30px -5px rgba(15, 44, 89, 0.08)',
      }
    },
  },
  plugins: [],
}
