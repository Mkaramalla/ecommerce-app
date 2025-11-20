# E-Commerce Application - Local Setup Guide

This guide will help you run the application directly on your local machine without Docker.

## Prerequisites

### Required Software
1. **PHP 8.2 or higher**
   - Download from: https://windows.php.net/download/
   - Or use XAMPP: https://www.apachefriends.org/

2. **Composer**
   - Download from: https://getcomposer.org/download/

3. **MySQL 8.0 or higher**
   - Included in XAMPP
   - Or download from: https://dev.mysql.com/downloads/mysql/

4. **Node.js 18+ and npm**
   - Download from: https://nodejs.org/

5. **Angular CLI**
   ```bash
   npm install -g @angular/cli
   ```

---

## Setup Instructions

### Step 1: Database Setup

#### Option A: Using XAMPP

1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin: http://localhost/phpmyadmin
4. Create a new database named `ecommerce`

#### Option B: Using MySQL Command Line

```sql
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Step 2: Backend Setup (Laravel)

#### 2.1 Navigate to Laravel Directory

```bash
cd backend/laravel
```

#### 2.2 Install Dependencies

```bash
composer install
```

#### 2.3 Configure Environment

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` file with your database credentials:

```env
APP_NAME="E-Commerce API"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file

JWT_SECRET=
JWT_TTL=60

CORS_ALLOWED_ORIGINS=http://localhost:4200
```

#### 2.4 Generate Application Key

```bash
php artisan key:generate
```

#### 2.5 Generate JWT Secret

```bash
php artisan jwt:secret
```

#### 2.6 Run Migrations

```bash
php artisan migrate
```

#### 2.7 Seed Database

```bash
php artisan db:seed
```

This will create:
- Admin user: `admin@example.com` / `password`
- Regular user: `user@example.com` / `password`
- Sample products

#### 2.8 Start Laravel Development Server

```bash
php artisan serve
```

The backend API will be available at: **http://localhost:8000**

Keep this terminal window open.

---

### Step 3: Frontend Setup (Angular)

Open a **new terminal window**.

#### 3.1 Navigate to Frontend Directory

```bash
cd frontend/ecommerce-ui
```

#### 3.2 Install Dependencies

```bash
npm install
```

This may take 3-5 minutes.

#### 3.3 Configure API URL

The API URL is already configured in:
- `src/environments/environment.ts` → `http://localhost:8000/api`

No changes needed if backend runs on port 8000.

#### 3.4 Start Angular Development Server

```bash
ng serve
```

Or:

```bash
npm start
```

The frontend will be available at: **http://localhost:4200**

Keep this terminal window open.

---

## Access the Application

### Frontend
Open your browser and go to: **http://localhost:4200**

### Login Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `password`
- Can create, edit, delete products

**User Account:**
- Email: `user@example.com`
- Password: `password`
- Can only view products

### Backend API
- Base URL: http://localhost:8000
- API Endpoint: http://localhost:8000/api
- Health Check: http://localhost:8000/up

---

## Common Commands

### Backend (Laravel)

```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Run migrations
php artisan migrate

# Reset database (WARNING: Deletes all data)
php artisan migrate:fresh --seed

# Create new migration
php artisan make:migration create_table_name

# Create new controller
php artisan make:controller ControllerName

# Create new model
php artisan make:model ModelName
```

### Frontend (Angular)

```bash
# Start development server
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name
```

---

## Project Structure

```
ecommerce-app/
├── backend/
│   └── laravel/              # Laravel application
│       ├── app/
│       │   ├── Http/
│       │   │   ├── Controllers/
│       │   │   ├── Middleware/
│       │   │   └── Requests/
│       │   └── Models/
│       ├── config/
│       ├── database/
│       │   ├── migrations/
│       │   └── seeders/
│       ├── routes/
│       │   └── api.php
│       └── .env
└── frontend/
    └── ecommerce-ui/         # Angular application
        ├── src/
        │   ├── app/
        │   │   ├── core/
        │   │   │   ├── guards/
        │   │   │   ├── interceptors/
        │   │   │   └── services/
        │   │   ├── features/
        │   │   │   ├── auth/
        │   │   │   ├── layout/
        │   │   │   └── products/
        │   │   └── shared/
        │   └── environments/
        └── angular.json
```

---

## Troubleshooting

### Backend Issues

#### Error: "Class 'Tymon\JWTAuth\Providers\LaravelServiceProvider' not found"

Solution:
```bash
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

#### Error: "SQLSTATE[HY000] [1045] Access denied"

Solution:
- Check database credentials in `.env`
- Verify MySQL is running (XAMPP Control Panel)
- Test connection: `mysql -u root`

#### Error: "No application encryption key has been specified"

Solution:
```bash
php artisan key:generate
```

#### Error: "The stream or file could not be opened"

Solution:
```bash
# On Windows
icacls "storage" /grant Everyone:F /T
icacls "bootstrap\cache" /grant Everyone:F /T

# Or recreate directories
rmdir /s /q storage\logs
mkdir storage\logs
```

### Frontend Issues

#### Error: "ng: command not found"

Solution:
```bash
npm install -g @angular/cli
```

#### Error: "Module not found"

Solution:
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
```

#### Error: "Port 4200 is already in use"

Solution:
```bash
# Kill the process using the port
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Or use different port
ng serve --port 4300
```

#### Error: Cannot connect to backend API

Solution:
- Verify backend is running on http://localhost:8000
- Check CORS settings in `backend/laravel/config/cors.php`
- Check API URL in `frontend/ecommerce-ui/src/environments/environment.ts`

---

## Development Workflow

### Starting Development

1. Open Terminal 1:
   ```bash
   cd backend/laravel
   php artisan serve
   ```

2. Open Terminal 2:
   ```bash
   cd frontend/ecommerce-ui
   ng serve
   ```

3. Open browser: http://localhost:4200

### Making Changes

**Backend:**
- Models: `backend/laravel/app/Models/`
- Controllers: `backend/laravel/app/Http/Controllers/`
- Routes: `backend/laravel/routes/api.php`
- Migrations: `backend/laravel/database/migrations/`

**Frontend:**
- Components: `frontend/ecommerce-ui/src/app/features/`
- Services: `frontend/ecommerce-ui/src/app/core/services/`
- Guards: `frontend/ecommerce-ui/src/app/core/guards/`
- Routes: `frontend/ecommerce-ui/src/app/app.routes.ts`

---

## API Endpoints

### Authentication

```
POST   /api/auth/login      - Login user
POST   /api/auth/logout     - Logout user (requires token)
POST   /api/auth/refresh    - Refresh JWT token (requires token)
GET    /api/auth/me         - Get current user info (requires token)
```

### Products

```
GET    /api/products        - List all products (requires auth)
GET    /api/products/:id    - Get single product (requires auth)
POST   /api/products        - Create product (admin only)
PUT    /api/products/:id    - Update product (admin only)
DELETE /api/products/:id    - Delete product (admin only)
```

---

## Production Build

### Backend

1. Set environment to production:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. Optimize Laravel:
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Frontend

1. Build for production:
   ```bash
   ng build --configuration production
   ```

2. Output will be in: `frontend/ecommerce-ui/dist/ecommerce-ui/browser/`

3. Serve with any web server (Apache, Nginx, IIS)

---

## Notes

- Default ports: Backend (8000), Frontend (4200)
- Both servers must be running simultaneously
- Changes to backend `.env` require server restart
- Angular hot-reloads automatically on code changes
- Laravel requires `php artisan serve` restart for some changes

---

## Support

For issues:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Check Laravel logs: `backend/laravel/storage/logs/laravel.log`
4. Check browser console for frontend errors

---

**You're all set! Happy coding!** 🚀

