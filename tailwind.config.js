/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        tech: {
          900: 'var(--bg-900)',
          800: 'var(--bg-800)',
          700: 'var(--bg-700)',
          yellow: 'var(--accent-yellow)',
          blue: 'var(--accent-blue)',
          text: 'var(--text-main)',
          muted: 'var(--text-muted)',
          border: 'var(--border-color)'
        }
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-flow': 'gridFlow 20s linear infinite',
        'scanline': 'scanline 4s ease-in-out infinite',
      },
      keyframes: {
        gridFlow: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '50px 50px' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        }
      }
    }
  },
  plugins: [],
}