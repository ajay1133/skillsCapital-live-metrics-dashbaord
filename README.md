# SkillsCapital Live Metrics Dashboard

## Project Overview
A fullstack TypeScrpt web app for real-time monitoring of simulated backend service metrics

## Tec Stack
- BackEnd: Node.js, Express, TypeScript
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Websocket
- Docker

## System Architecture
- Backend simulates N services, emitting metrics every second, with following sample structure:  
{  
&nbsp;&nbsp;&quot;serviceName&quot;: &quot;auth-service&quot;,  
&nbsp;&nbsp;&quot;cpu&quot;: 62,  
&nbsp;&nbsp;&quot;memory&quot;: 48,  
&nbsp;&nbsp;&quot;errorRate&quot;: 2.1  
}
- Metrics streamed to frontend via Websockets
- Frontend displays metrics in responsive dashboard.

## Setup

## Local development

## Backend, do following commands
1. cd backend
2. npm install
3. npm run dev

## Frontend
1. cd frontend
2. npm install
3. npm run dev

## Docker
Build and run: `docker build -t live-metrics-dashboard <Absolute-Path-To-APP> && docker run -p 3000:3000 -p 5173:5173 live-metrics-dashboard`

## Performance Optimization
- React memoization (React.memo, useCallback, useMemo)
- Efficient state management (Context API)
- Proper cleanup of timers/streams for avoiding memory leaks

## Scaling
- We would a separate data service for socket servers
- Store the state of the socket servers so message to one can be broadcasted to other servers as well and we could use Kafka because it persists the data even when one of Kafka node goes down, we could also use redis for small applications but if redis server goes down we would loose the message.
- A load balancer in front of the socket servers would distribute the load effectively between socket servers.   
