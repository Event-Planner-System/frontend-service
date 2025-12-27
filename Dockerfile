# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/build ./build
COPY server.js .
RUN npm install express

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]