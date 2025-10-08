import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#25D366',
          50: '#E8FFF1',
          100: '#D1FFE3',
          200: '#A4FEC6',
          300: '#76FCA9',
          400: '#49F98C',
          500: '#25D366',
          600: '#1EAA52',
          700: '#16803E',
          800: '#0E562A',
          900: '#072C16',
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
} satisfies Config;
