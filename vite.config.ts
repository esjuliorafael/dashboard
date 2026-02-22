import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    // Ya no necesitas cargar env si no usas variables de entorno
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      // Borramos la sección 'define' que buscaba la API KEY
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});