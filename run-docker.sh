#!/bin/bash

set -e  # Salir si hay algún error

echo "======================================"
echo "  Iniciando Albuaves con Docker"
echo "======================================"
echo ""

# Detener y limpiar contenedores anteriores
echo "[1/4] Limpiando contenedores anteriores..."
docker-compose down 2>/dev/null || true

# Construir las imágenes
echo ""
echo "[2/4] Construyendo imágenes Docker..."
if ! docker-compose build; then
    echo ""
    echo "ERROR: Fallo al construir las imágenes Docker"
    exit 1
fi

# Iniciar los servicios
echo ""
echo "[3/4] Iniciando servicios..."
if ! docker-compose up -d api-php; then
    echo ""
    echo "ERROR: Fallo al iniciar el servicio API"
    exit 1
fi

# Esperar a que la API esté lista
echo ""
echo "[4/4] Esperando a que la API esté lista..."
echo "📡 API disponible en: http://localhost:9191/api.php"
echo "Esperando healthcheck..."
sleep 10

# Ejecutar el cliente Java
echo ""
echo "======================================"
echo "  Ejecutando cliente Java"
echo "======================================"
echo ""
docker-compose up client-java

echo ""
echo "======================================"
echo "  Proceso completado"
echo "======================================"
echo ""

# Mensaje visual mejorado con enlaces y ejemplos
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ ALBUAVES INICIADO CORRECTAMENTE              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 ACCESO A LA APLICACIÓN:"
echo ""
echo "🌐 Interfaz Web (Usuarios finales):"
echo "   URL: http://localhost:9191"
echo "   Descripción: Galería visual de aves acuáticas"
echo ""
echo "💻 API REST (Desarrolladores):"
echo "   Base URL: http://localhost:9191/api.php"
echo "   Descripción: Acceso programático a la base de datos de aves"
echo ""
echo "────────────────────────────────────────────────────────────────────"
echo ""
echo "📝 EJEMPLOS DE USO:"
echo ""
echo "  • Obtener todas las aves:"
echo "    curl 'http://localhost:9191/api.php?action=list'"
echo ""
echo "  • Consultar un ave específica (ID=1):"
echo "    curl 'http://localhost:9191/api.php?action=get&id=1'"
echo ""
echo "  • Ver respuesta formateada (ID=1):"
echo "    curl -s 'http://localhost:9191/api.php?action=get&id=1' | jq ."
echo ""
echo "────────────────────────────────────────────────────────────────────"
echo ""
echo "🛑 Para detener los servicios, ejecuta:"
echo "   docker-compose down"
echo ""

exit 0
