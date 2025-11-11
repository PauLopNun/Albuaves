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
echo Para detener los servicios, ejecuta: docker-compose down

pause
