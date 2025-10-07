import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProd = mode === 'production' || process.env.NODE_ENV === 'production';
  return {
    base: isProd ? '/portfolio/' : '/',
    plugins: [react()],
  };
});
