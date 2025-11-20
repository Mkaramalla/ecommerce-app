# ⚡ البدء السريع - E-Commerce App

## 🎯 الخطوات السريعة (5 دقائق)

### 1️⃣ تشغيل XAMPP
- شغّل **Apache** و **MySQL** من XAMPP Control Panel

### 2️⃣ إنشاء قاعدة البيانات
افتح: http://localhost/phpmyadmin
- اضغط **"New"**
- اسم قاعدة البيانات: `ecommerce`
- اضغط **"Create"**

### 3️⃣ إعداد Backend

```bash
cd backend/laravel
composer install
copy .env.example .env
```

**عدّل `.env`:**
```env
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

```bash
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan db:seed
php artisan serve
```

✅ Backend يعمل على: **http://localhost:8000**

### 4️⃣ إعداد Frontend

**Terminal جديد:**
```bash
cd frontend/ecommerce-ui
npm install
ng serve
```

✅ Frontend يعمل على: **http://localhost:4200**

---

## 🔑 بيانات تسجيل الدخول

**Admin:**
- Email: `admin@example.com`
- Password: `password`

**User:**
- Email: `user@example.com`
- Password: `password`

---

## 📖 للتفاصيل الكاملة

راجع ملف: **`START_PROJECT.md`**

