FROM node:lts-alpine
COPY . /app
WORKDIR /app
RUN apk add --no-cache build-base
RUN npm install
EXPOSE 8080
ENTRYPOINT [ "node","index.js" ]

# # Steg 1
# FROM node:lts-alpine AS frontend-builder
# WORKDIR /app
# COPY frontend/package*.json ./
# RUN npm install
# COPY frontend/ .
# RUN npm run build

# # Steg 2
# FROM node:lts-alpine AS backend-builder
# WORKDIR /app
# RUN apk add --no-cache build-base
# COPY backend/package*.json ./
# RUN npm install
# COPY backend/ .
# RUN npm run build

# # Steg 3
# FROM node:lts-alpine
# WORKDIR /app
# COPY backend/package*.json ./
# RUN npm install --only=production
# COPY --from=backend-builder /app/dist ./dist
# COPY --from=frontend-builder /app/dist ./dist/public
# CMD ["node", "dist/index.js"]
# EXPOSE 3000
