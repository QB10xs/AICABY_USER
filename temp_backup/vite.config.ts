import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    postcss: './postcss.config.cjs',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['uuid'],
  },
  server: {
    // Enable HMR
    hmr: true,
    // Configure port
    port: 5174,
  },
  build: {
    // Enable source maps for production build
    sourcemap: true,
    // Optimize dependencies
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'map-vendor': ['mapbox-gl', '@mapbox/mapbox-gl-geocoder'],
          'date-vendor': ['date-fns'],
          'state-vendor': ['zustand'],
          'auth-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
