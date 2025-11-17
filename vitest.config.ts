// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 30000,      // ← 30 secondes (au lieu de 5)
    hookTimeout: 30000,      // ← Pour beforeAll/afterAll
  }
})
