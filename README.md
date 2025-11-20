# E-Commerce Application

A full-stack e-commerce web application built with Laravel (Backend API) and Angular (Frontend). This application provides a complete product management system with user authentication, role-based access control, and CRUD operations for products.

## Features

- **User Authentication**: JWT-based authentication system
- **Role-Based Access Control**: Admin and Regular User roles
- **Product Management**: Full CRUD operations for products
- **Product Display**: Responsive product listing with images
- **Admin Dashboard**: Admin-only product creation, editing, and deletion
- **User Interface**: Modern, responsive design with Angular Material
- **API Integration**: RESTful API with Laravel backend

## Technology Stack

### Backend
- **Framework**: Laravel 12
- **Authentication**: JWT (tymon/jwt-auth)
- **Database**: SQLite (development) / MySQL (production)
- **API**: RESTful API with CORS support

### Frontend
- **Framework**: Angular 19
- **UI Library**: Angular Material
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient with Interceptors
- **Routing**: Angular Router with Guards

## Prerequisites

Before you begin, ensure you have the following installed:

- **PHP**: 8.2 or higher
- **Composer**: Latest version
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Angular CLI**: 19.x
- **Git**: Latest version

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-app
```

### 2. Backend Setup (Laravel)

Navigate to the backend directory:

```bash
cd backend/laravel
```

Install PHP dependencies:

```bash
composer install
```

Copy the environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Configure JWT secret:

```bash
php artisan jwt:secret
```

Run database migrations:

```bash
php artisan migrate
```

Seed the database with sample data:

```bash
php artisan db:seed
```

Start the Laravel development server:

```bash
php artisan serve
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup (Angular)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend/ecommerce-ui
```

Install Node.js dependencies:

```bash
npm install
```

Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

Start the Angular development server:

```bash
ng serve
```

The frontend application will be available at `http://localhost:4200`

## Default Credentials

After seeding the database, you can use the following credentials:

### Admin User
- **Email**: admin@example.com
- **Password**: password

### Regular User
- **Email**: user@example.com
- **Password**: password

## Project Structure

```
ecommerce-app/
├── backend/
│   └── laravel/
│       ├── app/
│       │   ├── Http/
│       │   │   ├── Controllers/
│       │   │   └── Middleware/
│             │   └── Models/
│       ├── database/
│       │   ├── migrations/
│       │   └── seeders/
│       ├── routes/
│       │   └── api.php
│       └── config/
├── frontend/
│   └── ecommerce-ui/
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/
│       │   │   ├── features/
│       │   │   └── shared/
│       │   └── environments/
│       └── angular.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (Authenticated)
- `GET /api/products/{id}` - Get product by ID (Authenticated)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

## Development

### Running Tests

Backend tests:

```bash
cd backend/laravel
php artisan test
```

Frontend tests:

```bash
cd frontend/ecommerce-ui
ng test
```

### Building for Production

Frontend production build:

```bash
cd frontend/ecommerce-ui
ng build --configuration production
```

Backend optimization:

```bash
cd backend/laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Configuration

### Backend Environment Variables

Key environment variables in `.env`:

```env
APP_NAME="E-Commerce"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

JWT_SECRET=your-jwt-secret-key
```

### Frontend Environment Configuration

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured in Laravel `config/cors.php`

2. **JWT Token Issues**: Regenerate JWT secret:
   ```bash
   php artisan jwt:secret
   ```

3. **Database Connection**: Verify database file exists and permissions are correct

4. **Port Conflicts**: Change ports in `.env` (backend) or `angular.json` (frontend)

## Security Considerations

- JWT tokens are stored in localStorage
- API endpoints are protected with authentication middleware
- Admin routes require additional authorization middleware
- CORS is configured to allow requests from frontend origin only
- Password validation enforces minimum 8 characters

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the repository.

## Author

Developed as part of a technical assessment project.
