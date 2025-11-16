@echo off
echo ======================================
echo   Starting Albuaves with Docker
echo ======================================
echo.

REM Stop and clean previous containers
echo [1/4] Cleaning previous containers...
docker-compose down 2>nul

REM Build images
echo.
echo [2/4] Building Docker images...
docker-compose build

REM Start services
echo.
echo [3/4] Starting services...
docker-compose up -d api-php

REM Wait for API to be ready
echo.
echo [4/4] Waiting for API to be ready...
echo API available at: http://localhost:9191/api.php
echo.
timeout /t 5 /nobreak >nul

REM Run Java client
echo.
echo ======================================
echo   Running Java client
echo ======================================
echo.
docker-compose up client-java

echo.
echo ======================================
echo   Process completed
echo ======================================
echo.

REM Improved visual message with links and examples
echo.
echo ===================================================================
echo                ALBUAVES STARTED SUCCESSFULLY
echo ===================================================================
echo.
echo APPLICATION ACCESS:
echo.
echo [WEB] Web Interface (End users):
echo       URL: http://localhost:9191
echo       Description: Visual gallery of waterfowl
echo.
echo [API] REST API (Developers):
echo       Base URL: http://localhost:9191/api.php
echo       Description: Programmatic access to the bird database
echo.
echo -------------------------------------------------------------------
echo.
echo USAGE EXAMPLES:
echo.
echo   * Get all birds:
echo     curl "http://localhost:9191/api.php?action=list"
echo.
echo   * Query a specific bird (ID=1):
echo     curl "http://localhost:9191/api.php?action=get&id=1"
echo.
echo   * View formatted response (ID=1):
echo     curl "http://localhost:9191/api.php?action=get&id=1" | jq .
echo.
echo -------------------------------------------------------------------
echo.
echo To stop the services, run: docker-compose down
echo.

pause
