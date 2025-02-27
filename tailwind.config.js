/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ===========================================
         * IMPORTANT: Background Color Reference
         * ------------------------------------------
         * Original soft white background: #FFFAF0
         * DO NOT CHANGE without explicit permission
         * =========================================== */
        
        // Brand Colors
        primary: '#F59E0B',    // Warm Yellow (yellow-500)
        secondary: '#18181B',  // Dark Background (zinc-900)
        background: '#FFFAF0', // Original Soft White Background (PRESERVE THIS)
        
        // Accent Colors
        accent: {
          yellow: {
            DEFAULT: '#F59E0B',  // Primary yellow
            light: '#FCD34D',    // Lighter yellow for hover
            dark: '#D97706',     // Darker yellow for active
          },
        },
        
        // Text Colors
        text: {
          primary: '#FFFFFF',    // Primary text
          secondary: '#E4E4E7',  // Secondary text (zinc-200)
          muted: '#71717A',      // Muted text (zinc-500)
        },
        
        // Border Colors
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',  // Default borders
          yellow: 'rgba(245, 158, 11, 0.2)',    // Yellow borders
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}