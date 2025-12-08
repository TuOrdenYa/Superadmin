/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FF6F3C",        // Naranja vibrante (acción)
          "primary-soft": "#FFD5C2", // Naranja pastel (fondos)
          neutral: "#111111",        // Negro profundo
          "neutral-ui": "#3A3A3A",   // Gris oscuro UI
          "neutral-light": "#F5F6F8",// Gris claro
          background: "#FFFFFF",     // Fondo claro
          professional: "#4A90E2",   // Azul tech
          success: "#2ECC71",        // Verde confirmación
        },
      },
    },
  },
  plugins: [],
};
