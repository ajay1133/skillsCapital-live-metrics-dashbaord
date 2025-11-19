import {useEffect, useState } from 'react'
import {useMetricsStore } from './store'
import Dashboard from './Dashbroard'

// Build-time env (Vite injects import.meta.env). Some setups may make this undefined
const BUILD_ENV = (import.meta as any)?.env || {};

// Runtime env that we'll fetch from /env.json as a fallback
type EnvMap = Record<string, string | undefined>;

function getWsBaseFromEnv(env: EnvMap | undefined) {
  const v = env?.['VITE_WS_BASE_URL'] || env?.['WS_BASE_URL'];
  return v ? String(v).replace(/\/$/, '') : undefined;
}

// Start with build-time value (may be undefined), fallback to runtime fetch, final fallback to localhost
let WS_BASE_URL = getWsBaseFromEnv(BUILD_ENV) || undefined;
let WS_URL = WS_BASE_URL ? `${WS_BASE_URL}/metrics/stream` : `ws://localhost:3000/metrics/stream`;
console.log('initial BUILD_ENV import.meta.env =', BUILD_ENV);
export default function App() {
  const setMetric = useMetricsStore((s: any) => s.setMetric)
  const clear = useMetricsStore((s: any) => s.clear)
  const [connected, setConnected] = useState(false)
  
  useEffect(() => {
    // If the build-time value wasn't available, fetch runtime config written to /env.json
    let ws: any = null
    let reconectTimer: any = null
    let stopped = false

    async function initAndConnect() {
      if (!WS_BASE_URL) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          const r = await fetch('/env.json', { cache: 'no-store', signal: controller.signal });
          clearTimeout(timeout);
          if (r.ok) {
            const json: EnvMap = await r.json();
            const v = getWsBaseFromEnv(json);
            if (v) {
              WS_BASE_URL = v;
              WS_URL = `${WS_BASE_URL}/metrics/stream`;
              console.log('loaded runtime env from /env.json:', json, 'using WS_URL=', WS_URL);
            } else {
              console.log('loaded /env.json but no VITE_WS_BASE_URL present', json);
            }
          } else {
            console.warn('Could not fetch /env.json, status=', r.status);
          }
        } catch (err) {
          console.warn('Could not load /env.json for runtime env, falling back to defaults', err);
        }
      }
      if (!stopped) connect();
    }

    function connect() {
      if (!window?.WebSocket) {
        throw new Error('Window websocket not defined');
      }
      try {
        // Recompute URL in case runtime fetch populated WS_URL
        const urlToUse = WS_URL;
        console.log('connecting websocket to', urlToUse);
        ws = new window.WebSocket(urlToUse);
      } catch (e) {
        console.error('websocket connect error', e);
      }  
      ws.onopen = () => setConnected(true)
      ws.onclose = () => {
        setConnected(false);
        reconectTimer = setTimeout(connect, 2000);
      }
      ws.onmessage = (e: any) => {
        try {
          const msg = JSON.parse(e?.data);
          if (msg?.type === "metrics") setMetric(msg.data)
          else if (msg?.type === "config") {
            // console.log(msg);
            useMetricsStore.getState().setServices(
              msg.data?.services || []
            );
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    // initialize then connect (will wait for /env.json when needed)
    initAndConnect();
    return () => {
      stopped = true;
      try { 
        if (ws) ws.close(); 
      } catch (e) { 
        console.error(e); 
      }
      if (reconectTimer) clearTimeout(reconectTimer)
      clear()
    };
  }, [setMetric, clear])

  return (
    <>
      <Dashboard connected={connected} />
    </>
  )
}
