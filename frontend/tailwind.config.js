/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'dusty-pink': '#C77690',    // Main brand color
        'dark-grey': '#374151',     // Dark grey for text and accents
        'white': '#FFFFFF',         // Clean white
        
        // Shades and variations
        'dusty-pink-light': '#D4A5B3',   // Lighter dusty pink
        'dusty-pink-dark': '#B0687A',    // Darker dusty pink
        'grey-light': '#6B7280',         // Medium grey
        'grey-lighter': '#F3F4F6',       // Very light grey
      },
    },
  },
  plugins: [],
}
