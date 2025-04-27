/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

const defaultTheme = require('tailwindcss/defaultConfig');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    screens: {
      '3xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }
      
      '2xl':{'max': '1326px'},

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    },
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      ...colors,
      primary: '3B81F6',
      white: '#FFFFFF',
      text: {
        DEFAULT: '1F2937',
        light: '#6C7281'
      },
      light: {
        DEFAULT: 'FAFBFC',
        light: '#F3F4F6'
      }
    },
    theme: {
      container: {
        center: true,
      },
      height: {
        '128': '56rem',
      },
      zIndex: {
        '1200': '1200',
      }
    },
    extend: {},
  },
  plugins: [],
}
