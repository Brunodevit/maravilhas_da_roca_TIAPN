/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'roca-bg': '#FDFBF6',       // Fundo creme da tela
        'roca-dark': '#4A2C1D',     // Marrom escuro (textos e títulos)
        'roca-medium': '#8C6246',   // Marrom médio (detalhes)
        'roca-input': '#F3EAE0',    // Fundo da barra de pesquisa
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}