# Step 1: Build Stage
FROM node:20-alpine AS builder

# Pass environment variables needed for build time
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the React application
RUN npm run build

# Step 2: Serve Stage (using Nginx)
FROM nginx:alpine

# Copy the build output to Nginx HTML folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for React Router (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
