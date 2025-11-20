FROM nginx:mainline-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:mainline-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
