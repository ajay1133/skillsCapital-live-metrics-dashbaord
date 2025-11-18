import { useEffect, useState } from "react";
import { useMetricsStore } from "./store";
import Dashboard from "./Dashbroard";

const WS_URL = "ws://127.0.0.1:3000/metrics/stream";

export default function App() {
  const setMetric = useMetricsStore((s) => s.setMetric);
  const clear = useMetricsStore((s) => s.clear);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let ws: any = null;
    let reconnectTimer: any = null;
    function connect() {
      ws = new window.WebSocket(WS_URL);
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connect, 2000);
      };
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg && msg.type === "metrics") setMetric(msg.data);
          else if (msg && msg.type === "config") {
            const setServices = useMetricsStore.getState().setServices;
            setServices(msg.data.services || []);
          }
        } catch {}
      };
    }
    connect();
    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clear();
    };
  }, [setMetric, clear]);

  return <Dashboard connected={connected} />;
}
