import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project from /Mariage/ (the repo name), so
  // production asset URLs need that prefix. Dev keeps the root path.
  base: command === 'build' ? '/Mariage/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:4000', changeOrigin: true }
    }
  }
}));
