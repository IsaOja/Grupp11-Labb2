FROM node:lts-alpine AS builder

WORKDIR /app
RUN apk add --no-cache build-base
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run move-frontend
FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
EXPOSE 3000
