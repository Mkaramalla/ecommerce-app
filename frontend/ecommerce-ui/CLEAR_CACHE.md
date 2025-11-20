# كيفية مسح الـ Cache وإعادة بناء التطبيق

## المشكلة
إذا كانت التغييرات لا تظهر في المتصفح، قد يكون السبب هو:
1. Browser cache
2. Angular build cache
3. Service worker cache

## الحلول

### 1. مسح Browser Cache
- اضغط `Ctrl + Shift + Delete` في المتصفح
- أو اضغط `Ctrl + F5` لإعادة تحميل الصفحة بدون cache
- أو افتح Developer Tools (F12) → Network tab → اختر "Disable cache"

### 2. إعادة بناء Angular
```bash
cd frontend/ecommerce-ui
rm -rf dist
rm -rf .angular
ng build
ng serve
```

### 3. مسح node_modules وإعادة التثبيت (إذا لزم الأمر)
```bash
cd frontend/ecommerce-ui
rm -rf node_modules
rm -rf .angular
npm install
ng serve
```

### 4. التحقق من أن التغييرات موجودة
- تأكد من أن ملف `product-list.component.html` يحتوي على:
  - `<h3 class="product-name">` للاسم
  - `<p class="product-description">` للوصف
- تأكد من عدم وجود `@if (isAdmin())` حول الاسم والوصف

