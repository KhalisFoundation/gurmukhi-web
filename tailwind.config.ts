import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
      white: '#F9F9F9',
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
      lightBlue: '#E5F4FD',
      skyBlue: '#9CC9E2',
      brightWhite: '#FFF',
      lightGray: '#EEE',
      mustard: '#FBBC05',
      darkBlue: '#1F4860',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
