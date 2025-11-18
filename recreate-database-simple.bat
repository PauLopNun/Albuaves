@echo off
echo Regenerando base de datos Albuaves (sin Docker)...
echo.

cd db

REM Borrar BD anterior si existe
if exist albuaves.db del albuaves.db

echo Creando nueva base de datos...

REM Crear archivo temporal con los comandos SQL
echo .read albuaves-db-create.sql > temp_commands.sql
echo .read albuaves-tables-population.sql >> temp_commands.sql

REM Intentar con sqlite3 si está instalado
where sqlite3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    sqlite3 albuaves.db < temp_commands.sql
    del temp_commands.sql
    echo.
    echo ========================================
    echo Base de datos creada exitosamente!
    echo ========================================
    echo.
    cd ..
    pause
    exit /b 0
)

REM Si no hay sqlite3, crear con Python
echo SQLite3 no encontrado, intentando con Python...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Necesitas Python o SQLite3 instalado
    echo.
    echo Opciones:
    echo 1. Instala Python desde https://www.python.org/downloads/
    echo 2. O inicia Docker Desktop y usa recreate-database.bat
    echo.
    del temp_commands.sql
    cd ..
    pause
    exit /b 1
)

REM Crear con Python
python -c "import sqlite3; conn = sqlite3.connect('albuaves.db'); cursor = conn.cursor(); cursor.executescript(open('albuaves-db-create.sql').read()); cursor.executescript(open('albuaves-tables-population.sql').read()); conn.commit(); conn.close(); print('Base de datos creada con Python!')"

del temp_commands.sql

if exist albuaves.db (
    echo.
    echo ========================================
    echo Base de datos creada exitosamente!
    echo ========================================
    echo.
) else (
    echo.
    echo ERROR: No se pudo crear la base de datos
    echo.
)

cd ..
pause
