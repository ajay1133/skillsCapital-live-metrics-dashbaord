import {useEffect, useState } from 'react'
import {useMetricsStore } from './store'
import Dashboard from './Dashbroard'

const env = (import.meta as any)?.env || {};
const VITE_WS_BASE_URL = (env.VITE_WS_BASE_URL || 'ws://localhost:3000').replace(/\/$/, '');
const VITE_WS_URL = `${VITE_WS_BASE_URL}/metrics/stream`;
console.log('VITE_WS_BASE_URL=', VITE_WS_BASE_URL)
export default function App() {
  const setMetric = useMetricsStore((s: any) => s.setMetric)
  const clear = useMetricsStore((s: any) => s.clear)
  const [connected, setConnected] = useState(false)
  
  useEffect(() => {
    let ws: any = null
    let reconectTimer: any = null
    function connect() {
      if (!window?.WebSocket) {
        throw new Error('Window websocket not defined');
      }
      try {
        ws = new window.WebSocket(VITE_WS_URL);
      } catch (e) {
        console.error(e);
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
            console.log(msg);
            useMetricsStore.getState().setServices(
              msg.data?.services || []
            );
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    connect();
    return () => {
      try { if (ws) ws.close(); } catch (e) { /* ignore */ }
      if (reconectTimer) clearTimeout(reconectTimer)
      clear()
    };
  }, [setMetric, clear])

  return <Dashboard connected={connected} />
}