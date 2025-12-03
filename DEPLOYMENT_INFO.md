# 🦅 Albuaves - Información de Despliegue en Servidor Remoto

## ✅ Estado del Despliegue
**Fecha:** 3 de diciembre de 2025
**Estado:** ✅ OPERATIVO

---

## 🌐 URLs de Acceso

### Interfaz Web Principal
**URL:** http://192.168.3.113:8000/

Esta es la interfaz visual completa con:
- 📷 Galería de 10 especies de aves
- 🔍 Búsqueda en tiempo real
- 📱 Diseño responsive

### API REST
**URL Base:** http://192.168.3.113:8000/api.php

**Endpoints disponibles:**
- `GET /api.php` - Obtener todas las aves
- `GET /api.php?id=1` - Obtener un ave específica por ID

**Ejemplo de respuesta:**
```json
{
    "bird_id": 1,
    "common_name": "Black-crowned Night Heron",
    "scientific_name": "Nycticorax nycticorax",
    "description": "Nocturnal bird with black and white plumage, common in wetlands.",
    "image_url": "imgs/aves/martinete.jpg"
}
```

---

## 🔧 Gestión del Servidor

### Servidor SSH
- **Host:** 192.168.3.113
- **Usuario:** pau
- **Directorio del proyecto:** /home/pau/albuaves/

### Scripts de Control Remoto

#### Iniciar el servidor
```bash
ssh pau@192.168.3.113 './start_albuaves.sh'
```

#### Detener el servidor
```bash
ssh pau@192.168.3.113 './stop_albuaves.sh'
```

#### Ver logs del servidor
```bash
ssh pau@192.168.3.113 'tail -f ~/albuaves/server.log'
```

#### Ver estado del servidor
```bash
ssh pau@192.168.3.113 'ps aux | grep "php -S"'
```

---

## 📁 Estructura de Archivos en el Servidor

```
/home/pau/
├── albuaves/                    # Directorio principal del proyecto
│   ├── index.html              # Página principal
│   ├── api.php                 # API REST
│   ├── style.css               # Estilos
│   ├── script.js               # JavaScript
│   ├── albuaves.db            # Base de datos SQLite
│   ├── .htaccess              # Configuración Apache
│   ├── router.php             # Router auxiliar
│   ├── server.log             # Logs del servidor
│   ├── server.pid             # PID del proceso del servidor
│   └── imgs/aves/             # Imágenes de las aves (10 fotos)
│       ├── martinete.jpg
│       ├── garza_real.jpg
│       ├── flamenco_comun.jpg
│       ├── anade_real.jpg
│       ├── charran_comun.jpg
│       ├── somormujo_lavanco.jpg
│       ├── calamon_comun.jpg
│       ├── avetoro_comun.jpg
│       ├── pato_colorado.jpg
│       └── aguilucho_lagunero.jpg
├── start_albuaves.sh           # Script para iniciar el servidor
└── stop_albuaves.sh            # Script para detener el servidor
```

---

## 🛠️ Detalles Técnicos

### Servidor
- **Software:** PHP 8.3.6 Built-in Web Server
- **Puerto:** 8000
- **Host:** 0.0.0.0 (accesible desde cualquier IP)
- **Proceso:** Ejecutándose en background con nohup

### Base de Datos
- **Tipo:** SQLite3
- **Archivo:** albuaves.db
- **Ubicación:** /home/pau/albuaves/albuaves.db
- **Contenido:** 10 especies de aves acuáticas

### Configuración del Servidor
- **DocumentRoot:** /home/pau/albuaves/
- **Permisos:** Usuario 'pau' (sin necesidad de sudo)
- **Logs:** /home/pau/albuaves/server.log

---

## ⚠️ Notas Importantes

### Limitaciones
1. **No hay permisos sudo:** El usuario 'pau' no tiene permisos de administrador, por lo que:
   - No se puede usar el puerto 80 (requiere privilegios de root)
   - Se usa el puerto 8000 en su lugar
   - El servidor corre con el built-in PHP server en lugar de Apache

2. **Persistencia:** El servidor se ejecuta en background, pero:
   - Si el servidor se reinicia, el proceso se detendrá
   - Usar `./start_albuaves.sh` para reiniciar después de un reinicio del sistema

3. **Firewall:** Asegúrate de que el puerto 8000 esté abierto en el firewall del servidor:
   ```bash
   # Para verificar (requiere sudo):
   sudo ufw status
   # Para abrir el puerto (requiere sudo):
   sudo ufw allow 8000/tcp
   ```

### Recomendaciones
- Mantener el servidor corriendo con `./start_albuaves.sh`
- Revisar logs periódicamente: `tail -f ~/albuaves/server.log`
- Hacer backups de la base de datos: `cp ~/albuaves/albuaves.db ~/albuaves/albuaves.db.backup`

---

## 🧪 Pruebas Realizadas

### ✅ Tests Exitosos
- ✅ Página principal accesible (HTTP 200)
- ✅ API REST funcionando (HTTP 200)
- ✅ Base de datos respondiendo correctamente
- ✅ Consulta individual de aves por ID
- ✅ Imágenes cargando correctamente
- ✅ 10 especies disponibles en la base de datos

### Ejemplos de Prueba
```bash
# Probar la página principal
curl -I http://192.168.3.113:8000/

# Probar la API - todas las aves
curl http://192.168.3.113:8000/api.php | python3 -m json.tool

# Probar la API - una ave específica
curl http://192.168.3.113:8000/api.php?id=1 | python3 -m json.tool

# Probar una imagen
curl -I http://192.168.3.113:8000/imgs/aves/martinete.jpg
```

---

## 📞 Solución de Problemas

### El servidor no responde
```bash
# Verificar si el proceso está corriendo
ssh pau@192.168.3.113 'ps aux | grep "php -S"'

# Reiniciar el servidor
ssh pau@192.168.3.113 './stop_albuaves.sh && ./start_albuaves.sh'
```

### Ver qué está pasando
```bash
# Ver los últimas líneas del log
ssh pau@192.168.3.113 'tail -20 ~/albuaves/server.log'

# Seguir el log en tiempo real
ssh pau@192.168.3.113 'tail -f ~/albuaves/server.log'
```

### Error de base de datos
```bash
# Verificar que la base de datos existe
ssh pau@192.168.3.113 'ls -lh ~/albuaves/albuaves.db'

# Verificar permisos
ssh pau@192.168.3.113 'chmod 644 ~/albuaves/albuaves.db'
```

---

## 🎓 Para el Profesor

El proyecto Albuaves ha sido desplegado exitosamente en el servidor con las siguientes características:

1. **Acceso Web Completo:** Interfaz visual moderna en http://192.168.3.113:8000/
2. **API REST Funcional:** Endpoint JSON disponible para desarrollo
3. **Base de Datos Operativa:** 10 especies de aves con datos completos
4. **Imágenes:** Todas las fotos de aves cargadas y accesibles
5. **Sin Dependencias Externas:** Todo corre con PHP integrado, sin necesidad de Docker o Apache

**Limitación:** Debido a que el usuario 'pau' no tiene permisos sudo, el servicio corre en el puerto 8000 en lugar del puerto 80 estándar. Si desea usar el puerto 80 con Apache, será necesario:
- Mover los archivos a `/var/www/html/albuaves/` (requiere sudo)
- Habilitar el módulo userdir de Apache (requiere sudo)
- O agregar al usuario 'pau' al grupo www-data (requiere sudo)

---

**Documento generado automáticamente por el script de despliegue**
**Fecha:** 3 de diciembre de 2025
