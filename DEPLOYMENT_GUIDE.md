# 🚀 Guía de Deployment - Funcionalidad de Avistamientos

## 📋 Resumen

Para desplegar la nueva funcionalidad de avistamientos necesitas actualizar:
1. **GitHub** (subir los cambios)
2. **Render** (deployment automático + migración BD)
3. **Servidor SSH** (deployment manual + migración BD)

---

## 1️⃣ Subir Cambios a GitHub

```bash
# Desde el directorio del proyecto
cd /home/paulopnun/Escritorio/Albuaves

# Añadir todos los archivos nuevos y modificados
git add .

# Crear commit
git commit -m "Add sightings registration feature with image upload

- Added sightings-api.php for managing sightings (GET/POST)
- Added image upload functionality with validation
- Created new UI with 3 tabs (Birds, Sightings, Register)
- Updated database schema to include image_url in sightings
- Added migration script for database update
- Created imgs/sightings/ directory for storing images
- Updated frontend (HTML, CSS, JS) with new features

🦅 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Subir al repositorio
git push origin main
```

---

## 2️⃣ Actualizar en Render (Producción)

### Paso A: Esperar el Auto-Deploy

Si Render está configurado con auto-deploy:
1. Ve a https://dashboard.render.com/
2. Busca tu servicio "albuaves"
3. Espera a que termine el deployment automático (2-3 minutos)

### Paso B: Ejecutar Migración de Base de Datos

**⚠️ IMPORTANTE:** Necesitas ejecutar la migración manualmente en Render.

**Opción 1: Desde la Shell de Render (Recomendado)**
1. Ve a tu servicio en Render Dashboard
2. Click en "Shell" en el menú lateral
3. Ejecuta:
```bash
php migrate-db.php
mkdir -p imgs/sightings
chmod 755 imgs/sightings
```

**Opción 2: Recrear la Base de Datos**
Si prefieres empezar de cero (perderás datos existentes):
```bash
cd db
rm albuaves.db
sqlite3 albuaves.db < albuaves-db-create.sql
sqlite3 albuaves.db < albuaves-tables-population.sql
cd ..
mkdir -p imgs/sightings
chmod 755 imgs/sightings
```

### Paso C: Verificar

Visita https://albuaves.onrender.com/ y verifica:
- ✅ Ves las 3 pestañas nuevas
- ✅ Puedes registrar un avistamiento
- ✅ Puedes subir una imagen

---

## 3️⃣ Actualizar Servidor SSH (Red Local)

He creado un script automático para ti. Ejecútalo así:

### Desde tu máquina local:

```bash
cd /home/paulopnun/Escritorio/Albuaves
./deploy-to-ssh.sh
```

O si prefieres hacerlo paso a paso manualmente, sigue estos comandos:

### Paso A: Subir Archivos Nuevos/Modificados

```bash
# Subir archivos PHP nuevos
scp php/sightings-api.php pau@192.168.3.113:~/albuaves/php/
scp php/migrate-db.php pau@192.168.3.113:~/albuaves/php/

# Subir archivos modificados
scp php/index.html pau@192.168.3.113:~/albuaves/php/
scp php/script.js pau@192.168.3.113:~/albuaves/php/
scp php/style.css pau@192.168.3.113:~/albuaves/php/

# Subir archivos de base de datos
scp db/albuaves-db-create.sql pau@192.168.3.113:~/albuaves/db/
scp db/add-sighting-image.sql pau@192.168.3.113:~/albuaves/db/

# Subir documentación
scp SIGHTINGS_FEATURE.md pau@192.168.3.113:~/albuaves/
scp DEPLOYMENT_GUIDE.md pau@192.168.3.113:~/albuaves/
```

### Paso B: Crear Directorio y Ejecutar Migración

```bash
# Conectar al servidor
ssh pau@192.168.3.113

# Crear directorio para imágenes
cd ~/albuaves
mkdir -p php/imgs/sightings
chmod 755 php/imgs/sightings

# Ejecutar migración
cd php
php migrate-db.php

# Volver a tu máquina
exit
```

### Paso C: Verificar

Visita http://192.168.3.113:8000/ y verifica:
- ✅ Ves las 3 pestañas nuevas
- ✅ Puedes registrar un avistamiento
- ✅ Puedes subir una imagen

---

## 📝 Checklist de Deployment

### GitHub
- [ ] Ejecutar `git add .`
- [ ] Ejecutar `git commit -m "..."`
- [ ] Ejecutar `git push origin main`
- [ ] Verificar en GitHub que los archivos se subieron

### Render
- [ ] Esperar auto-deploy (2-3 minutos)
- [ ] Abrir Shell de Render
- [ ] Ejecutar `php migrate-db.php`
- [ ] Ejecutar `mkdir -p imgs/sightings && chmod 755 imgs/sightings`
- [ ] Verificar en https://albuaves.onrender.com/

### Servidor SSH
- [ ] Ejecutar `./deploy-to-ssh.sh` (o comandos manuales)
- [ ] SSH al servidor y ejecutar `php migrate-db.php`
- [ ] Crear directorio `imgs/sightings`
- [ ] Verificar en http://192.168.3.113:8000/

---

## 🆘 Troubleshooting

### Error: "Table sightings has no column named image_url"
**Solución:** Ejecuta el script de migración:
```bash
php migrate-db.php
```

### Error: "Permission denied" al subir imágenes
**Solución:** Verifica permisos del directorio:
```bash
chmod 755 php/imgs/sightings
chown www-data:www-data php/imgs/sightings  # En Render/servidor
```

### Error: Auto-deploy no funciona en Render
**Solución:**
1. Ve a Render Dashboard → Settings
2. Verifica que "Auto-Deploy" esté en "Yes"
3. Verifica que la rama sea "main"
4. Haz un deploy manual: Deploy → Deploy latest commit

### Las imágenes no aparecen después del deployment
**Solución:** Las imágenes subidas previamente NO se transfieren. Son específicas de cada entorno. Esto es normal - cada servidor tendrá sus propias imágenes de avistamientos.

---

## 💡 Notas Importantes

1. **Imágenes por Entorno:** Cada servidor (local, SSH, Render) tendrá sus propias imágenes de avistamientos. No se sincronizan automáticamente.

2. **Base de Datos por Entorno:** Cada servidor tiene su propia base de datos SQLite independiente.

3. **Primer Deploy:** La primera vez que despliegues, no habrá avistamientos. Los usuarios deberán registrarlos.

4. **Datos de Ejemplo:** La base de datos incluye 3 avistamientos de ejemplo SIN imágenes (de la población inicial).

---

## ✅ Verificación Final

Después del deployment, verifica en CADA entorno:

1. **Interfaz:**
   - [ ] Se ven 3 pestañas
   - [ ] Se puede navegar entre pestañas
   - [ ] El formulario se muestra correctamente

2. **Funcionalidad:**
   - [ ] Se puede seleccionar un ave del dropdown
   - [ ] Se puede subir una imagen y ver el preview
   - [ ] El formulario se envía correctamente
   - [ ] Aparece mensaje de éxito
   - [ ] El avistamiento aparece en la pestaña "Sightings"

3. **API:**
   - [ ] GET `/sightings-api.php` devuelve JSON válido
   - [ ] POST `/sightings-api.php` acepta FormData

---

**¡Listo para desplegar!** 🚀

Ejecuta los comandos en orden y verifica cada paso.
