import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

export default ({ mode }: { mode: string }) => {
  const filename: string = fileURLToPath(import.meta.url) || '';
  const dirname = path.dirname(filename);
  // Load .env from the frontend directory using dotenv to ensure process.env is populated
  const envPath = path.resolve(dirname, '.env');
  dotenv.config({ path: envPath });

  // Pick only VITE_ keys from process.env to inject into the client
  const envKeys = Object.keys(process.env || {}).filter((k) => k.startsWith('VITE_'));
  const loadedEnv: Record<string, string> = {};
  envKeys.forEach((k) => {
    loadedEnv[k] = process.env[k] as string;
  });
  console.log('vite (dotenv) loaded VITE_* env:', loadedEnv);
  // Also write a public/env.json so the browser can fetch runtime env values
  try {
    const publicDir = path.resolve(dirname, 'public');
    const outFile = path.resolve(publicDir, 'env.json');
    if (!require('fs').existsSync(publicDir)) require('fs').mkdirSync(publicDir, { recursive: true });
    require('fs').writeFileSync(outFile, JSON.stringify(loadedEnv, null, 2), { encoding: 'utf8' });
    console.log('Wrote public/env.json for client runtime to', outFile);
  } catch (e) {
    console.warn('Failed to write public/env.json:', e);
  }
  return defineConfig({
    root: path.resolve(dirname, '.'),
    plugins: [react()],
    // ensure Vite resolves env from this folder
    envDir: path.resolve(dirname, '.'),
    define: {
      // inject only VITE_ keys into import.meta.env for the client
      'import.meta.env': Object.keys(loadedEnv).length ? JSON.stringify(loadedEnv) : '{}'
    },
    server: {
      proxy: {
        '/config': 'http://127.0.0.1:3000',
        '/metrics/stream': {
          target: 'ws://127.0.0.1:3000',
          ws: true
        }
      }
    }
  });
};
