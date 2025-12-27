# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL:-REACT_APP_BACKEND_URL_PLACEHOLDER} npm run build

# Production nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Entry script to replace placeholder with real env var at runtime
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo 'echo "Injecting backend URL: $REACT_APP_BACKEND_URL"' >> /entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|REACT_APP_BACKEND_URL_PLACEHOLDER|$REACT_APP_BACKEND_URL|g" {} +' >> /entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

USER 1001
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]