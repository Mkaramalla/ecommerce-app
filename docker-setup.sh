#!/bin/bash

# Docker Setup Script for Ecommerce Application
# This script helps initialize the Docker environment

set -e

echo "================================================"
echo "   Ecommerce Application - Docker Setup"
echo "================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo " Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo " Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Determine environment (default: production)
ENVIRONMENT=${1:-production}

if [ "$ENVIRONMENT" != "development" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo " Error: Invalid environment. Use 'development' or 'production'."
    echo "Usage: ./docker-setup.sh [development|production]"
    exit 1
fi

echo " Setting up environment: $ENVIRONMENT"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo " Creating .env file from template..."
    cat > .env << EOF
# Docker Environment Configuration
APP_NAME=EcommerceApp
APP_ENV=${ENVIRONMENT}
APP_DEBUG=$([ "$ENVIRONMENT" = "development" ] && echo "true" || echo "false")

# MySQL Configuration
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32 || echo "change_this_root_password")
MYSQL_DATABASE=ecommerce_db
MYSQL_USER=ecommerce_user
MYSQL_PASSWORD=$(openssl rand -base64 24 || echo "change_this_password")
MYSQL_PORT=3307

# Laravel Configuration
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=ecommerce_user
DB_PASSWORD=$(openssl rand -base64 24 || echo "change_this_password")

# Redis Configuration
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Backend Configuration
BACKEND_PORT=8000

# Frontend Configuration
FRONTEND_PORT=4200

# Build Target
BUILD_TARGET=${ENVIRONMENT}
EOF
    echo " .env file created successfully"
    echo "  IMPORTANT: Please update the passwords in .env file before running in production!"
else
    echo " .env file already exists"
fi
echo ""

# Create necessary directories
echo " Creating necessary directories..."
mkdir -p docker/mysql/logs
mkdir -p backend/laravel/storage/logs
mkdir -p backend/laravel/storage/framework/cache
mkdir -p backend/laravel/storage/framework/sessions
mkdir -p backend/laravel/storage/framework/views
mkdir -p backend/laravel/bootstrap/cache
echo " Directories created"
echo ""

# Set permissions for Laravel directories
echo " Setting proper permissions..."
chmod -R 775 backend/laravel/storage 2>/dev/null || true
chmod -R 775 backend/laravel/bootstrap/cache 2>/dev/null || true
echo " Permissions set"
echo ""

# Build and start containers
echo " Building Docker containers for $ENVIRONMENT environment..."
echo "This may take several minutes on the first run..."
echo ""

if [ "$ENVIRONMENT" = "development" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
    echo ""
    echo " Build completed"
    echo ""
    echo " Starting containers in development mode..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
else
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
    echo ""
    echo " Build completed"
    echo ""
    echo " Starting containers in production mode..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
fi

echo ""
echo " Waiting for services to be healthy..."
sleep 10

# Wait for MySQL to be ready
echo " Waiting for MySQL to be ready..."
timeout=60
while ! docker exec ecommerce_mysql mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD:-root_password} --silent &> /dev/null; do
    timeout=$((timeout - 1))
    if [ $timeout -le 0 ]; then
        echo "  Warning: MySQL took too long to start"
        break
    fi
    sleep 1
done

if [ $timeout -gt 0 ]; then
    echo " MySQL is ready"
fi
echo ""

# Run Laravel migrations
echo " Running Laravel migrations..."
docker exec ecommerce_backend php artisan migrate --force || echo "  Warning: Migrations failed or already run"
echo ""

# Generate Laravel application key if needed
echo " Generating Laravel application key..."
docker exec ecommerce_backend php artisan key:generate --force || echo "  Warning: Key generation failed or already set"
echo ""

# Clear and cache Laravel configuration
if [ "$ENVIRONMENT" = "production" ]; then
    echo " Optimizing Laravel for production..."
    docker exec ecommerce_backend php artisan config:cache || true
    docker exec ecommerce_backend php artisan route:cache || true
    docker exec ecommerce_backend php artisan view:cache || true
    echo " Laravel optimized"
fi
echo ""

echo "================================================"
echo "    Setup Complete!"
echo "================================================"
echo ""
echo "Your application is now running:"
echo ""
echo "   Frontend:  http://localhost:${FRONTEND_PORT:-4200}"
echo "   Backend:   http://localhost:${BACKEND_PORT:-8000}"
echo "    MySQL:    localhost:${MYSQL_PORT:-3307}"
echo "   Redis:     localhost:${REDIS_PORT:-6379}"
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose logs -f"
echo "  Stop:         docker-compose down"
echo "  Restart:      docker-compose restart"
echo "  Clean up:     docker-compose down -v (removes volumes)"
echo ""
echo "To run development environment, use:"
echo "  ./docker-setup.sh development"
echo ""
echo "================================================"

