"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const METRIC_INTERVEAL = 1000;
let servicCount = 5;
let services = Array.from({
    length: servicCount
}, (a, i) => `Service ${i + 1}`);
function randMetric() {
    return {
        cpu: Math.floor(Math.random() * 101),
        memory: Math.floor(Math.random() * 101),
        errorRate: Number((Math.random() * 10).toFixed(2))
    };
}
function getServicesMetrics() {
    return services.map((serviceName) => ({
        serviceName, ...randMetric()
    }));
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get('/config', (req, res) => {
    const { n } = req.query || {};
    if (n !== null || n !== undefined) {
        const num = parseInt(n, 10);
        if (!isNaN(num) && num > 0) {
            servicCount = num;
            services = Array.from({ length: servicCount }, (a, i) => `Service ${i + 1}`);
        }
    }
    const cfg = { serviceCount: servicCount, services };
    res.json(cfg);
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
        data: { serviceCount: servicCount, services }
    }));
    function sendMetrics() {
        if (!active)
            return;
        ws.send(JSON.stringify({ type: 'metrics', data: getServicesMetrics() }));
        setTimeout(sendMetrics, METRIC_INTERVEAL);
    }
    sendMetrics();
    ws.on('close', () => {
        active = false;
        console.log('Websocket client disconnected, clients size =', wss.clients.size);
    });
});
const port = Number(process.env.PORT) || 3000;
server.listen(port, '127.0.0.1', () => {
    console.log(`BackEnd listening on port: ${port}`);
});
