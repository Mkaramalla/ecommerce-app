# 🔧 أوامر إعادة البناء - Command Prompt (CMD)

إذا كنت تستخدم **Command Prompt** وليس PowerShell، استخدم هذه الأوامر:

---

## ✅ الطريقة 1: استخدام ملف Batch

```cmd
rebuild.bat
```

أو:

```cmd
rebuild-cmd.bat
```

---

## ✅ الطريقة 2: الأوامر اليدوية (CMD)

### Backend

```cmd
cd backend\laravel

REM حذف المكتبات
if exist vendor rmdir /s /q vendor
if exist node_modules rmdir /s /q node_modules

REM تنظيف التخزين المؤقت
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

REM إعادة التثبيت
composer install
```

### Frontend

```cmd
cd ..\..\frontend\ecommerce-ui

REM حذف الملفات
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .angular rmdir /s /q .angular

REM إعادة التثبيت
npm install
```

### إعادة الإعداد

```cmd
cd ..\..\backend\laravel

REM نسخ ملف البيئة
if not exist .env copy .env.example .env

REM توليد المفاتيح
php artisan key:generate
php artisan jwt:secret
```

---

## 📝 الفرق بين CMD و PowerShell

### Command Prompt (CMD)
- استخدام: `rmdir /s /q` لحذف المجلدات
- استخدام: `if exist` للتحقق من وجود الملفات
- استخدام: `copy` لنسخ الملفات

### PowerShell
- استخدام: `Remove-Item -Recurse -Force` لحذف المجلدات
- استخدام: `Test-Path` للتحقق من وجود الملفات
- استخدام: `Copy-Item` لنسخ الملفات

---

## 🎯 الحل الموصى به

**استخدم ملف Batch:**

```cmd
rebuild.bat
```

هذا يعمل في Command Prompt و PowerShell!

---

## ⚠️ ملاحظات

1. **في CMD:** استخدم `rmdir /s /q` بدلاً من `Remove-Item`
2. **في CMD:** استخدم `if exist` بدلاً من `Test-Path`
3. **في CMD:** استخدم `copy` بدلاً من `Copy-Item`

---

## 🔍 معرفة نوع Shell

```cmd
REM في Command Prompt
echo %COMSPEC%

REM في PowerShell
$PSVersionTable.PSVersion
```

