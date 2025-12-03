# 📋 Funcionalidad de Registro de Avistamientos

## ✨ Nueva Funcionalidad Implementada

Se ha añadido un sistema completo para registrar avistamientos de aves con las siguientes características:

### 🎯 Características Principales

1. **Interfaz con 3 Pestañas:**
   - 🦅 **Bird Catalog**: Catálogo de aves existente
   - 📋 **Sightings**: Ver todos los avistamientos registrados
   - ➕ **Register Sighting**: Registrar nuevos avistamientos

2. **Formulario de Registro:**
   - Selección de especie de ave (dropdown con todas las aves disponibles)
   - Fecha y hora del avistamiento
   - Ubicación del avistamiento
   - Observaciones (opcional)
   - **Carga de imagen** con preview antes de subir

3. **Visualización de Avistamientos:**
   - Tarjetas con información completa
   - Imágenes de los avistamientos
   - Detalles: especie, fecha, hora, ubicación y observaciones
   - Diseño responsive

## 🗄️ Cambios en la Base de Datos

Se ha añadido el campo `image_url` a la tabla `sightings`:

```sql
ALTER TABLE sightings ADD COLUMN image_url TEXT;
```

## 📁 Archivos Nuevos/Modificados

### Nuevos Archivos:
- `php/sightings-api.php` - API REST para gestionar avistamientos (GET, POST)
- `php/imgs/sightings/` - Directorio para almacenar imágenes de avistamientos
- `php/migrate-db.php` - Script de migración de base de datos
- `db/add-sighting-image.sql` - Script SQL para añadir campo image_url

### Archivos Modificados:
- `php/index.html` - Añadidas pestañas y formulario de registro
- `php/script.js` - Lógica para tabs, formulario y carga de avistamientos
- `php/style.css` - Estilos para tabs, formulario y tarjetas de avistamientos
- `db/albuaves-db-create.sql` - Actualizado esquema de sightings

## 🚀 Cómo Usar

### 1. Actualizar la Base de Datos

**Opción A: Desde Docker (Recomendado)**
```bash
docker-compose exec api-php php migrate-db.php
```

**Opción B: Recrear la base de datos**
Si prefieres empezar de cero:
```bash
cd db
rm albuaves.db
sqlite3 albuaves.db < albuaves-db-create.sql
sqlite3 albuaves.db < albuaves-tables-population.sql
```

### 2. Acceder a la Interfaz

1. Abre tu navegador en `http://localhost:9191/`
2. Verás 3 pestañas en la parte superior:
   - **Bird Catalog**: Catálogo existente
   - **Sightings**: Ver avistamientos
   - **Register Sighting**: Registrar nuevo avistamiento

### 3. Registrar un Avistamiento

1. Click en la pestaña "➕ Register Sighting"
2. Completa el formulario:
   - Selecciona una especie de ave
   - Ingresa la fecha y hora
   - Ingresa la ubicación
   - (Opcional) Añade observaciones
   - (Opcional) Sube una foto
3. Click en "Register Sighting"
4. ¡Listo! Verás un mensaje de confirmación

### 4. Ver Avistamientos

1. Click en la pestaña "📋 Sightings"
2. Verás todas las observaciones registradas
3. Cada tarjeta muestra:
   - Imagen (si se subió)
   - Nombre común y científico del ave
   - Ubicación, fecha y hora
   - Observaciones (si se añadieron)

## 🔧 API Endpoints

### GET /sightings-api.php
Obtiene todos los avistamientos con información de las aves.

**Respuesta:**
```json
[
  {
    "sighting_id": 1,
    "bird_id": 3,
    "date": "2025-10-15",
    "time": "09:30:00",
    "location": "Albufera Lagoon",
    "observations": "Group of 12 flamingos feeding",
    "image_url": "imgs/sightings/sighting_abc123.jpg",
    "common_name": "Greater Flamingo",
    "scientific_name": "Phoenicopterus roseus"
  }
]
```

### POST /sightings-api.php
Registra un nuevo avistamiento.

**Parámetros (FormData):**
- `bird_id` (requerido): ID del ave
- `date` (requerido): Fecha del avistamiento (YYYY-MM-DD)
- `time` (requerido): Hora del avistamiento (HH:MM:SS)
- `location` (requerido): Ubicación
- `observations` (opcional): Observaciones
- `image` (opcional): Archivo de imagen (máx 5MB, formatos: JPG, PNG, GIF, WebP)

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Sighting registered successfully",
  "sighting_id": 4,
  "image_url": "imgs/sightings/sighting_xyz789.jpg"
}
```

## 🎨 Características Técnicas

### Seguridad:
- ✅ Validación de tipo de archivo (solo imágenes)
- ✅ Validación de tamaño (máx 5MB)
- ✅ Nombres de archivo únicos (con uniqid)
- ✅ Escape de HTML para prevenir XSS
- ✅ Prepared statements para prevenir SQL injection

### UX/UI:
- ✅ Preview de imagen antes de subir
- ✅ Mensajes de éxito/error claros
- ✅ Botón de submit deshabilitado durante el envío
- ✅ Formulario se limpia después de enviar
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Animaciones suaves entre pestañas

### Performance:
- ✅ Lazy loading de imágenes
- ✅ Cache busting para forzar actualización
- ✅ Carga bajo demanda de avistamientos

## 📸 Ejemplo de Uso

```javascript
// Ejemplo de registro de avistamiento mediante JavaScript
const formData = new FormData();
formData.append('bird_id', '3');
formData.append('date', '2025-11-15');
formData.append('time', '14:30:00');
formData.append('location', 'Lake Shore');
formData.append('observations', 'Beautiful flamingo feeding');
formData.append('image', fileInput.files[0]);

const response = await fetch('sightings-api.php', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log(result);
```

## 🐛 Troubleshooting

### Las imágenes no se suben
- Verifica que el directorio `php/imgs/sightings/` existe
- Verifica permisos de escritura: `chmod 755 php/imgs/sightings/`
- Verifica el tamaño del archivo (máx 5MB)

### No veo los avistamientos
- Ejecuta el script de migración: `php migrate-db.php`
- Verifica que la tabla sightings tiene el campo image_url
- Abre la consola del navegador para ver errores

### Error al cargar la API
- Verifica que `sightings-api.php` está en el directorio `php/`
- Verifica que el archivo `db/albuaves.db` es accesible
- Revisa los logs de PHP/Apache

## 📝 Notas Adicionales

- Las imágenes se almacenan en `php/imgs/sightings/`
- Los nombres de archivo son únicos (formato: `sighting_[uniqid].ext`)
- La base de datos ya incluye 3 avistamientos de ejemplo
- El formulario valida todos los campos requeridos antes de enviar

## 🎉 ¡Listo!

Ya puedes empezar a registrar avistamientos de aves con imágenes. La aplicación ahora es un sistema completo de gestión de aves y observaciones.
