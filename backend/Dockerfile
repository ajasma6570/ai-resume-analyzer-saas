# Step 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for installing dependencies
COPY package*.json ./

# Install all dependencies (including devDependencies for typescript compilation)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Compile TS code and rewrite path aliases using tsc-alias
RUN npm run build

# Step 2: Run Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Install PM2 globally to manage multiple services
RUN npm install -g pm2

# Copy the built files and PM2 config from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

# Expose the API Gateway Port (defaults to 3000, mapped dynamically on Render)
EXPOSE 3000

# Start all microservices concurrently
CMD ["pm2-runtime", "ecosystem.config.js"]
