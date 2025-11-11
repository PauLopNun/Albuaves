FROM php:8.2-apache

# Instalar extensiones necesarias para SQLite3 y curl para healthcheck
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    curl \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Cambiar el puerto de Apache de 80 a 9191
RUN sed -i 's/80/9191/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Copiar archivos PHP al directorio web de Apache
COPY api.php /var/www/html/

# Exponer el puerto
EXPOSE 9191

# Apache se inicia automáticamente
