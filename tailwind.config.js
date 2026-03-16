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
        primary: '#E11D48',    // Vibrant Rose
        secondary: '#FB7185',  // Lighter Rose
        accent: '#2563EB',     // Blue for links/action
        background: '#0f0d13', // Deep Dark Background (customized)
        foreground: '#FFF1F2', // Rose Tinted White
      },
      fontFamily: {
        fira: ['"Fira Code"', '"Fira Sans"', 'monospace'],
      },
    },
  },
  plugins: [],
}
