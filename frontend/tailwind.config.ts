import type { Config } from 'tailwindcss'

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
          50: '#E9FFF2',
          100: '#C2FFD9',
          200: '#8BFFC0',
          300: '#4BFEA6',
          400: '#1EF486',
          500: '#25D366',
          600: '#1BAA4F',
          700: '#127B39',
          800: '#0A4E24',
          900: '#042411',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
