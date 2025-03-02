import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ===========================================
         * AICABY Color System v2
         * ------------------------------------------
         * Primary: Taxi Yellow (#F7C948)
         * Secondary: Night Black (#2A2A2A)
         * =========================================== */
        
        // Brand Colors
        taxi: {
          yellow: '#F7C948',
          black: '#2A2A2A',
        },
        
        // Status Colors
        status: {
          success: '#27AE60',
          error: '#EB5757',
        },
        
        // Background Colors
        background: {
          light: '#FFFFFF',
          dark: '#2A2A2A',
          glass: {
            light: 'rgba(255, 255, 255, 0.7)',
            dark: 'rgba(42, 42, 42, 0.7)',
          },
        },
        
        // Text Colors
        text: {
          light: '#2A2A2A',
          dark: '#FFFFFF',
          secondary: {
            light: '#4B5563',
            dark: '#E4E4E7',
          },
          accent: {
            light: '#F7C948',
            dark: '#F7C948',
          },
        },
        
        // Border Colors
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#374151',
          glass: 'rgba(255, 255, 255, 0.1)',
          yellow: {
            light: 'rgba(247, 201, 72, 0.2)',
            dark: 'rgba(247, 201, 72, 0.2)',
          },
        },
      },
      backgroundImage: {
        'yellow-gradient': 'linear-gradient(135deg, #F7C948 0%, #FFE17D 100%)',
        'dark-gradient': 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(247, 201, 72, 0.1)',
        'glass-hover': '0 12px 40px rgba(247, 201, 72, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(12px)',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.backdrop-blur-sm': {
          'backdrop-filter': 'blur(4px)',
        },
        '.backdrop-blur-md': {
          'backdrop-filter': 'blur(8px)',
        },
        '.backdrop-blur-lg': {
          'backdrop-filter': 'blur(12px)',
        },
      });
    }),
  ],
}