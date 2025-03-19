import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/vite-app/', // Set base path for the assets
  // base: '/vite-app/', // Set base path for the assets
});
