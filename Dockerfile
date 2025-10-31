# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy scripts directory needed for postinstall
COPY scripts ./scripts

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build the static export
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy the static export from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
