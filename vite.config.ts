// vite.config.ts
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './', // Importante para que funcione al subirlo a la carpeta /admin
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // Redirige las llamadas que empiecen con /admin/api a tu backend PHP local
      '/admin/api': {
        target: 'http://localhost/las-trojes', // <--- AJUSTA ESTO A TU RUTA LOCAL DE PHP
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});