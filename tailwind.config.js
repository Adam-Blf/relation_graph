/**
 * @file tailwind.config.js
 * @description Configuration Tailwind avec le design system "Vibrant & Block-based"
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#CA8A04',    // Gold
        secondary: '#A16207',  // Darker Gold
        accent: '#CA8A04',     // Gold Action
        background: '#0C0A09', // Stone Black
        foreground: '#FAFAF9', // Stone White
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
