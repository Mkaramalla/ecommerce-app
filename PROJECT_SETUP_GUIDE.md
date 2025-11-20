# E-Commerce Application - Setup and Deployment Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Project Overview](#project-overview)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Development Environment](#development-environment)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

---

## System Requirements

### Required Software
- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- Git 2.30 or higher
- Minimum 4GB RAM
- 10GB available disk space

### Supported Operating Systems
- Windows 10/11 (with WSL2)
- macOS 11 or higher
- Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+)

### Network Requirements
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 3306 (MySQL - internal)
- Port 6379 (Redis - internal)
- Port 4200 (Frontend - development)
- Port 8000 (Backend - development)

---

## Project Overview

### Architecture
The application follows a modern microservices architecture with the following components:

**Backend**
- Framework: Laravel 11
- Language: PHP 8.2
- Database: MySQL 8.0
- Cache: Redis 7
- Authentication: JWT (JSON Web Tokens)
- API: RESTful architecture

**Frontend**
- Framework: Angular (latest stable)
- UI Library: Angular Material
- State Management: Signals
- HTTP Client: Angular HttpClient
- Routing: Angular Router

**Infrastructure**
- Containerization: Docker
- Web Server: Nginx
- Process Manager: PHP-FPM
- Orchestration: Docker Compose

### Key Features
- User authentication with role-based access control
- Product management (CRUD operations)
- Admin and user role separation
- Responsive design for all devices
- RESTful API with comprehensive validation
- Secure JWT token handling
- CORS configuration for cross-origin requests

---

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-app
```

### Step 2: Verify Docker Installation

```bash
docker --version
docker-compose --version
```

Expected output should show Docker 20.10+ and Docker Compose 2.0+.

### Step 3: Configure Environment Files

#### Backend Environment Configuration

Create the backend environment file:

```bash
cp backend/laravel/.env.example backend/laravel/.env
```

Edit `backend/laravel/.env` with the following configuration:

```env
APP_NAME="E-Commerce API"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=ecommerce_user
DB_PASSWORD=secure_password_here

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

JWT_SECRET=
JWT_TTL=60
JWT_REFRESH_TTL=20160

CORS_ALLOWED_ORIGINS=http://localhost:4200
```

#### Frontend Environment Configuration

For development, edit `frontend/ecommerce-ui/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

For production, edit `frontend/ecommerce-ui/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://your-domain.com/api'
};
```

### Step 4: Set File Permissions

On Linux/macOS:

```bash
chmod +x docker-setup.sh
chmod -R 775 backend/laravel/storage
chmod -R 775 backend/laravel/bootstrap/cache
```

On Windows, ensure Docker Desktop has access to the project directory.

---

## Configuration

### Database Configuration

The default database credentials are defined in `docker-compose.yml`. For production, update these values:

```yaml
MYSQL_DATABASE: ecommerce
MYSQL_USER: ecommerce_user
MYSQL_PASSWORD: <strong-password>
MYSQL_ROOT_PASSWORD: <strong-root-password>
```

### JWT Configuration

Generate JWT secret key:

```bash
docker exec ecommerce_backend php artisan jwt:secret
```

This command updates the `.env` file with a secure JWT secret.

### CORS Configuration

Edit `backend/laravel/config/cors.php` to configure allowed origins:

```php
'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:4200')),
```

For multiple origins, use comma-separated values in `.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:4200,https://your-domain.com
```

---

## Database Setup

### Initial Migration

Run database migrations to create tables:

```bash
docker exec ecommerce_backend php artisan migrate
```

### Seed Sample Data

Populate the database with initial data:

```bash
docker exec ecommerce_backend php artisan db:seed
```

This creates:
- Admin user: admin@example.com (password: password)
- Regular user: user@example.com (password: password)
- 7 sample products

### Database Reset (Development Only)

To reset the database completely:

```bash
docker exec ecommerce_backend php artisan migrate:fresh --seed
```

Warning: This command drops all tables and recreates them. Use only in development.

---

## Running the Application

### Production Mode

#### Using Setup Script

```bash
./docker-setup.sh production
```

#### Manual Setup

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Verify Services

Check that all containers are running:

```bash
docker-compose ps
```

All services should show "Up" status with health check indicators.

### Access the Application

- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Health Check: http://localhost:8000/up

### View Logs

Monitor application logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

---

## Development Environment

### Starting Development Mode

#### Using Setup Script

```bash
./docker-setup.sh development
```

#### Manual Setup

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Development Features

Development mode includes:
- Hot reload for frontend (Angular)
- Volume mounts for live code updates
- Debug mode enabled
- Verbose logging
- Source maps enabled

### Running Artisan Commands

```bash
docker exec ecommerce_backend php artisan <command>
```

Common commands:
```bash
# Clear cache
docker exec ecommerce_backend php artisan cache:clear

# Clear config cache
docker exec ecommerce_backend php artisan config:clear

# Create migration
docker exec ecommerce_backend php artisan make:migration <name>

# Create controller
docker exec ecommerce_backend php artisan make:controller <name>

# Create model
docker exec ecommerce_backend php artisan make:model <name>
```

### Running NPM Commands (Frontend)

```bash
docker exec ecommerce_frontend npm <command>
```

Common commands:
```bash
# Install dependencies
docker exec ecommerce_frontend npm install

# Run tests
docker exec ecommerce_frontend npm test

# Build for production
docker exec ecommerce_frontend npm run build
```

### Accessing Database

Using Docker exec:

```bash
docker exec -it ecommerce_mysql mysql -u ecommerce_user -p
```

Enter the password from your environment configuration.

Using MySQL client:

```bash
mysql -h 127.0.0.1 -P 3306 -u ecommerce_user -p ecommerce
```

---

## Production Deployment

### Pre-Deployment Checklist

1. Update environment variables in `.env`
2. Set `APP_ENV=production` and `APP_DEBUG=false`
3. Configure strong database passwords
4. Set appropriate `CORS_ALLOWED_ORIGINS`
5. Configure proper domain in frontend environment
6. Set up SSL certificates
7. Review and update security settings
8. Perform full backup of existing data

### Building Production Images

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache
```

### Deploying to Server

#### Option 1: Docker Compose on Server

1. Copy project files to server
2. Set environment variables
3. Run production setup
4. Configure reverse proxy (if needed)

```bash
# On server
git clone <repository-url>
cd ecommerce-app
./docker-setup.sh production
```

#### Option 2: Container Registry

1. Build and tag images:

```bash
docker build -t your-registry/ecommerce-backend:latest -f backend/Dockerfile backend/
docker build -t your-registry/ecommerce-frontend:latest -f frontend/Dockerfile frontend/
```

2. Push to registry:

```bash
docker push your-registry/ecommerce-backend:latest
docker push your-registry/ecommerce-frontend:latest
```

3. Pull and run on server:

```bash
docker pull your-registry/ecommerce-backend:latest
docker pull your-registry/ecommerce-frontend:latest
docker-compose up -d
```

### SSL/TLS Configuration

For production, configure SSL certificates in Nginx:

Edit `docker/nginx/default.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Rest of configuration...
}
```

Mount SSL certificates in `docker-compose.prod.yml`:

```yaml
volumes:
  - ./ssl:/etc/nginx/ssl:ro
```

### Performance Optimization

#### Enable Redis Caching

Ensure Redis is configured in `.env`:

```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

#### Optimize Laravel

```bash
# Cache configuration
docker exec ecommerce_backend php artisan config:cache

# Cache routes
docker exec ecommerce_backend php artisan route:cache

# Cache views
docker exec ecommerce_backend php artisan view:cache
```

#### Optimize Angular Build

The production Dockerfile already includes:
- AOT (Ahead-of-Time) compilation
- Build optimization
- Tree shaking
- Minification

### Monitoring Setup

Monitor container health:

```bash
# Check container status
docker stats

# Monitor specific container
docker stats ecommerce_backend
```

Set up log aggregation:

```bash
# Export logs
docker-compose logs > application.log

# Monitor logs in real-time
docker-compose logs -f --tail=100
```

---

## Troubleshooting

### Common Issues

#### Issue: Containers fail to start

**Solution:**
1. Check Docker daemon is running
2. Verify port availability
3. Review logs: `docker-compose logs`
4. Check disk space: `df -h`

#### Issue: Database connection failed

**Solution:**
1. Verify MySQL container is running: `docker ps`
2. Check database credentials in `.env`
3. Wait for MySQL initialization (may take 30-60 seconds on first start)
4. Check MySQL logs: `docker logs ecommerce_mysql`

#### Issue: JWT authentication fails

**Solution:**
1. Generate JWT secret: `docker exec ecommerce_backend php artisan jwt:secret`
2. Clear config cache: `docker exec ecommerce_backend php artisan config:clear`
3. Verify JWT_SECRET is set in `.env`

#### Issue: CORS errors in browser

**Solution:**
1. Verify `CORS_ALLOWED_ORIGINS` in backend `.env`
2. Check frontend API URL configuration
3. Clear browser cache
4. Review `config/cors.php` settings

#### Issue: Frontend cannot connect to backend

**Solution:**
1. Verify backend is accessible: `curl http://localhost:8000/up`
2. Check nginx configuration
3. Verify API URL in frontend environment files
4. Check browser console for errors

#### Issue: Permission denied errors

**Solution:**

Linux/macOS:
```bash
sudo chown -R $USER:$USER backend/laravel/storage
sudo chown -R $USER:$USER backend/laravel/bootstrap/cache
chmod -R 775 backend/laravel/storage
chmod -R 775 backend/laravel/bootstrap/cache
```

Inside container:
```bash
docker exec ecommerce_backend chown -R www-data:www-data storage bootstrap/cache
```

### Health Checks

Verify service health:

```bash
# Backend health
curl http://localhost:8000/up

# Frontend accessibility
curl http://localhost:4200

# MySQL connectivity
docker exec ecommerce_mysql mysqladmin ping -h localhost

# Redis connectivity
docker exec ecommerce_redis redis-cli ping
```

### Performance Issues

If the application is slow:

1. Check container resource usage: `docker stats`
2. Increase Docker resources in Docker Desktop settings
3. Verify database indexes are created
4. Enable query caching in MySQL
5. Monitor Redis memory usage
6. Check for slow queries in Laravel logs

---

## Maintenance

### Backup Procedures

#### Database Backup

```bash
# Create backup
docker exec ecommerce_mysql mysqldump -u ecommerce_user -p ecommerce > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i ecommerce_mysql mysql -u ecommerce_user -p ecommerce < backup_file.sql
```

#### Volume Backup

```bash
# Backup all volumes
docker run --rm -v ecommerce_mysql_data:/data -v $(pwd):/backup ubuntu tar czf /backup/mysql_data_backup.tar.gz /data
```

### Updates and Upgrades

#### Updating Application Code

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run migrations
docker exec ecommerce_backend php artisan migrate

# Clear caches
docker exec ecommerce_backend php artisan cache:clear
docker exec ecommerce_backend php artisan config:clear
```

#### Updating Dependencies

Backend (Laravel):
```bash
docker exec ecommerce_backend composer update
```

Frontend (Angular):
```bash
docker exec ecommerce_frontend npm update
```

### Security Updates

Regularly update base images:

```bash
# Pull latest base images
docker pull php:8.2-fpm-alpine
docker pull mysql:8.0
docker pull redis:7-alpine
docker pull nginx:alpine
docker pull node:20-alpine

# Rebuild with updated images
docker-compose build --no-cache
```

### Log Rotation

Prevent logs from consuming disk space:

```bash
# Configure Docker logging driver in docker-compose.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Monitoring Disk Usage

```bash
# Check Docker disk usage
docker system df

# Clean up unused resources
docker system prune -a

# Remove unused volumes
docker volume prune
```

### Database Optimization

```bash
# Optimize tables
docker exec ecommerce_mysql mysqlcheck -u root -p --optimize ecommerce

# Analyze tables
docker exec ecommerce_mysql mysqlcheck -u root -p --analyze ecommerce
```

---

## Additional Resources

### Default Credentials

After running seeders, the following accounts are available:

**Administrator Account**
- Email: admin@example.com
- Password: password
- Role: admin
- Permissions: Full access to all features

**Standard User Account**
- Email: user@example.com
- Password: password
- Role: user
- Permissions: Read-only access to products

Important: Change these passwords immediately in production environments.

### API Endpoints

**Authentication**
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- POST /api/auth/refresh - Refresh JWT token
- GET /api/auth/me - Get current user

**Products**
- GET /api/products - List all products (authenticated)
- GET /api/products/:id - Get single product (authenticated)
- POST /api/products - Create product (admin only)
- PUT /api/products/:id - Update product (admin only)
- DELETE /api/products/:id - Delete product (admin only)

### Directory Structure

```
ecommerce-app/
├── backend/
│   ├── laravel/               # Laravel application
│   │   ├── app/              # Application code
│   │   ├── config/           # Configuration files
│   │   ├── database/         # Migrations and seeders
│   │   ├── routes/           # API routes
│   │   └── .env              # Environment configuration
│   └── Dockerfile            # Backend container definition
├── frontend/
│   ├── ecommerce-ui/         # Angular application
│   │   ├── src/              # Source code
│   │   │   ├── app/         # Application components
│   │   │   └── environments/ # Environment configs
│   │   └── nginx.conf        # Frontend nginx config
│   └── Dockerfile            # Frontend container definition
├── docker/
│   ├── nginx/                # Backend nginx config
│   └── mysql/                # MySQL initialization scripts
├── docker-compose.yml        # Base compose configuration
├── docker-compose.dev.yml    # Development overrides
├── docker-compose.prod.yml   # Production overrides
└── docker-setup.sh           # Setup automation script
```

### Support and Documentation

For additional information:
- Laravel Documentation: https://laravel.com/docs
- Angular Documentation: https://angular.io/docs
- Docker Documentation: https://docs.docker.com
- Angular Material: https://material.angular.io

---

## Conclusion

This guide covers the complete setup, deployment, and maintenance procedures for the E-Commerce application. Follow each section carefully to ensure a successful deployment. For production environments, pay special attention to security configurations, backup procedures, and monitoring setup.

Regular maintenance and updates are essential for keeping the application secure and performant. Establish a maintenance schedule that includes backups, security updates, and performance monitoring.



