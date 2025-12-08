import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TuOrdenYa Brand Colors
        'brand': {
          orange: '#FF6F3C',      // Primary action (Naranja vibrante)
          'orange-light': '#FFD5C2', // Primary suave (Naranja pastel)
          'orange-dark': '#E65A2D', // Darker hover state
          green: '#2ECC71',       // State confirmation (Verde)
          tech: '#4A90E2',        // Professional optional (Azul tech)
        },
        orange: {
          50: '#FFF5F0',
          100: '#FFD5C2',  // Brand pastel
          200: '#FFBFA3',
          300: '#FFA984',
          400: '#FF8F5E',
          500: '#FF6F3C',  // Brand vibrant
          600: '#FF6F3C',  // Primary
          700: '#E65A2D',  // Hover/darker
          800: '#CC4E26',
          900: '#B3431F',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
