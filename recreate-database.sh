#!/bin/bash

echo "Regenerando base de datos Albuaves..."
echo ""

cd db

# Borrar BD anterior si existe
if [ -f albuaves.db ]; then
    rm albuaves.db
fi

echo "Creando nueva base de datos..."

# Usar Docker para crear la BD
docker run --rm -v "$(pwd):/db" -w /db alpine sh -c "apk add --no-cache sqlite && sqlite3 albuaves.db < albuaves-db-create.sql && sqlite3 albuaves.db < albuaves-tables-population.sql"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Base de datos creada exitosamente!"
    echo "========================================"
    echo ""
else
    echo ""
    echo "ERROR: No se pudo crear la base de datos"
    echo "Asegúrate de que Docker Desktop esté ejecutándose"
    echo ""
fi

cd ..
