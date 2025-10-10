import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    // Bundle analyzer (only in build mode)
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  server: {
    port: 5173,
    open: true,
    strictPort: false,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  preview: {
    port: 4173,
    strictPort: false,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/messaging'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'query-vendor': ['@tanstack/react-query'],
        },
        // Generate clean filenames
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Asset inlining threshold (10kb)
    assetsInlineLimit: 10240,
    // Improve tree-shaking
    reportCompressedSize: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'react-hot-toast',
      'lucide-react',
      'framer-motion',
    ],
    exclude: ['@firebase/app'],
  },
  
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})

