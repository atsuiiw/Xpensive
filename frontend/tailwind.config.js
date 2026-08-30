/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        canvas: '#0a0a10',
        surface: {
          DEFAULT: '#13131c',
          raised: '#1a1a26',
          sunken: '#0e0e15',
        },
        hairline: 'rgba(255, 255, 255, 0.09)',
        accent: {
          DEFAULT: '#34d399',
          soft: 'rgba(52, 211, 153, 0.14)',
        },
        negative: {
          DEFAULT: '#fb7185',
          soft: 'rgba(251, 113, 133, 0.12)',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgba(0, 0, 0, 0.35)',
        popover: '0 16px 40px -12px rgba(0, 0, 0, 0.65)',
      },
      fontSize: {
        overline: ['0.6875rem', { lineHeight: '1.25rem', letterSpacing: '0.14em' }],
        stat: ['2rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'stat-hero': ['clamp(2rem, 4vw, 2.75rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      animation: {
        drift: 'drift 22s ease-in-out infinite alternate',
        'drift-slow': 'drift 30s ease-in-out infinite alternate-reverse',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) both',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(4rem, -3rem, 0) scale(1.12)' },
          '100%': { transform: 'translate3d(-3rem, 2.5rem, 0) scale(0.95)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};