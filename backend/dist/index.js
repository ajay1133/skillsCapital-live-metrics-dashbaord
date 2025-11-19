"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const METRIC_INTERVEAL_MS = 1000;
let serviceCount = 5;
let services = Array.from({
    length: serviceCount
}, (a, i) => `Service ${i + 1}`);
function getRandMetric() {
    return {
        cpu: Math.floor(Math.random() * 101),
        memory: Math.floor(Math.random() * 101),
        errorRate: Number((Math.random() * 10).toFixed(2))
    };
}
function getServicesMetrics() {
    return services.map((serviceName) => ({
        serviceName, ...getRandMetric()
    }));
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get('/config', (req, res) => {
    const { n } = req.query || {};
    if (n !== null || n !== undefined) {
        const num = Math.floor(Number(n));
        if (!isNaN(num) && num > 0) {
            serviceCount = num;
            services = Array.from({ length: serviceCount }, (a, i) => `Service ${i + 1}`);
        }
    }
    const cfg = { serviceCount, services };
    res.status(200).json(cfg);
    const msg = JSON.stringify({ type: 'config', data: cfg });
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN)
            client.send(msg);
    });
});
let server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({
    server,
    path: '/metrics/stream'
});
wss.on('connection', (ws) => {
    let active = true;
    console.log('Websocket client connected, clients size =', wss.clients.size);
    ws.send(JSON.stringify({
        type: 'config',
        data: { serviceCount, services }
    }));
    sendMetrics(ws, active);
    ws.on('close', () => {
        active = false;
        console.log('Websocket client disconnected, clients size =', wss.clients.size);
    });
});
function sendMetrics(ws, active) {
    if (!active)
        return;
    ws.send(JSON.stringify({ type: 'metrics', data: getServicesMetrics() }));
    setTimeout(sendMetrics, METRIC_INTERVEAL_MS);
}
const port = Number(process.env.PORT) || 3000;
server.listen(port, '127.0.0.1', () => {
    console.log(`BackEnd listening on port: ${port}`);
});
