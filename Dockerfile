FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
FROM nginx:alpine

# Copy React build
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Change ownership so non-root OpenShift user can write
RUN chown -R nginx:nginx /usr/share/nginx/html

# Runtime env replacement script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo 'if [ -n "$REACT_APP_BACKEND_URL" ]; then' >> /docker-entrypoint.sh && \
    echo '  echo "Injecting BACKEND URL into static files..."' >> /docker-entrypoint.sh && \
    echo '  find /usr/share/nginx/html/static/js -type f -name "*.js" -exec sed -i "s|REACT_APP_BACKEND_URL_PLACEHOLDER|$REACT_APP_BACKEND_URL|g" {} +' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

USER nginx

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
