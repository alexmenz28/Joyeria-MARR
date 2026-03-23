/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5e9',
          100: '#f3e7c7',
          200: '#e8d49a',
          300: '#dcbe6a',
          400: '#d0ab47',
          500: '#c4972e',
          600: '#a87726',
          700: '#875a1f',
          800: '#6a461b',
          900: '#4f3415',
        },
        // Oro principal
        marrGold: '#D4AF37',
        gold: {
          50: '#fdf8eb',
          100: '#f9eac3',
          200: '#f3d890',
          300: '#eac25c',
          400: '#e0b33c',
          500: '#d4af37',
          600: '#b38f2b',
          700: '#8b6c22',
          800: '#624b1a',
          900: '#3f3212',
        },
        // Fondos claros 
        ivory: '#F7F3EB',
        porcelain: '#F2ECE1',
        // Fondos oscuros 
        night: {
          900: '#050509',
          800: '#0C0C14',
          700: '#151720',
        },
      },
      animation: {
        'reveal': 'reveal 0.4s ease-out forwards',
        'reveal-slow': 'reveal 0.5s ease-out forwards',
        'mobile-menu-in': 'mobile-menu-in 0.25s ease-out forwards',
        'cart-toast-pop': 'cart-toast-pop 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) forwards',
        'cart-badge-pulse': 'cart-badge-pulse 0.65s ease-out',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'mobile-menu-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'cart-toast-pop': {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(0.92)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'cart-badge-pulse': {
          '0%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 