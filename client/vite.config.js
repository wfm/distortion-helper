import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import createHttpsLocalhost from 'https-localhost';

const certs = await createHttpsLocalhost().getCerts();

export default defineConfig({
  plugins: [react()],
  server: {
    https: certs,
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        secure: false,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
});
