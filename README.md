# Live Metrics Dashboard

## Project Overview
A fullstack TypeScrpt web app for real-time monitoring of simulated backend service metrics

## Tec Stack
- BackEnd: Node.js, Express, TypeScript
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Websocket
- Docker

## System Architecture
- Backend simulates N services, emitting metrics every second, with following sample structure 
{
    &quot;serviceName&quot;: &quot;auth-service&quot;,
    &quot;cpu&quot;: 62,
    &quot;memory&quot;: 48,
    &quot;errorRate&quot;: 2.1
}.
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
Build and run: `docker build -t live-metrics-dashboard . && docker run -p 3000:3000 -p 5173:5173 live-metrics-dashboard`

## Performance Optimization
- React memoization (React.memo, useCallback, useMemo)
- Efficient state management (Context API)
- Proper cleanup of timers/streams for avoiding memory leaks