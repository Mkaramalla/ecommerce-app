# 🔧 حلول مشكلة تشغيل rebuild.ps1

## المشكلة: `command not found` أو `cannot be loaded`

هناك عدة أسباب محتملة:

---

## ✅ الحل 1: استخدام ملف Batch (الأسهل)

تم إنشاء ملف `rebuild.bat` - استخدمه بدلاً من PowerShell:

```cmd
rebuild.bat
```

أو:

```cmd
.\rebuild.bat
```

**هذا الحل يعمل في Command Prompt و PowerShell!**

---

## ✅ الحل 2: تشغيل PowerShell مع الصلاحيات

### الطريقة الأولى: تغيير ExecutionPolicy

```powershell
# تشغيل PowerShell كـ Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# ثم شغّل السكريبت
.\rebuild.ps1
```

### الطريقة الثانية: تجاوز ExecutionPolicy مؤقتاً

```powershell
powershell -ExecutionPolicy Bypass -File .\rebuild.ps1
```

---

## ✅ الحل 3: تشغيل الأوامر يدوياً

إذا لم تعمل السكريبتات، يمكنك تشغيل الأوامر يدوياً:

### Backend

```powershell
cd backend\laravel

# حذف المكتبات
if (Test-Path vendor) { Remove-Item -Recurse -Force vendor }
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }

# تنظيف التخزين المؤقت
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# إعادة التثبيت
composer install
```

### Frontend

```powershell
cd ..\..\frontend\ecommerce-ui

# حذف الملفات
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path dist) { Remove-Item -Recurse -Force dist }
if (Test-Path .angular) { Remove-Item -Recurse -Force .angular }

# إعادة التثبيت
npm install
```

### إعادة الإعداد

```powershell
cd ..\..\backend\laravel

# نسخ ملف البيئة
if (-not (Test-Path .env)) { Copy-Item .env.example .env }

# توليد المفاتيح
php artisan key:generate
php artisan jwt:secret
```

---

## ✅ الحل 4: استخدام Command Prompt

إذا كنت تستخدم Command Prompt:

```cmd
cd backend\laravel
if exist vendor rmdir /s /q vendor
composer install
php artisan cache:clear
php artisan config:clear

cd ..\..\frontend\ecommerce-ui
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
npm install

cd ..\..\backend\laravel
if not exist .env copy .env.example .env
php artisan key:generate
php artisan jwt:secret
```

---

## 🎯 الحل الموصى به

**استخدم `rebuild.bat` - إنه الأسهل والأكثر توافقاً!**

```cmd
rebuild.bat
```

---

## 📝 ملاحظات

1. **ملف Batch (`rebuild.bat`)** يعمل في:
   - Command Prompt
   - PowerShell
   - Windows Terminal

2. **ملف PowerShell (`rebuild.ps1`)** يحتاج:
   - PowerShell
   - ExecutionPolicy مناسب

3. **إذا استمرت المشاكل:**
   - استخدم الأوامر اليدوية (الحل 3)
   - أو استخدم ملف Batch

---

## 🔍 التحقق من نوع Shell

```powershell
# في PowerShell
$PSVersionTable.PSVersion

# في Command Prompt
echo %COMSPEC%
```

---

## 💡 نصيحة

**استخدم `rebuild.bat` - إنه الحل الأبسط والأكثر موثوقية!**

