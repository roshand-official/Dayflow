/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        df: {
          bg: 'var(--df-bg)',
          surface: 'var(--df-surface)',
          'surface-glass': 'var(--df-surface-glass)',
          lime: 'var(--df-lime)',
          'lime-dark': 'var(--df-lime-dark)',
          text: 'var(--df-text)',
          muted: 'var(--df-muted)',
          border: 'var(--df-border)',
          success: 'var(--df-success)',
          'success-text': 'var(--df-success-text)',
          warning: 'var(--df-warning)',
          'warning-text': 'var(--df-warning-text)',
          danger: 'var(--df-danger)',
          'danger-text': 'var(--df-danger-text)',
          info: 'var(--df-info)',
          'info-text': 'var(--df-info-text)',
          dark: 'var(--df-dark)',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
