# إعادة بناء المشروع بالكامل
# Usage: .\rebuild.ps1

Write-Host "🔄 بدء إعادة بناء المشروع..." -ForegroundColor Cyan

# إيقاف العمليات
Write-Host "`n⏹️ إيقاف العمليات..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*php*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Backend - حذف الملفات
Write-Host "`n🗑️ حذف ملفات Backend..." -ForegroundColor Yellow
Set-Location backend/laravel
if (Test-Path vendor) {
    Remove-Item -Recurse -Force vendor -ErrorAction SilentlyContinue
    Write-Host "   ✅ تم حذف vendor" -ForegroundColor Green
}
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Write-Host "   ✅ تم حذف node_modules" -ForegroundColor Green
}
php artisan cache:clear 2>$null | Out-Null
php artisan config:clear 2>$null | Out-Null
php artisan route:clear 2>$null | Out-Null
php artisan view:clear 2>$null | Out-Null
Write-Host "   ✅ تم مسح التخزين المؤقت" -ForegroundColor Green

# Backend - إعادة التثبيت
Write-Host "`n📦 تثبيت مكتبات Backend..." -ForegroundColor Green
Write-Host "   ⏳ قد يستغرق هذا بضع دقائق..." -ForegroundColor Yellow
composer install --no-interaction
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ تم تثبيت مكتبات Backend بنجاح" -ForegroundColor Green
} else {
    Write-Host "   ❌ فشل تثبيت مكتبات Backend" -ForegroundColor Red
    exit 1
}

# Frontend - حذف الملفات
Write-Host "`n🗑️ حذف ملفات Frontend..." -ForegroundColor Yellow
Set-Location ../../frontend/ecommerce-ui
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Write-Host "   ✅ تم حذف node_modules" -ForegroundColor Green
}
if (Test-Path dist) {
    Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
    Write-Host "   ✅ تم حذف dist" -ForegroundColor Green
}
if (Test-Path .angular) {
    Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
    Write-Host "   ✅ تم حذف .angular" -ForegroundColor Green
}

# Frontend - إعادة التثبيت
Write-Host "`n📦 تثبيت مكتبات Frontend..." -ForegroundColor Green
Write-Host "   ⏳ قد يستغرق هذا بضع دقائق..." -ForegroundColor Yellow
npm install --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ تم تثبيت مكتبات Frontend بنجاح" -ForegroundColor Green
} else {
    Write-Host "   ❌ فشل تثبيت مكتبات Frontend" -ForegroundColor Red
    exit 1
}

# إعادة الإعداد
Write-Host "`n⚙️ إعادة إعداد Backend..." -ForegroundColor Green
Set-Location ../../backend/laravel
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "   ✅ تم نسخ ملف .env" -ForegroundColor Green
}
php artisan key:generate --force 2>$null | Out-Null
php artisan jwt:secret --force 2>$null | Out-Null
Write-Host "   ✅ تم توليد المفاتيح" -ForegroundColor Green

# العودة للمجلد الرئيسي
Set-Location ../..

Write-Host "`n✅ اكتملت إعادة البناء بنجاح!" -ForegroundColor Green
Write-Host "`n🚀 الآن يمكنك تشغيل:" -ForegroundColor Cyan
Write-Host "   Terminal 1: cd backend/laravel" -ForegroundColor White
Write-Host "              php artisan serve" -ForegroundColor White
Write-Host "`n   Terminal 2: cd frontend/ecommerce-ui" -ForegroundColor White
Write-Host "              ng serve" -ForegroundColor White
Write-Host "`n   ثم افتح المتصفح: http://localhost:4200" -ForegroundColor Cyan

