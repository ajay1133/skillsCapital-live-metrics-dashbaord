## Build the frontend build
FROM node:20-alpine as build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend .
RUN npm run build

## Build the backend build
FROM node:20-alpine as build-backend
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend .
RUN npm run build

## Copy build to app folder, install dependencies & run the app 
FROM node:20-alpine
WORKDIR /app
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
COPY --from=build-backend /app/backend/dist ./backend/dist
COPY backend/package.json backend/package-lock.json ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN npm install --prefix backend --omit=dev
EXPOSE 3000 5173
CMD ["node", "backend/dist/index.js"]
