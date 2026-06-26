import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAF7F0',
          dim: '#F1ECE1',
        },
        ink: {
          DEFAULT: '#1F2430',
          soft: '#4A5063',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1B1D24',
        },
        bg: {
          dark: '#13141A',
        },
        card: {
          dark: '#1E2027',
        },
        indigo: {
          50: '#EEF1FA',
          100: '#D7DFF2',
          400: '#5C76B8',
          500: '#3A5499',
          600: '#2B4570',
          700: '#203357',
        },
        amber: {
          400: '#E3A455',
          500: '#D98E3F',
          600: '#B8722C',
        },
        moss: {
          500: '#3F7D58',
          600: '#326249',
        },
        brick: {
          500: '#C1473B',
          600: '#A0392F',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(31, 36, 48, 0.06), 0 8px 24px -8px rgba(31, 36, 48, 0.12)',
        cardDark: '0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -8px rgba(0,0,0,0.5)',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        riseIn: 'riseIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
