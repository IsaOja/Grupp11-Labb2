FROM node:lts-alpine
COPY . /app
WORKDIR /app
RUN apk add --no-cache build-base
RUN npm install
EXPOSE 8080
ENTRYPOINT [ "node","index.js" ]