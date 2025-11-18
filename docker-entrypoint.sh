#!/bin/bash
set -e

# Configurar el puerto de Apache desde la variable de entorno PORT
# Render asigna el puerto dinámicamente, por defecto 10000
PORT="${PORT:-10000}"

echo "Configurando Apache para escuchar en puerto ${PORT}..."

# Actualizar configuración de Apache
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

echo "Apache configurado para puerto ${PORT}"

# Iniciar Apache
exec apache2-foreground
