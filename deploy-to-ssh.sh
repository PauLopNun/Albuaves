#!/bin/bash

# Script de deployment automático al servidor SSH
# Uso: ./deploy-to-ssh.sh

set -e  # Salir si hay algún error

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración del servidor
SERVER_USER="pau"
SERVER_HOST="192.168.3.113"
SERVER_PATH="~/albuaves"

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}  Deployment to SSH Server (192.168.3.113)${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# Verificar conexión SSH
echo -e "${YELLOW}[1/4] Verificando conexión SSH...${NC}"
if ssh -o ConnectTimeout=5 ${SERVER_USER}@${SERVER_HOST} exit 2>/dev/null; then
    echo -e "${GREEN}✓ Conexión SSH exitosa${NC}"
else
    echo -e "${RED}✗ Error: No se puede conectar al servidor SSH${NC}"
    echo "  Verifica que el servidor esté encendido y accesible"
    exit 1
fi

# Subir archivos PHP
echo ""
echo -e "${YELLOW}[2/4] Subiendo archivos PHP...${NC}"
scp php/sightings-api.php ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/php/
scp php/migrate-db.php ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/php/
scp php/index.html ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/php/
scp php/script.js ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/php/
scp php/style.css ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/php/
echo -e "${GREEN}✓ Archivos PHP subidos${NC}"

# Subir archivos de base de datos
echo ""
echo -e "${YELLOW}[3/4] Subiendo archivos de base de datos...${NC}"
scp db/albuaves-db-create.sql ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/db/
scp db/add-sighting-image.sql ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/db/
echo -e "${GREEN}✓ Archivos de BD subidos${NC}"

# Ejecutar migración y crear directorios en el servidor
echo ""
echo -e "${YELLOW}[4/4] Ejecutando migración y configuración en el servidor...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    cd ~/albuaves

    # Crear directorio para imágenes
    mkdir -p php/imgs/sightings
    chmod 755 php/imgs/sightings
    echo "✓ Directorio imgs/sightings creado"

    # Ejecutar migración
    cd php
    php migrate-db.php

    echo "✓ Migración completada"
ENDSSH

echo -e "${GREEN}✓ Configuración completada${NC}"

# Resumen final
echo ""
echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}✓ Deployment completado exitosamente!${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo "Accede a la aplicación en:"
echo "  → http://192.168.3.113:8000/"
echo ""
echo "Verifica que:"
echo "  - Se vean las 3 pestañas nuevas"
echo "  - Puedas registrar un avistamiento"
echo "  - Puedas subir imágenes"
echo ""
