# Stage 1: Build the React application
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Capture the build-time ARG if passed, though OpenShift Injecting it via ENV is simpler
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the built assets to default nginx public folder
COPY --from=build /app/build /usr/share/nginx/html
# Copy our custom nginx config which has the non-root fixes
COPY nginx.conf /etc/nginx/nginx.conf

# Make sure permissions are correct for OpenShift (arbitrary user)
# We need to ensure /tmp is writable and nginx can access its files
RUN chmod -R 777 /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
