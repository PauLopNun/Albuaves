@echo off
echo ==========================================
echo   Testing Albuaves API
echo ==========================================
echo.

REM Wait a moment for the API to be ready
echo Waiting 3 seconds for the API to be ready...
timeout /t 3 /nobreak >nul

echo.
echo Testing endpoint: http://localhost:9191/api.php
echo.

REM Test with curl if available
where curl >nul 2>nul
if %errorlevel% equ 0 (
    echo Result:
    echo ----------------------------------------
    curl -s http://localhost:9191/api.php
    echo.
    echo ----------------------------------------
    echo.

    if %errorlevel% equ 0 (
        echo [OK] The API is working correctly at http://localhost:9191/api.php
    ) else (
        echo [ERROR] The API is not responding. Verify that Docker is running.
        echo.
        echo Run: docker-compose ps
        echo You should see the 'albuaves-api' container running.
    )
) else (
    echo curl is not installed. Try in your browser:
    echo    http://localhost:9191/api.php
)

echo.
echo ==========================================
pause
