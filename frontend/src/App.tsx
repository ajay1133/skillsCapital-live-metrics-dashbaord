import {useEffect, useState } from 'react';
import {useMetricsStore } from './store'
import Dashboard from './Dashbroard'

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000'
const WS_URL = `${BACKEND_URL.replace(/^http/, 'ws')}/metrics/stream`

export default function App() {
  const setMetric = useMetricsStore((s) => s.setMetric)
  const clear = useMetricsStore((s) => s.clear)
  const [connected, setConnected] = useState(false)
  
  
  useEffect(() => {
    let ws: any = null
    let reconectTimer: any = null
    function connect() {
      ws = new window.WebSocket(WS_URL);
      ws.onopen = () => setConnected(true)
      ws.onclose = () => {
        setConnected(false);
        reconectTimer = setTimeout(connect, 2000);
      }
      ws.onmessage = (e) => {
        try {
          let msg = JSON.parse(e.data);
          if(msg && msg.type === "metrics") setMetric(msg.data)
          else if (msg && msg.type === "config") {
            const setServices = useMetricsStore
              .getState().setServices
            setServices(msg.data.services || []);
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    connect()
    return () => {
      if(ws) ws.close()
      if(reconectTimer) clearTimeout(reconectTimer)
      clear()
    };
  }, [setMetric, clear])

  return <Dashboard connected={connected} />
}