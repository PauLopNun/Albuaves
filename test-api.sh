#!/bin/bash

echo "=========================================="
echo "  Prueba de la API Albuaves"
echo "=========================================="
echo ""

# Esperar un momento para que la API esté lista
echo "Esperando 3 segundos para que la API esté lista..."
sleep 3

echo ""
echo "Probando endpoint: http://localhost:9191/api.php"
echo ""

# Probar la API con curl
if command -v curl &> /dev/null; then
    echo "Resultado:"
    echo "----------------------------------------"
    curl -s http://localhost:9191/api.php | head -n 20
    echo ""
    echo "----------------------------------------"
    echo ""

    # Verificar si la API respondió
    if [ $? -eq 0 ]; then
        echo "✅ La API está funcionando correctamente en http://localhost:9191/api.php"
    else
        echo "❌ Error: La API no responde. Verifica que Docker esté corriendo."
        echo ""
        echo "Ejecuta: docker-compose ps"
        echo "Deberías ver el contenedor 'albuaves-api' corriendo."
    fi
else
    echo "⚠️  curl no está instalado. Prueba en tu navegador:"
    echo "   http://localhost:9191/api.php"
fi

echo ""
echo "=========================================="
