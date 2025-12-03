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

# Crear directorios en el servidor
echo ""
echo -e "${YELLOW}[2/6] Creando directorios en el servidor...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    mkdir -p ~/albuaves/php/imgs/{aves,sightings}
    mkdir -p ~/albuaves/db
    chmod -R 755 ~/albuaves
    echo "✓ Directorios creados"
ENDSSH
echo -e "${GREEN}✓ Directorios creados${NC}"

# Subir archivos PHP
echo ""
echo -e "${YELLOW}[3/6] Subiendo archivos PHP...${NC}"
scp php/*.php php/*.html php/*.css php/*.js ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/php/ 2>/dev/null || echo "  (algunos archivos pueden no existir)"
echo -e "${GREEN}✓ Archivos PHP subidos${NC}"

# Subir imágenes de aves
echo ""
echo -e "${YELLOW}[4/6] Subiendo imágenes de aves...${NC}"
scp php/imgs/aves/* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/php/imgs/aves/ 2>/dev/null || echo "  (algunas imágenes pueden no existir)"
echo -e "${GREEN}✓ Imágenes de aves subidas${NC}"

# Subir archivos de base de datos
echo ""
echo -e "${YELLOW}[5/6] Subiendo archivos de base de datos...${NC}"
scp db/*.sql db/*.db ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/db/ 2>/dev/null || echo "  (algunos archivos pueden no existir)"
echo -e "${GREEN}✓ Archivos de BD subidos${NC}"

# Ejecutar migración y reiniciar servidor
echo ""
echo -e "${YELLOW}[6/6] Ejecutando migración y reiniciando servidor...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    cd ~/albuaves/php

    # Ejecutar migración si existe
    if [ -f migrate-db.php ]; then
        php migrate-db.php
        echo "✓ Migración completada"
    else
        echo "⚠ No se encontró migrate-db.php, omitiendo migración"
    fi

    # Reiniciar servidor PHP
    pkill -f "php -S.*:8000" || echo "  (no había servidor corriendo)"
    nohup php -S 0.0.0.0:8000 > ~/albuaves/server.log 2>&1 &
    echo "✓ Servidor PHP reiniciado en puerto 8000"
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
