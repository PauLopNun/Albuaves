@echo off
echo Regenerando base de datos Albuaves...
echo.

cd db

REM Borrar BD anterior si existe
if exist albuaves.db del albuaves.db

echo Creando nueva base de datos...

REM Usar Docker para crear la BD
docker run --rm -v "%CD%:/db" -w /db alpine sh -c "apk add --no-cache sqlite && sqlite3 albuaves.db < albuaves-db-create.sql && sqlite3 albuaves.db < albuaves-tables-population.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Base de datos creada exitosamente!
    echo ========================================
    echo.
) else (
    echo.
    echo ERROR: No se pudo crear la base de datos
    echo Asegurate de que Docker Desktop este ejecutandose
    echo.
)

cd ..
pause
