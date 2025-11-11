@echo off
echo ==========================================
echo   Prueba de la API Albuaves
echo ==========================================
echo.

REM Esperar un momento para que la API este lista
echo Esperando 3 segundos para que la API este lista...
timeout /t 3 /nobreak >nul

echo.
echo Probando endpoint: http://localhost:9191/api.php
echo.

REM Probar con curl si esta disponible
where curl >nul 2>nul
if %errorlevel% equ 0 (
    echo Resultado:
    echo ----------------------------------------
    curl -s http://localhost:9191/api.php
    echo.
    echo ----------------------------------------
    echo.

    if %errorlevel% equ 0 (
        echo [OK] La API esta funcionando correctamente en http://localhost:9191/api.php
    ) else (
        echo [ERROR] La API no responde. Verifica que Docker este corriendo.
        echo.
        echo Ejecuta: docker-compose ps
        echo Deberias ver el contenedor 'albuaves-api' corriendo.
    )
) else (
    echo curl no esta instalado. Prueba en tu navegador:
    echo    http://localhost:9191/api.php
)

echo.
echo ==========================================
pause
