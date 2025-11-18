# ================================
# Development Stage
# ================================
FROM node:22.20-alpine AS development

WORKDIR /app

# Copy package files first for better caching
COPY ecommerce-ui/package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY ecommerce-ui/ .

# Expose Angular dev server port
EXPOSE 4200

# Development command (can be overridden in docker-compose)
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

# ================================
# Build Stage
# ================================
FROM node:22.20-alpine AS build

WORKDIR /app

# Copy package files
COPY ecommerce-ui/package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application files
COPY ecommerce-ui/ .

# Build Angular application for production
RUN npm run build -- --configuration production

# ================================
# Production Stage
# ================================
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built application from build stage
COPY --from=build /app/dist/ecommerce-ui /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add nginx configuration for security headers
RUN echo 'server_tokens off;' > /etc/nginx/conf.d/security.conf

# Create non-root user (nginx already runs as nginx user)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
