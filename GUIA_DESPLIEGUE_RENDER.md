# 🚀 Guía de Despliegue en Render

Esta guía te llevará paso a paso para desplegar **Albuaves** en Render y tener tu API pública accesible desde Internet.

---

## 📋 Requisitos Previos

1. ✅ Tener el proyecto en un repositorio de GitHub/GitLab
2. ✅ Crear una cuenta gratuita en [Render](https://render.com) (no requiere tarjeta de crédito)

---

## 🔧 Paso 1: Preparar el Repositorio

Los archivos necesarios para Render **ya están creados** en el proyecto:

- ✅ `render.yaml` - Configuración del servicio
- ✅ `Dockerfile.render` - Imagen Docker optimizada para producción
- ✅ `docker-entrypoint.sh` - Script de inicio para configurar Apache

**Acción requerida:**

```bash
# Agregar los archivos al repositorio
git add render.yaml Dockerfile.render docker-entrypoint.sh GUIA_DESPLIEGUE_RENDER.md
git commit -m "Agregar configuración para despliegue en Render"
git push
```

---

## 🌐 Paso 2: Crear el Servicio en Render

### Opción A: Despliegue Automático (Recomendado)

1. **Accede a Render:** https://dashboard.render.com/

2. **Conecta tu repositorio:**
   - Haz clic en **"New +"** → **"Blueprint"**
   - Conecta tu cuenta de GitHub/GitLab
   - Selecciona el repositorio `Albuaves`

3. **Render detectará automáticamente** el archivo `render.yaml` y configurará todo

4. **Haz clic en "Apply"** para iniciar el despliegue

### Opción B: Despliegue Manual

1. **Accede a Render:** https://dashboard.render.com/

2. **Crear Web Service:**
   - Haz clic en **"New +"** → **"Web Service"**
   - Conecta tu repositorio de GitHub/GitLab
   - Selecciona el repositorio `Albuaves`

3. **Configurar el servicio:**

   | Campo | Valor |
   |-------|-------|
   | **Name** | `albuaves-api` |
   | **Region** | `Frankfurt` (o el más cercano) |
   | **Branch** | `main` |
   | **Runtime** | `Docker` |
   | **Dockerfile Path** | `Dockerfile.render` |
   | **Docker Build Context Directory** | `.` (raíz) |
   | **Plan** | `Free` |

4. **Variables de entorno:** (Opcional, ya están en render.yaml)
   - `PORT`: `10000` (Render lo asigna automáticamente)

5. **Health Check Path:**
   - `/api.php`

6. **Haz clic en "Create Web Service"**

---

## ⏳ Paso 3: Esperar el Despliegue

El despliegue tarda **5-10 minutos** la primera vez:

1. **Render construirá** la imagen Docker
2. **Desplegará** el contenedor
3. **Asignará una URL pública** como:
   ```
   https://albuaves-api.onrender.com
   ```

Puedes ver los logs en tiempo real en el dashboard de Render.

---

## ✅ Paso 4: Verificar el Despliegue

Una vez desplegado, prueba los siguientes endpoints:

### 1. **Interfaz Web:**
```
https://albuaves-api.onrender.com/
```
Deberías ver la galería de aves con imágenes.

### 2. **API JSON:**
```
https://albuaves-api.onrender.com/api.php
```
Deberías ver el JSON con las 10 aves.

### 3. **Ave específica por ID:**
```
https://albuaves-api.onrender.com/api.php?id=1
```
Deberías ver solo el Martinete.

---

## 📸 Paso 5: Actualizar el README

Una vez que tengas la URL pública, actualiza el README:

1. **Agrega la URL en la sección "Quick Access":**

```markdown
## 🌐 Servidor Público (Producción)

La aplicación está desplegada y accesible públicamente:

- 🌐 **Interfaz Web:** https://albuaves-api.onrender.com/
- 📡 **API REST:** https://albuaves-api.onrender.com/api.php
- 🏢 **Plataforma:** Render (Free Tier)
- 🗄️ **Base de datos:** SQLite embebida
```

2. **Toma capturas de pantalla** con la URL pública visible

3. **Haz commit:**
```bash
git add README.md docimgs/
git commit -m "Actualizar README con URL del servidor público en Render"
git push
```

---

## 🔄 Despliegue Automático

Render está configurado con **auto-deploy**. Cada vez que hagas `git push` a la rama `main`, Render:

1. ✅ Detecta los cambios automáticamente
2. ✅ Reconstruye la imagen Docker
3. ✅ Despliega la nueva versión
4. ✅ Actualiza la URL pública

---

## ⚠️ Limitaciones del Plan Gratuito

Render Free Tier tiene estas limitaciones:

| Limitación | Detalle |
|-----------|---------|
| **Sleep después de inactividad** | Se suspende tras 15 min sin uso |
| **Primera carga lenta** | Tarda ~30 seg en despertar |
| **750 horas/mes** | Suficiente para proyecto educativo |
| **Ancho de banda** | 100 GB/mes |

**Solución:** La primera vez que alguien acceda, tardará 30 segundos. Luego funciona normal.

---

## 🐛 Troubleshooting

### Error: "Deploy failed"

**Causa:** Problema en el Dockerfile o falta de archivos.

**Solución:**
1. Verifica que todos los archivos están en el repo:
   ```bash
   git add render.yaml Dockerfile.render docker-entrypoint.sh
   git push
   ```
2. Revisa los logs en el dashboard de Render

### Error: "Healthcheck failed"

**Causa:** La API no responde en `/api.php`

**Solución:**
1. Verifica que la base de datos `db/albuaves.db` existe
2. Revisa los logs de Apache en Render
3. Comprueba que el puerto está correctamente configurado

### Error: "Cannot find database"

**Causa:** La ruta de la base de datos es incorrecta.

**Solución:**
Verifica en `php/api.php` que la ruta sea:
```php
$db = new PDO('sqlite:db/albuaves.db');
```

### Servicio muy lento

**Causa:** Render Free Tier se duerme tras 15 min de inactividad.

**Solución:**
- Es normal, espera 30 seg la primera carga
- Considera usar un servicio de "ping" como UptimeRobot para mantenerlo despierto
- O usa un plan de pago ($7/mes)

---

## 🎓 Alternativas a Render

Si quieres probar otras plataformas:

### **Railway** (también gratis)
- Pros: Muy fácil, soporta Docker Compose
- Contras: Requiere tarjeta de crédito (aunque no cobra)
- URL: https://railway.app/

### **Fly.io**
- Pros: Plan gratuito generoso, múltiples regiones
- Contras: Configuración más técnica
- URL: https://fly.io/

### **AWS EC2** (avanzado)
- Pros: Control total, tier gratuito 12 meses
- Contras: Configuración compleja, requiere conocimientos
- URL: https://aws.amazon.com/ec2/

### **Raspberry Pi** (local)
- Pros: Control total, gratis si tienes el hardware
- Contras: Necesitas IP pública/DDNS, configurar router
- Requiere: Raspberry Pi + conexión 24/7

---

## 📊 Checklist de Despliegue

Usa este checklist para verificar que todo está completo:

- [ ] Archivos de Render creados (`render.yaml`, `Dockerfile.render`, `docker-entrypoint.sh`)
- [ ] Archivos agregados al repositorio y pusheados
- [ ] Cuenta de Render creada
- [ ] Servicio creado en Render (Blueprint o manual)
- [ ] Despliegue completado exitosamente
- [ ] URL pública accesible
- [ ] Interfaz web funciona
- [ ] API JSON responde correctamente
- [ ] Capturas de pantalla tomadas con URL pública
- [ ] README actualizado con URL del servidor
- [ ] Commit y push final realizados

---

## 🎉 ¡Listo!

Tu proyecto **Albuaves** ahora está:
- ✅ Desplegado en producción
- ✅ Accesible públicamente desde Internet
- ✅ Con URL permanente
- ✅ Con despliegue automático en cada push

**Comparte la URL con tu profesor para demostrar que el servidor funciona.**

---

**Fecha:** 18 de Noviembre de 2025
**Plataforma:** Render (Free Tier)
**Tiempo estimado:** 10-15 minutos
