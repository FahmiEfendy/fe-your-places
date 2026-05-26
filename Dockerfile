# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_API_KEY
ARG VITE_OPENINARY_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY
ENV VITE_OPENINARY_URL=$VITE_OPENINARY_URL
RUN npm run build

# Production stage
FROM nginx:stable-alpine
# Copy build files to the subdirectory in nginx to match the base path
COPY --from=build /app/dist /usr/share/nginx/html
# Add nginx configuration to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
