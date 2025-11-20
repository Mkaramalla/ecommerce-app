@echo off
REM إعادة بناء المشروع - Command Prompt فقط
REM Usage: rebuild-cmd.bat

chcp 65001 >nul
echo ========================================
echo   إعادة بناء المشروع بالكامل
echo ========================================
echo.

REM إيقاف العمليات
echo [1/6] إيقاف العمليات...
taskkill /F /IM php.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Backend - حذف الملفات
echo.
echo [2/6] حذف ملفات Backend...
cd backend\laravel
if exist vendor (
    echo    حذف vendor...
    rmdir /s /q vendor
)
if exist node_modules (
    echo    حذف node_modules...
    rmdir /s /q node_modules
)
echo    تنظيف التخزين المؤقت...
php artisan cache:clear >nul 2>&1
php artisan config:clear >nul 2>&1
php artisan route:clear >nul 2>&1
php artisan view:clear >nul 2>&1

REM Backend - إعادة التثبيت
echo.
echo [3/6] تثبيت مكتبات Backend...
echo    قد يستغرق هذا بضع دقائق...
call composer install --no-interaction
if errorlevel 1 (
    echo    [خطأ] فشل تثبيت مكتبات Backend
    cd ..\..
    pause
    exit /b 1
)
echo    [نجح] تم تثبيت مكتبات Backend

REM Frontend - حذف الملفات
echo.
echo [4/6] حذف ملفات Frontend...
cd ..\..\frontend\ecommerce-ui
if exist node_modules (
    echo    حذف node_modules...
    rmdir /s /q node_modules
)
if exist dist (
    echo    حذف dist...
    rmdir /s /q dist
)
if exist .angular (
    echo    حذف .angular...
    rmdir /s /q .angular
)

REM Frontend - إعادة التثبيت
echo.
echo [5/6] تثبيت مكتبات Frontend...
echo    قد يستغرق هذا بضع دقائق...
call npm install
if errorlevel 1 (
    echo    [خطأ] فشل تثبيت مكتبات Frontend
    cd ..\..
    pause
    exit /b 1
)
echo    [نجح] تم تثبيت مكتبات Frontend

REM إعادة الإعداد
echo.
echo [6/6] إعادة إعداد Backend...
cd ..\..\backend\laravel
if not exist .env (
    echo    نسخ ملف .env...
    copy .env.example .env >nul
)
echo    توليد المفاتيح...
php artisan key:generate --force >nul 2>&1
php artisan jwt:secret --force >nul 2>&1

cd ..\..

echo.
echo ========================================
echo   اكتملت إعادة البناء بنجاح!
echo ========================================
echo.
echo الآن يمكنك تشغيل:
echo.
echo   Terminal 1: cd backend\laravel
echo              php artisan serve
echo.
echo   Terminal 2: cd frontend\ecommerce-ui
echo              ng serve
echo.
echo   ثم افتح المتصفح: http://localhost:4200
echo.
pause

