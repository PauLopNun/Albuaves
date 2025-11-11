FROM php:8.2-apache

# Instalar extensiones necesarias para SQLite3 y curl para healthcheck
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    curl \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Habilitar módulos necesarios
RUN a2enmod rewrite headers

# Cambiar el puerto de Apache de 80 a 9191
RUN sed -i 's/80/9191/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Permitir .htaccess en la configuración de Apache
RUN sed -i '/<Directory \/var\/www\/html>/,/<\/Directory>/s/AllowOverride None/AllowOverride All/' /etc/apache2/sites-available/000-default.conf

# Copiar todos los archivos necesarios al directorio web de Apache
COPY api.php /var/www/html/
COPY index.html /var/www/html/
COPY style.css /var/www/html/
COPY script.js /var/www/html/
COPY router.php /var/www/html/
COPY .htaccess /var/www/html/
COPY imgs/ /var/www/html/imgs/

# Establecer permisos correctos
RUN chmod -R 755 /var/www/html/ && \
    find /var/www/html/ -type f -exec chmod 644 {} \;

# Exponer el puerto
EXPOSE 9191

# Apache se inicia automáticamente
