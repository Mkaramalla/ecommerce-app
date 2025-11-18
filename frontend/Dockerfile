FROM node:22.20-alpine AS build

WORKDIR /app

# نسخ package.json و package-lock.json من المجلد الداخلي
COPY ecommerce-ui/package*.json ./

# تثبيت الـ dependencies
RUN npm install

# نسخ باقي ملفات المشروع
COPY ecommerce-ui/ .

# بناء مشروع Angular
RUN npm run build

# --- مرحلة Production ---
FROM nginx:alpine

# نسخ ملفات الـ build من المرحلة السابقة
COPY --from=build /app/dist/ecommerce-ui /usr/share/nginx/html

# نسخ ملف إعدادات Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
