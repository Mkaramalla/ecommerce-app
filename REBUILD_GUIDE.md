# 🔄 دليل إعادة بناء المشروع (Rebuild)

## 📋 ما هو Rebuild؟

إعادة بناء المشروع تعني حذف جميع الملفات المولدة وإعادة تثبيت كل شيء من الصفر.

---

## 🚀 إعادة بناء كاملة (Clean Rebuild)

### الخطوة 1: إيقاف الخوادم

أغلق جميع Terminals التي تشغل:
- `php artisan serve`
- `ng serve`

---

### الخطوة 2: حذف الملفات المولدة

#### Backend (Laravel)

```powershell
cd backend/laravel

# حذف vendor (المكتبات المثبتة)
Remove-Item -Recurse -Force vendor -ErrorAction SilentlyContinue

# حذف node_modules (إن وجد)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# حذف ملفات التخزين المؤقت
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# حذف ملفات التخزين المؤقت الأخرى
Remove-Item -Recurse -Force bootstrap/cache/* -ErrorAction SilentlyContinue
```

#### Frontend (Angular)

```powershell
cd frontend/ecommerce-ui

# حذف node_modules
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# حذف ملفات البناء
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# حذف ملفات التخزين المؤقت
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
```

---

### الخطوة 3: إعادة تثبيت المكتبات

#### Backend

```powershell
cd backend/laravel

# تثبيت المكتبات
composer install

# أو إذا أردت تحديث كل شيء
composer update
```

#### Frontend

```powershell
cd frontend/ecommerce-ui

# تثبيت المكتبات
npm install

# أو إذا أردت تحديث كل شيء
npm update
```

---

### الخطوة 4: إعادة إعداد Backend

```powershell
cd backend/laravel

# نسخ ملف البيئة (إذا لم يكن موجوداً)
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}

# توليد مفتاح التطبيق
php artisan key:generate

# توليد مفتاح JWT
php artisan jwt:secret

# تشغيل Migrations
php artisan migrate

# ملء قاعدة البيانات
php artisan db:seed
```

---

### الخطوة 5: تشغيل المشروع

#### Terminal 1 - Backend
```powershell
cd backend/laravel
php artisan serve
```

#### Terminal 2 - Frontend
```powershell
cd frontend/ecommerce-ui
ng serve
```

---

## 🔧 إعادة بناء سريعة (Quick Rebuild)

إذا كنت تريد فقط إعادة بناء بدون حذف كل شيء:

### Backend
```powershell
cd backend/laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
composer dump-autoload
```

### Frontend
```powershell
cd frontend/ecommerce-ui
ng build --configuration development
```

---

## 🗑️ إعادة بناء كاملة مع حذف قاعدة البيانات

⚠️ **تحذير:** هذا سيحذف جميع البيانات!

```powershell
cd backend/laravel

# حذف وإعادة إنشاء قاعدة البيانات
php artisan migrate:fresh --seed

# أو إذا أردت حذف قاعدة البيانات يدوياً
# افتح phpMyAdmin وحذف قاعدة البيانات `ecommerce`
# ثم أنشئها من جديد
```

---

## 📝 سكريبت PowerShell كامل لإعادة البناء

احفظ هذا في ملف `rebuild.ps1`:

```powershell
# إعادة بناء المشروع بالكامل

Write-Host "🔄 بدء إعادة بناء المشروع..." -ForegroundColor Cyan

# إيقاف العمليات
Write-Host "`n⏹️ إيقاف العمليات..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*php*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Backend - حذف الملفات
Write-Host "`n🗑️ حذف ملفات Backend..." -ForegroundColor Yellow
Set-Location backend/laravel
Remove-Item -Recurse -Force vendor -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
php artisan cache:clear 2>$null
php artisan config:clear 2>$null

# Backend - إعادة التثبيت
Write-Host "`n📦 تثبيت مكتبات Backend..." -ForegroundColor Green
composer install

# Frontend - حذف الملفات
Write-Host "`n🗑️ حذف ملفات Frontend..." -ForegroundColor Yellow
Set-Location ../../frontend/ecommerce-ui
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue

# Frontend - إعادة التثبيت
Write-Host "`n📦 تثبيت مكتبات Frontend..." -ForegroundColor Green
npm install

# إعادة الإعداد
Write-Host "`n⚙️ إعادة إعداد Backend..." -ForegroundColor Green
Set-Location ../../backend/laravel
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✅ تم نسخ ملف .env" -ForegroundColor Green
}
php artisan key:generate --force
php artisan jwt:secret --force

Write-Host "`n✅ اكتملت إعادة البناء!" -ForegroundColor Green
Write-Host "`n🚀 الآن يمكنك تشغيل:" -ForegroundColor Cyan
Write-Host "   Terminal 1: cd backend/laravel && php artisan serve" -ForegroundColor White
Write-Host "   Terminal 2: cd frontend/ecommerce-ui && ng serve" -ForegroundColor White
```

**استخدام السكريبت:**
```powershell
.\rebuild.ps1
```

---

## 🎯 حالات استخدام Rebuild

### 1. عند حدوث أخطاء غريبة
```powershell
# إعادة بناء سريعة
cd backend/laravel
composer dump-autoload
php artisan cache:clear
```

### 2. بعد تحديث المكتبات
```powershell
# Backend
cd backend/laravel
composer update
php artisan migrate

# Frontend
cd frontend/ecommerce-ui
npm update
```

### 3. عند تغيير إعدادات كبيرة
```powershell
# إعادة بناء كاملة
# اتبع الخطوات في "إعادة بناء كاملة" أعلاه
```

### 4. قبل إرسال المشروع
```powershell
# تنظيف شامل
cd backend/laravel
php artisan optimize:clear
composer dump-autoload

cd ../../frontend/ecommerce-ui
ng build --configuration production
```

---

## ⚠️ ملاحظات مهمة

1. **احتفظ بنسخة احتياطية** من ملف `.env` قبل إعادة البناء
2. **لا تحذف** ملف `.env` إلا إذا كنت تريد إعادة الإعداد من الصفر
3. **احتفظ بنسخة** من قاعدة البيانات إذا كانت تحتوي على بيانات مهمة
4. **إعادة البناء الكاملة** قد تستغرق 5-10 دقائق

---

## 🔍 التحقق من نجاح إعادة البناء

### Backend
```powershell
cd backend/laravel
php artisan --version
composer --version
php artisan route:list
```

### Frontend
```powershell
cd frontend/ecommerce-ui
ng version
npm list --depth=0
```

---

## 📚 للمزيد

- **إعداد أولي:** `SETUP_GUIDE.md`
- **تشغيل المشروع:** `START_PROJECT.md`
- **حل المشاكل:** راجع قسم Troubleshooting في `SETUP_GUIDE.md`

