import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from './scripts/compression-plugin.js'
import { copyFileSync, mkdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Plugin to copy sql.js WASM file to build output and serve in dev
function copySqlJsWasm() {
  return {
    name: 'copy-sqljs-wasm',
    configureServer(server) {
      // Serve WASM file in development
      server.middlewares.use('/assets/wasm/sql-wasm.wasm', (req, res, next) => {
        try {
          const wasmPath = join(__dirname, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')
          const wasmData = readFileSync(wasmPath)
          res.setHeader('Content-Type', 'application/wasm')
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          res.end(wasmData)
        } catch (error) {
          console.error('Error serving WASM file:', error)
          next(error)
        }
      })
    },
    writeBundle() {
      const wasmSrc = join(__dirname, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')
      const wasmDest = join(__dirname, 'dist', 'assets', 'wasm', 'sql-wasm.wasm')
      
      try {
        mkdirSync(dirname(wasmDest), { recursive: true })
        copyFileSync(wasmSrc, wasmDest)
        console.log('✅ Copied sql-wasm.wasm to dist/assets/wasm/')
      } catch (error) {
        console.error('❌ Error copying WASM file:', error)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copySqlJsWasm(),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(wasm)$/],
    }),
    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(wasm)$/],
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
  
  // Worker configuration for WASM support
  worker: {
    format: 'es',
    plugins: () => [],
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
          } else if (/wasm/i.test(ext)) {
            // WASM files should keep their names for proper loading
            return `assets/wasm/[name][extname]`;
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
    // Target modern browsers for better optimization
    target: 'es2015',
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
  
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.js',
      ],
    },
  },
})

