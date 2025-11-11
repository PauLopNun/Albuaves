@echo off
echo ======================================
echo   Iniciando Albuaves con Docker
echo ======================================
echo.

REM Detener y limpiar contenedores anteriores
echo [1/4] Limpiando contenedores anteriores...
docker-compose down 2>nul

REM Construir las imagenes
echo.
echo [2/4] Construyendo imagenes Docker...
docker-compose build

REM Iniciar los servicios
echo.
echo [3/4] Iniciando servicios...
docker-compose up -d api-php

REM Esperar a que la API este lista
echo.
echo [4/4] Esperando a que la API este lista...
echo API disponible en: http://localhost:9191/api.php
echo.
timeout /t 5 /nobreak >nul

REM Ejecutar el cliente Java
echo.
echo ======================================
echo   Ejecutando cliente Java
echo ======================================
echo.
docker-compose up client-java

echo.
echo ======================================
echo   Proceso completado
echo ======================================
echo.

REM Mensaje visual mejorado con enlaces y ejemplos
echo.
echo ===================================================================
echo                ALBUAVES INICIADO CORRECTAMENTE
echo ===================================================================
echo.
echo ACCESO A LA APLICACION:
echo.
echo [WEB] Interfaz Web (Usuarios finales):
echo       URL: http://localhost:9191
echo       Descripcion: Galeria visual de aves acuaticas
echo.
echo [API] API REST (Desarrolladores):
echo       Base URL: http://localhost:9191/api.php
echo       Descripcion: Acceso programatico a la base de datos de aves
echo.
echo -------------------------------------------------------------------
echo.
echo EJEMPLOS DE USO:
echo.
echo   * Obtener todas las aves:
echo     curl "http://localhost:9191/api.php?action=list"
echo.
echo   * Consultar un ave especifica (ID=1):
echo     curl "http://localhost:9191/api.php?action=get&id=1"
echo.
echo   * Ver respuesta formateada (ID=1):
echo     curl "http://localhost:9191/api.php?action=get&id=1" | jq .
echo.
echo -------------------------------------------------------------------
echo.
echo Para detener los servicios, ejecuta: docker-compose down
echo.

pause
