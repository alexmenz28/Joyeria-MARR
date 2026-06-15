# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY joyeria-frontend/package.json joyeria-frontend/package-lock.json ./
RUN npm ci
COPY joyeria-frontend/ ./
ARG REACT_APP_API_BASE_URL=http://localhost:5053
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Serve stage
FROM nginx:alpine AS final
COPY joyeria-frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
