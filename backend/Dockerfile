# Steg 1: Bygg frontend
FROM node:lts-alpine AS frontend-builder
WORKDIR /app
COPY ../frontend/package*.json ./
RUN npm install
COPY ../frontend/ .
RUN npm run build

WORKDIR /app
RUN apk add --no-cache build-base
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=backend-builder /app/dist ./dist
COPY --from=frontend-builder /app/dist ./dist/public
CMD ["node", "dist/index.js"]
EXPOSE 3000
