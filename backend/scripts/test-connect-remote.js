const WebSocket = require('ws');

const url = 'wss://skillscapital-live-metrics-dashbaord.onrender.com/metrics/stream';
console.log('Attempting connection to', url);

const ws = new WebSocket(url, {
  handshakeTimeout: 5000,
});

ws.on('open', () => {
  console.log('CONNECTED');
  ws.close();
});

ws.on('error', (err) => {
  console.error('ERROR', err && err.message ? err.message : err);
});

ws.on('close', (code, reason) => {
  console.log('CLOSED', code, reason && reason.toString && reason.toString());
  process.exit(0);
});

setTimeout(() => {
  console.log('Timeout waiting for connection, exiting');
  process.exit(2);
}, 10000);
