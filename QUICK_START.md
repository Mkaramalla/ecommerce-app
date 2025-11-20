# Quick Start Guide - E-Commerce Application

## إعدادات قاعدة البيانات الجديدة

- **اسم Database:** `ecommerce`
- **Username:** `root` (المستخدم الافتراضي في XAMPP)
- **Password:** فارغ (بدون كلمة مرور)

---

## الخطوات السريعة

### 1. إعداد قاعدة البيانات

في XAMPP:
1. شغّل Apache و MySQL
2. افتح phpMyAdmin: http://localhost/phpmyadmin
3. اعمل قاعدة بيانات جديدة اسمها: `ecommerce`

أو استخدم MySQL Command:
```sql
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. إعداد Backend (Laravel)

```bash
cd backend/laravel
composer install
copy .env.example .env
```

**عدّل ملف `.env`:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

**ثم نفّذ:**
```bash
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend: **http://localhost:8000**

---

### 3. إعداد Frontend (Angular)

في terminal جديد:
```bash
cd frontend/ecommerce-ui
npm install
ng serve
```

Frontend: **http://localhost:4200**

---

## بيانات تسجيل الدخول

**Admin:**
- Email: `admin@example.com`
- Password: `password`

**User:**
- Email: `user@example.com`  
- Password: `password`

---

## ملاحظات مهمة

- تأكد أن XAMPP MySQL يعمل على **Port 3306**
- اسم Database: **ecommerce** (بدون `_db`)
- Username: **root** (بدون كلمة مرور)
- الـ Frontend يحتاج **Node.js 18+** و **Angular CLI**

---

## في حالة وجود مشاكل

### Error: Database connection failed
```bash
# تأكد من تشغيل MySQL في XAMPP
# تأكد من اسم Database: ecommerce
# تأكد من Username: root
# تأكد من Password فارغ
```

### Error: JWT Secret not found
```bash
php artisan jwt:secret
```

### Error: Permission denied
```bash
icacls "storage" /grant Everyone:F /T
icacls "bootstrap\cache" /grant Everyone:F /T
```

---

**الملف الكامل للتفاصيل: `SETUP_GUIDE.md`**



