import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
                manifest: {
                    name: 'AICABY Admin',
                    short_name: 'AICABY',
                    description: 'AICABY Admin Dashboard',
                    theme_color: '#ffffff',
                    background_color: '#1A1A1A',
                    icons: [
                        {
                            src: '/icons/icon-144x144.png',
                            sizes: '144x144',
                            type: 'image/png',
                            purpose: 'any'
                        },
                        {
                            src: 'pwa-64x64.png',
                            sizes: '64x64',
                            type: 'image/png'
                        },
                        {
                            src: 'pwa-192x192.png',
                            sizes: '192x192',
                            type: 'image/png'
                        },
                        {
                            src: 'pwa-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'any'
                        },
                        {
                            src: 'maskable-icon-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'maskable'
                        }
                    ]
                },
                workbox: {
                    cleanupOutdatedCaches: true,
                    skipWaiting: true,
                    clientsClaim: true
                }
            })
        ],
        css: {
            postcss: './postcss.config.cjs',
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svg'],
        },
        optimizeDeps: {
            include: ['uuid'],
        },
        define: {
            // Pass environment variables to the client
            'process.env': env
        },
        server: {
            port: 5174,
            strictPort: true,
            host: true,
            hmr: {
                protocol: 'ws',
                host: 'localhost',
                port: 5174,
            },
        },
        preview: {
            port: 5174,
            strictPort: true,
            host: true,
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
    };
});
