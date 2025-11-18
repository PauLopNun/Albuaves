# Dockerfile para despliegue en Render (solo API PHP + Web Interface)
FROM php:8.2-apache

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean

# Habilitar módulos de Apache necesarios
RUN a2enmod rewrite headers

# Copiar archivos PHP (API + interfaz web)
COPY php/ /var/www/html/

# Copiar base de datos SQLite
COPY db/albuaves.db /var/www/html/db/albuaves.db

# Dar permisos a la base de datos
RUN chmod 644 /var/www/html/db/albuaves.db && \
    chown www-data:www-data /var/www/html/db/albuaves.db

# Copiar script de inicio
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exponer puerto (Render usa 10000 por defecto)
EXPOSE 10000

# Comando de inicio
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
