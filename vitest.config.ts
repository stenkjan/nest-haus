import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/test/**/*.test.{ts,tsx}'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.{idea,git,cache,output,temp}/**',
      '{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      // Exclude showcase tests as requested
      'src/app/showcase/**/*.test.{ts,tsx}',
      'src/app/showcase/**/*.spec.{ts,tsx}',
      // Exclude konfigurator_old
      'konfigurator_old/**'
    ],
    // Add timeout for integration tests
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 