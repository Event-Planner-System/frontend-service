# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config - MAKE SURE THIS FILE EXISTS!
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx config that listens on port 80
RUN rm -f /etc/nginx/conf.d/default.conf

# Create nginx.conf that listens on 8080
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 8080;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name _;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Update main nginx.conf to not require root
RUN sed -i 's/user  nginx;//g' /etc/nginx/nginx.conf && \
    sed -i 's/pid        \/var\/run\/nginx.pid;/pid        \/tmp\/nginx.pid;/g' /etc/nginx/nginx.conf

# Create necessary directories with proper permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /tmp \
    && chmod -R 777 /var/cache/nginx \
    && chmod -R 777 /tmp \
    && chmod -R 777 /usr/share/nginx/html \
    && chmod -R 777 /etc/nginx/conf.d

# Create entrypoint script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'if [ ! -z "$REACT_APP_API_URL" ]; then' >> /docker-entrypoint.sh && \
    echo '  echo "Replacing API URL in JS files..."' >> /docker-entrypoint.sh && \
    echo '  find /usr/share/nginx/html/static/js -type f -name "*.js" -exec sed -i "s|REACT_APP_API_URL_PLACEHOLDER|$REACT_APP_API_URL|g" {} + || true' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 8080

USER 1001

ENTRYPOINT ["/docker-entrypoint.sh"]