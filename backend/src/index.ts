import express from 'express'
import cors from 'cors'
import {WebSocketServer, WebSocket} from 'ws'
import http from 'http'

const METRIC_INTERVEAL_MS = 1000
let serviceCount = 5;
let services = Array.from({
    length: serviceCount}, 
    (a, i)=>`Service ${i + 1}`
)
function getRandMetric() {
  return {
    cpu:Math.floor(Math.random() * 101),
    memory:Math.floor(Math.random() * 101),
    errorRate:Number((Math.random() * 10).toFixed(2))
  }
}
function getServicesMetrics() {
  return services.map((serviceName)=>({
    serviceName,...getRandMetric()
  }))
}

const app = express()
app.use(cors())

app.get('/config',(req, res)=>{
  const {n}= req.query || {}
  if (n !== null || n !== undefined) {
    const num = Math.floor(Number(n))
    if (!isNaN(num) && num > 0){
      serviceCount = num;
      services = Array.from(
        {length: serviceCount}, 
        (a, i)=>`Service ${i + 1}`
      )
    }
  }
  const cfg = {serviceCount, services}
  res.status(200).json(cfg)
  const msg = JSON.stringify({type:'config',data:cfg})
  wss.clients.forEach((client)=>{
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  })
})


let server = http.createServer(app)
const wss = new WebSocketServer({ 
    server, 
    path:'/metrics/stream' 
});
wss.on('connection',(ws: WebSocket)=>{
  let active = true;
  console.log('Websocket client connected, clients size =', wss.clients.size)
  
  ws.send(JSON.stringify({
    type:'config',
    data:{serviceCount, services}
  }))
  
  sendMetrics(ws, active)
  
  ws.on('close', () => {
    active = false;
    console.log(
        'Websocket client disconnected, clients size =', wss.clients.size
    )
  })
})

function sendMetrics(ws: WebSocket, active: boolean) {
  if (!active) return;
  // only send if socket is still open
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'metrics', data: getServicesMetrics() }))
  }
  // schedule next send using a closure so ws and active are passed correctly
  setTimeout(() => sendMetrics(ws, active), METRIC_INTERVEAL_MS)
}

const port = Number(process.env.PORT) || 3000
server.listen(port,'127.0.0.1', () => {
  console.log(`BackEnd listening on port: ${port}`)
})