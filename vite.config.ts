import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      '.ngrok-free.app',
      '.ngrok.io',
      '.loca.lt',
      'localhost'
    ]
  },
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 3D libraries
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Animation libraries
          'vendor-animation': ['framer-motion', 'gsap'],
          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          // Icons
          'vendor-icons': ['lucide-react'],
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'esbuild'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
