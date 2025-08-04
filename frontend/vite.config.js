import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // This line is required.

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This 'resolve' block defines the '@' alias.
  resolve: {
    alias: {
      // This is the corrected syntax for ES Modules used by Vite.
      // It correctly resolves the path to your 'src' directory.
      '@': path.resolve(new URL(import.meta.url).pathname, './src'),
    },
  },
})
