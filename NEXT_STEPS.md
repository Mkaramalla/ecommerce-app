# 🎯 الخطوة التالية - تشغيل المشروع

## ✅ حالة المشروع الحالية

بناءً على فحص المشروع:
- ✅ ملف `.env` موجود في Backend
- ✅ `node_modules` مثبت في Frontend
- ✅ `vendor` مثبت في Backend (على الأرجح)

---

## 🚀 الخطوات التالية (خطوة واحدة!)

### الخطوة الوحيدة المطلوبة: **تشغيل الخوادم**

#### 1. تشغيل Backend (Laravel)

افتح **Terminal/PowerShell**:

```powershell
cd backend/laravel
php artisan serve
```

✅ يجب أن ترى: `Laravel development server started: http://localhost:8000`

**⚠️ اترك هذا Terminal مفتوحاً!**

---

#### 2. تشغيل Frontend (Angular)

افتح **Terminal/PowerShell جديد** (لا تغلق الأول):

```powershell
cd frontend/ecommerce-ui
ng serve
```

✅ يجب أن ترى: `Application bundle generation complete`

**⚠️ اترك هذا Terminal مفتوحاً أيضاً!**

---

## 🎉 فتح التطبيق

1. افتح المتصفح
2. اذهب إلى: **http://localhost:4200**

---

## 🔑 تسجيل الدخول

**Admin Account:**
- Email: `admin@example.com`
- Password: `password`

**User Account:**
- Email: `user@example.com`
- Password: `password`

---

## ⚠️ إذا واجهت مشاكل

### خطأ: "Database connection failed"

**الحل:**
1. تأكد أن **MySQL** يعمل في XAMPP
2. تأكد من قاعدة البيانات `ecommerce` موجودة
3. تحقق من ملف `.env` في `backend/laravel`:
   ```env
   DB_DATABASE=ecommerce
   DB_USERNAME=root
   DB_PASSWORD=
   ```

### خطأ: "JWT Secret not found"

**الحل:**
```powershell
cd backend/laravel
php artisan jwt:secret
```

### خطأ: "No tables found"

**الحل:**
```powershell
cd backend/laravel
php artisan migrate
php artisan db:seed
```

### خطأ: "Port 8000 already in use"

**الحل:**
- أغلق التطبيق الذي يستخدم المنفذ 8000
- أو استخدم منفذ آخر: `php artisan serve --port=8001`

---

## 📋 قائمة التحقق السريعة

قبل التشغيل، تأكد من:

- [ ] XAMPP يعمل (Apache + MySQL)
- [ ] قاعدة البيانات `ecommerce` موجودة
- [ ] ملف `.env` موجود في `backend/laravel`
- [ ] تم تثبيت المكتبات (`composer install` و `npm install`)

---

## 🎯 ملخص

**كل ما تحتاجه الآن هو:**

1. Terminal 1: `cd backend/laravel` → `php artisan serve`
2. Terminal 2: `cd frontend/ecommerce-ui` → `ng serve`
3. افتح المتصفح: **http://localhost:4200**

**هذا كل شيء! 🚀**

---

## 📚 للمزيد من التفاصيل

- **دليل كامل:** `START_PROJECT.md`
- **بدء سريع:** `QUICK_START_AR.md`
- **دليل الإعداد:** `SETUP_GUIDE.md`

