# ================================
# Development Stage
# ================================
FROM php:8.2-fpm AS development

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Xdebug (development only)
ARG INSTALL_XDEBUG=false
RUN if [ ${INSTALL_XDEBUG} = true ]; then \
    pecl install xdebug-3.3.0 && \
    docker-php-ext-enable xdebug; \
fi

# Create non-root user
RUN groupadd -g 1000 www && \
    useradd -u 1000 -ms /bin/bash -g www www

# Set working directory
WORKDIR /var/www/laravel

# Copy composer files first for better caching
COPY --chown=www:www laravel/composer.json laravel/composer.lock* ./

# Install dependencies
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY --chown=www:www laravel/ .

# Generate optimized autoloader
RUN composer dump-autoload --optimize

# Set proper permissions
RUN chown -R www:www /var/www/laravel && \
    chmod -R 775 /var/www/laravel/storage /var/www/laravel/bootstrap/cache

# Switch to non-root user
USER www

# Expose port 9000 for PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]

# ================================
# Production Stage
# ================================
FROM php:8.2-fpm AS production

# Install system dependencies (production only)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Configure PHP for production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    echo "memory_limit = 256M" >> "$PHP_INI_DIR/conf.d/custom.ini" && \
    echo "max_execution_time = 60" >> "$PHP_INI_DIR/conf.d/custom.ini" && \
    echo "upload_max_filesize = 20M" >> "$PHP_INI_DIR/conf.d/custom.ini" && \
    echo "post_max_size = 20M" >> "$PHP_INI_DIR/conf.d/custom.ini" && \
    echo "opcache.enable=1" >> "$PHP_INI_DIR/conf.d/custom.ini" && \
    echo "opcache.memory_consumption=128" >> "$PHP_INI_DIR/conf.d/custom.ini" && \
    echo "opcache.interned_strings_buffer=8" >> "$PHP_INI_DIR/conf.d/custom.ini" && \
    echo "opcache.max_accelerated_files=10000" >> "$PHP_INI_DIR/conf.d/custom.ini" && \
    echo "opcache.revalidate_freq=2" >> "$PHP_INI_DIR/conf.d/custom.ini"

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create non-root user
RUN groupadd -g 1000 www && \
    useradd -u 1000 -ms /bin/bash -g www www

# Set working directory
WORKDIR /var/www/laravel

# Copy composer files first for better caching
COPY --chown=www:www laravel/composer.json laravel/composer.lock* ./

# Install production dependencies only
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --optimize-autoloader

# Copy application files
COPY --chown=www:www laravel/ .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --classmap-authoritative

# Optimize Laravel for production
RUN php artisan config:cache || true && \
    php artisan route:cache || true && \
    php artisan view:cache || true

# Set proper permissions
RUN chown -R www:www /var/www/laravel && \
    chmod -R 775 /var/www/laravel/storage /var/www/laravel/bootstrap/cache && \
    chmod -R 755 /var/www/laravel

# Switch to non-root user
USER www

# Expose port 9000 for PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
