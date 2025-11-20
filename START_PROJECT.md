# 🚀 دليل تشغيل المشروع - خطوة بخطوة

## المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:
- ✅ **XAMPP** (Apache + MySQL)
- ✅ **PHP 8.2+** (موجود في XAMPP)
- ✅ **Composer** (مدير حزم PHP)
- ✅ **Node.js 18+** و **npm**
- ✅ **Angular CLI** (`npm install -g @angular/cli`)

---

## 📋 الخطوات الكاملة

### الخطوة 1: تشغيل XAMPP

1. افتح **XAMPP Control Panel**
2. شغّل **Apache** و **MySQL**
3. تأكد أن كلاهما يعمل (أخضر)

---

### الخطوة 2: إنشاء قاعدة البيانات

#### الطريقة الأولى: عبر phpMyAdmin
1. افتح المتصفح: http://localhost/phpmyadmin
2. اضغط على **"New"** (جديد) في القائمة الجانبية
3. أدخل اسم قاعدة البيانات: `ecommerce`
4. اختر **Collation**: `utf8mb4_unicode_ci`
5. اضغط **"Create"** (إنشاء)

#### الطريقة الثانية: عبر MySQL Command Line
```sql
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### الخطوة 3: إعداد Backend (Laravel)

#### 3.1 الانتقال إلى مجلد Laravel
```bash
cd backend/laravel
```

#### 3.2 تثبيت المكتبات
```bash
composer install
```
⏱️ قد يستغرق 2-3 دقائق

#### 3.3 نسخ ملف البيئة
```bash
copy .env.example .env
```

#### 3.4 تعديل ملف `.env`

افتح ملف `.env` وعدّل الإعدادات التالية:

```env
APP_NAME="E-Commerce API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:4200
```

**ملاحظة:** اترك `DB_PASSWORD` فارغاً إذا لم تضع كلمة مرور لـ MySQL

#### 3.5 توليد مفتاح التطبيق
```bash
php artisan key:generate
```

#### 3.6 توليد مفتاح JWT
```bash
php artisan jwt:secret
```

#### 3.7 تشغيل Migrations (إنشاء الجداول)
```bash
php artisan migrate
```

#### 3.8 ملء قاعدة البيانات بالبيانات الأولية
```bash
php artisan db:seed
```

هذا سينشئ:
- 👤 **Admin**: `admin@example.com` / `password`
- 👤 **User**: `user@example.com` / `password`
- 📦 **منتجات تجريبية**

#### 3.9 تشغيل خادم Laravel
```bash
php artisan serve
```

✅ **Backend جاهز على:** http://localhost:8000

**⚠️ اترك هذا Terminal مفتوحاً!**

---

### الخطوة 4: إعداد Frontend (Angular)

**افتح Terminal جديد** (لا تغلق Terminal الـ Backend!)

#### 4.1 الانتقال إلى مجلد Angular
```bash
cd frontend/ecommerce-ui
```

#### 4.2 تثبيت المكتبات
```bash
npm install
```
⏱️ قد يستغرق 3-5 دقائق

#### 4.3 التحقق من إعدادات API

افتح ملف `src/environments/environment.ts` وتأكد من:
```typescript
apiUrl: 'http://localhost:8000/api'
```

إذا كان Backend على منفذ آخر، غيّر الرقم هنا.

#### 4.4 تشغيل خادم Angular
```bash
ng serve
```

أو:
```bash
npm start
```

✅ **Frontend جاهز على:** http://localhost:4200

**⚠️ اترك هذا Terminal مفتوحاً أيضاً!**

---

## 🎉 تشغيل المشروع

### الوصول للتطبيق

1. افتح المتصفح
2. اذهب إلى: **http://localhost:4200**

### تسجيل الدخول

**حساب Admin:**
- 📧 Email: `admin@example.com`
- 🔑 Password: `password`
- ✨ يمكنه: إنشاء، تعديل، حذف المنتجات

**حساب User:**
- 📧 Email: `user@example.com`
- 🔑 Password: `password`
- 👀 يمكنه: عرض المنتجات فقط

---

## ✅ التحقق من أن كل شيء يعمل

### Backend API
- Health Check: http://localhost:8000/up
- API Base: http://localhost:8000/api

### Frontend
- التطبيق: http://localhost:4200

---

## 🔧 حل المشاكل الشائعة

### ❌ خطأ: Database connection failed

**الحل:**
1. تأكد أن MySQL يعمل في XAMPP
2. تأكد من اسم قاعدة البيانات: `ecommerce`
3. تأكد من Username: `root`
4. تأكد من Password: فارغ (أو ضع كلمة المرور في `.env`)

### ❌ خطأ: JWT Secret not found

**الحل:**
```bash
cd backend/laravel
php artisan jwt:secret
```

### ❌ خطأ: Port 8000 already in use

**الحل:**
```bash
# استخدم منفذ آخر
php artisan serve --port=8001
```
ثم غيّر `APP_URL` في `.env` إلى `http://localhost:8001`

### ❌ خطأ: Port 4200 already in use

**الحل:**
```bash
# استخدم منفذ آخر
ng serve --port=4300
```

### ❌ خطأ: Cannot connect to API

**الحل:**
1. تأكد أن Backend يعمل على http://localhost:8000
2. تحقق من CORS في `backend/laravel/config/cors.php`
3. تحقق من `apiUrl` في `frontend/ecommerce-ui/src/environments/environment.ts`

### ❌ خطأ: Permission denied (Windows)

**الحل:**
```bash
cd backend/laravel
icacls "storage" /grant Everyone:F /T
icacls "bootstrap\cache" /grant Everyone:F /T
```

---

## 📝 ملاحظات مهمة

1. **يجب تشغيل Backend و Frontend معاً**
   - Terminal 1: `php artisan serve` (Backend)
   - Terminal 2: `ng serve` (Frontend)

2. **تغييرات في `.env` تحتاج إعادة تشغيل Backend**

3. **Angular يعيد التحميل تلقائياً عند تغيير الكود**

4. **Laravel يحتاج إعادة تشغيل لبعض التغييرات**

---

## 🎯 ملخص سريع

```bash
# Terminal 1 - Backend
cd backend/laravel
composer install
copy .env.example .env
# عدّل .env (قاعدة البيانات)
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan db:seed
php artisan serve

# Terminal 2 - Frontend
cd frontend/ecommerce-ui
npm install
ng serve

# افتح المتصفح
# http://localhost:4200
```

---

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع قسم "حل المشاكل" أعلاه
2. تحقق من سجلات Laravel: `backend/laravel/storage/logs/laravel.log`
3. افتح Console في المتصفح (F12) للتحقق من أخطاء Frontend

---

**🎉 كل شيء جاهز! استمتع بالتطوير!**

