/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1025px',
      xl: '1280px',
      '2xl': '1536px',
    },

    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
      black: {
        DEFAULT: '#333',
        100: '#000',
        111: '#111',
        333: '#333',
      },
      white: {
        DEFAULT: '#F9F9F9',
        125: 'rgba(249, 249, 249, 0.25)',
        150: 'rgba(249, 249, 249, 0.5)',
        175: 'rgba(249, 249, 249, 0.75)',
      },
      gray: {
        ...colors.gray,
        DEFAULT: '#999',
        eee: '#EEE',
        e4: '#4E4E4E',
      },
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      slate: colors.slate,
      maroon: '#630505',
      lightGreen: '#AFF0C0',
      brightGreen: '#31D95E',
      brightRed: '#C51E1E',
      lightRed: '#FFA8A8',
      lightBlue: '#E5F4FD',
      brightBlue: '#4285F4',
      softBlue: '#61A9D1',
      skyBlue: '#9CC9E2',
      brightWhite: '#FFF',
      lightGray: '#EEE',
      mustard: '#FBBC05',
      darkBlue: '#1F4860',
      lightAzure: '#D6E9F3',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
