import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
  // Load VITE_* env vars from this frontend folder so import.meta.env is correct
  loadEnv(mode, path.resolve(__dirname, '.'), 'VITE_');

  return defineConfig({
    root: path.resolve(__dirname, '.'),
    plugins: [react()],
    server: {
      proxy: {
        "/config": "http://127.0.0.1:3000",
        "/metrics/stream": {
          target: "ws://127.0.0.1:3000",
          ws: true
        }
      }
    }
  });
};
