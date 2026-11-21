/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#080F1C',
          secondary: '#101B2D',
          elevated: '#142238',
        },
        accent: {
          primary: '#35D5F2',
          secondary: '#528BFF',
        },
        foreground: {
          DEFAULT: '#F3F7FC',
          muted: '#9AAAC0',
        },
        border: '#1F314D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
