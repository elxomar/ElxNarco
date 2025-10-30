/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Narco Life RPG Color Palette
        'charcoal': '#0E0E0E',
        'deep-gray': '#1C1C1C',
        'crimson': '#B30000',
        'muted-gold': '#D4AF37',
        'pale-white': '#EAEAEA',
      },
      fontFamily: {
        'sans': ['Montserrat', 'Oswald', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-glow': 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(179, 0, 0, 0.1) 100%)',
        'vignette': 'radial-gradient(circle, transparent 20%, rgba(14, 14, 14, 0.8) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'crimson-glow': '0 0 20px rgba(179, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}