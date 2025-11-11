# 🦅 Albuaves - Sistema de Gestión de Aves de la Albufera

Sistema completo dockerizado para gestión y consulta de aves acuáticas de la Albufera de Valencia. Incluye:
- 🌐 **Interfaz web visual** con galería de aves e imágenes
- 📱 **API REST** en PHP con SQLite
- 💻 **Cliente Java** para consumir la API
- 🗄️ **Base de datos** con 10 especies de aves acuáticas

## Requisitos

- Docker Desktop instalado
- Docker Compose instalado

**Eso es todo.** No necesitas instalar PHP, Java, ni ninguna otra dependencia en tu sistema.

## Inicio Rápido

### Windows
```bash
run-docker.bat
```

### Linux/Mac/WSL
```bash
chmod +x start.sh
./start.sh
```

### Usando Docker Compose directamente
```bash
docker-compose up --build
```

## Acceso rápido

Una vez iniciado el sistema, tienes dos formas de acceder:

### 🌐 Opción 1: Interfaz Web Visual (Recomendado)

**URL:** http://localhost:9191/

Esta es la forma más fácil y visual de explorar las aves. Verás:
- 📷 **10 tarjetas con imágenes** de cada ave acuática
- 🔍 **Buscador en tiempo real** para filtrar aves por nombre
- ℹ️ **Información completa** de cada ave (nombre común, científico, descripción)
- 📱 **Diseño responsivo** que funciona en móvil, tablet y escritorio

### 📡 Opción 2: API REST (Para desarrolladores)

**URL:** http://localhost:9191/api.php

#### Endpoints disponibles

```bash
# Obtener todas las aves en JSON
curl http://localhost:9191/api.php

# Obtener un ave específica por ID
curl http://localhost:9191/api.php?id=1

# O simplemente abre en tu navegador:
http://localhost:9191/api.php
```

#### Respuesta ejemplo
```json
[
  {
    "id_ave": 1,
    "nombre_comun": "Martinete",
    "nombre_cientifico": "Nycticorax nycticorax",
    "descripcion": "Ave nocturna de plumaje blanco y negro, común en humedales.",
    "imagen_url": "imgs/aves/martinete.jpg"
  },
  ...
]
```

## Estructura del Proyecto

```
UP02-Proyecto-DAM-Albuaves/
├── docker-compose.yml                    # Orquestación de servicios Docker
├── README.md                             # Este archivo (documentación)
├── start.sh                              # Script inicio Linux/Mac/WSL
├── run-docker.sh                        # Script inicio detallado Linux/Mac
├── run-docker.bat                       # Script inicio Windows
├── test-api.sh                          # Script para probar la API
│
├── php/                                  # 🌐 INTERFAZ WEB
│   ├── Dockerfile                       # Imagen Docker PHP 8.2 + Apache
│   ├── api.php                          # API REST en PHP
│   ├── index.html                       # Página principal (interfaz visual)
│   ├── style.css                        # Estilos CSS de la interfaz
│   ├── script.js                        # JavaScript - lógica de la interfaz
│   ├── .htaccess                        # Configuración Apache (URL rewriting)
│   ├── router.php                       # Router auxiliar
│   └── imgs/aves/                       # 📷 IMÁGENES DE AVES (10 fotos)
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
│
├── java/                                 # 💻 CLIENTE JAVA
│   ├── Dockerfile                       # Imagen Docker Java 17
│   └── BuscadorAvesAPI.java             # Cliente que consume la API
│
├── db/                                   # 🗄️ BASE DE DATOS
│   ├── albuaves.db                      # SQLite con 10 especies
│   ├── albuaves-db-create.sql          # Script creación tablas
│   └── albuaves-tables-population.sql  # Script inserción datos
│
└── libs/                                 # 📚 LIBRERÍAS
    ├── json-20250517.jar               # JSON parser para Java
    └── sqlite-jdbc.jar                 # Driver JDBC SQLite
```

## Arquitectura

```
┌──────────────────────────────────────────────────────────────────┐
│                         Docker Compose                            │
│                                                                   │
│  ┌──────────────────────────────────┐  ┌────────────────────┐   │
│  │         api-php (Puerto 9191)     │  │   client-java      │   │
│  │     PHP 8.2 + Apache + SQLite     │◄─│   OpenJDK 17       │   │
│  │                                   │  │   Consume API      │   │
│  │  ┌─ Interfaz Web Visual ────┐    │  │                    │   │
│  │  │ 🌐 index.html (HTML)      │    │  │  Healthcheck OK ✓  │   │
│  │  │ 🎨 style.css (CSS)        │    │  │  depends_on: api   │   │
│  │  │ ⚙️ script.js (JavaScript)│    │  │                    │   │
│  │  │ 📡 api.php (API REST)     │    │  └────────────────────┘   │
│  │  └───────────────────────────┘    │                           │
│  │                                   │                           │
│  │  ┌─ Imágenes de Aves ────────┐   │                           │
│  │  │ 📷 imgs/aves/             │   │                           │
│  │  │   ├── martinete.jpg       │   │                           │
│  │  │   ├── garza_real.jpg      │   │                           │
│  │  │   ├── flamenco_comun.jpg  │   │                           │
│  │  │   └── ... (10 imágenes)   │   │                           │
│  │  └───────────────────────────┘   │                           │
│  └──────────────────────────────────┘                           │
│             │                                                     │
│             ▼                                                     │
│  ┌──────────────────────────────────┐                           │
│  │      Base de datos SQLite        │                           │
│  │      albuaves.db                 │                           │
│  │  (10 especies de aves)           │                           │
│  └──────────────────────────────────┘                           │
│                                                                   │
│         Red privada: albuaves-network (Bridge)                  │
└──────────────────────────────────────────────────────────────────┘
```

## Servicios

### 🌐 API PHP + Interfaz Web (api-php)
- **Puerto:** 9191
- **Tecnología:** PHP 8.2 + Apache
- **Accesos:**
  - Interfaz visual: http://localhost:9191/
  - API JSON: http://localhost:9191/api.php
- **Base de datos:** SQLite3 con 10 especies de aves
- **Healthcheck:** Verifica que la API responda antes de iniciar otros servicios
- **Características:**
  - Interfaz web moderna y responsive
  - Buscador en tiempo real
  - 10 imágenes de aves de alta calidad
  - API REST para desarrolladores

### 💻 Cliente Java (client-java)
- **Función:** Consume la API y muestra los resultados en tabla en consola
- **Tecnología:** OpenJDK 17 + librerías JSON y SQLite JDBC
- **Ejecución:** Automática después de que la API esté lista
- **Dependencias:** Se ejecuta solo después del healthcheck OK

## 🌐 Guía de la Interfaz Web

### ¿Qué es?
La interfaz web es una aplicación moderna y fácil de usar para explorar las 10 especies de aves acuáticas de la Albufera. No requiere conocimientos técnicos.

### ¿Cómo accedo?
Simplemente abre en tu navegador: **http://localhost:9191/**

### Funcionalidades principales

#### 1. **Galería de Aves**
La página principal muestra un grid de tarjetas, cada una con:
- 📷 **Imagen de la especie** (fotografía real de alta calidad)
- 🏷️ **Nombre común** (ej: "Martinete")
- 🔬 **Nombre científico** (ej: "Nycticorax nycticorax")
- 📝 **Descripción** de la especie
- 🆔 **ID** para referencia en la API

#### 2. **Buscador en Tiempo Real**
En la parte superior hay un cuadro de búsqueda que te permite:
- Escribir el nombre común o científico de un ave
- Filtra automáticamente mientras escribes
- Muestra el número de resultados encontrados
- Puedes buscar por descripción también

#### 3. **Diseño Responsivo**
- ✅ Funciona en **computadora de escritorio**
- ✅ Funciona en **tablet**
- ✅ Funciona en **móvil**
- Las tarjetas se adaptan automáticamente al tamaño de la pantalla

#### 4. **Efectos Visuales**
- Al pasar el ratón sobre una tarjeta, se eleva ligeramente
- Las imágenes hacen zoom al pasar el ratón
- Transiciones suaves para una mejor experiencia

### 10 Aves Disponibles

| ID | Nombre Común | Nombre Científico | Imagen |
|---|---|---|---|
| 1 | Martinete | *Nycticorax nycticorax* | ✅ |
| 2 | Garza Real | *Ardea cinerea* | ✅ |
| 3 | Flamenco Común | *Phoenicopterus roseus* | ✅ |
| 4 | Ánade Real | *Anas platyrhynchos* | ✅ |
| 5 | Charrán Común | *Sterna hirundo* | ✅ |
| 6 | Somormujo Lavanco | *Podiceps cristatus* | ✅ |
| 7 | Calamón Común | *Porphyrio porphyrio* | ✅ |
| 8 | Avetoro Común | *Botaurus stellaris* | ✅ |
| 9 | Pato Colorado | *Netta rufina* | ✅ |
| 10 | Aguilucho Lagunero | *Circus aeruginosus* | ✅ |

### Tecnología de la Interfaz Web

**Frontend:**
- HTML5 para estructura
- CSS3 con diseño moderno y gradientes
- JavaScript vanilla (sin dependencias externas)
- Fetch API para comunicación con el servidor

**Backend:**
- PHP 8.2 con Apache
- API REST que devuelve JSON
- SQLite3 como base de datos

**Características técnicas:**
- Sin dependencias npm ni build tools
- Carga de imágenes con lazy loading
- Prevención de XSS (escapado de HTML)
- Caché HTTP inteligente para imágenes
- CORS habilitado para consumo desde otras aplicaciones

## Comandos Útiles

### Gestión de servicios
```bash
# Construir y arrancar todo
docker-compose up --build

# Arrancar en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs api-php
docker-compose logs client-java

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir sin caché
docker-compose build --no-cache
```

### Verificación
```bash
# Verificar contenedores corriendo
docker ps

# Probar la API
curl http://localhost:9191/api.php

# Entrar al contenedor de la API
docker-compose exec api-php sh

# Entrar al contenedor del cliente
docker-compose exec client-java sh
```

## Solución de Problemas

### La interfaz web carga pero sin imágenes

**Causa:** Caché del navegador. El navegador tiene las versiones antiguas de los archivos en caché.

**Solución:**

**Opción 1: Limpiar caché del navegador (Recomendado)**
```bash
1. Presiona: Ctrl+Shift+Delete (Windows/Linux) o Cmd+Shift+Delete (Mac)
2. Selecciona "Vaciar caché"
3. Presiona: Ctrl+F5 en http://localhost:9191/
```

**Opción 2: Usar navegador privado/incógnito**
```bash
1. Abre una ventana incógnita (Ctrl+Shift+N)
2. Ve a http://localhost:9191/
```

**Opción 3: Borrar caché de Docker**
```bash
docker-compose down -v
docker-compose up --build
```

### El puerto 9191 no responde

**Causa:** Probablemente usaste `docker run` en lugar de `docker-compose`, o hay otro proceso usando el puerto.

**Solución:**
```bash
# Detener todo
docker stop $(docker ps -aq)

# Verificar que el puerto está libre
lsof -i :9191  # (en Linux/Mac)
netstat -ano | findstr :9191  # (en Windows)

# Usar docker-compose
docker-compose up --build
```

### Error: "Cannot connect to the Docker daemon"
```bash
# Asegúrate de que Docker Desktop está iniciado

# En Linux/WSL
sudo systemctl start docker
# o
sudo service docker start
```

### Error: "Permission denied" en scripts
```bash
# Dar permisos de ejecución
chmod +x start.sh
chmod +x run-docker.sh
```

### Error: "docker-compose: command not found"
```bash
# Opción 1: Instalar docker-compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Opción 2: Usar docker compose (sin guión)
docker compose up --build
```

### La API responde pero el cliente falla
```bash
# Ver logs del cliente
docker-compose logs client-java

# Verificar conectividad entre contenedores
docker-compose exec client-java ping api-php
```

### Empezar de cero
```bash
# Eliminar todo (contenedores, imágenes, volúmenes)
docker-compose down -v --rmi all

# Reconstruir desde cero
docker-compose build --no-cache
docker-compose up
```

## Base de Datos

### Esquema de la tabla `aves`
```sql
CREATE TABLE aves (
  id_ave INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_comun TEXT NOT NULL,
  nombre_cientifico TEXT NOT NULL,
  descripcion TEXT,
  imagen_url TEXT
);
```

### Aves incluidas
1. Martinete (Nycticorax nycticorax)
2. Garza Real (Ardea cinerea)
3. Flamenco Común (Phoenicopterus roseus)
4. Ánade Real (Anas platyrhynchos)
5. Pato Colorado (Netta rufina)
6. Aguilucho Lagunero (Circus aeruginosus)
7. Calamón Común (Porphyrio porphyrio)
8. Charrán Común (Sterna hirundo)
9. Avetoro Común (Botaurus stellaris)
10. Somormujo Lavanco (Podiceps cristatus)

## Características Técnicas

- **Portabilidad:** Funciona en Windows, Linux y macOS
- **Aislamiento:** No contamina el sistema con dependencias
- **Automatización:** Scripts para despliegue con un solo comando
- **Healthchecks:** Asegura que la API está lista antes de iniciar el cliente
- **Volúmenes:** Base de datos montada como read-only para seguridad
- **Red privada:** Comunicación segura entre contenedores
- **Variables de entorno:** Configuración flexible del cliente Java

## Desarrollo

### Modificar la API PHP
1. Edita `php/api.php`
2. Reinicia el servicio: `docker-compose restart api-php`

### Modificar el cliente Java
1. Edita `java/BuscadorAvesAPI.java`
2. Reconstruye: `docker-compose build client-java`
3. Ejecuta: `docker-compose up client-java`

### Modificar la base de datos
1. Edita `db/albuaves.db` con un cliente SQLite
2. Reinicia el servicio: `docker-compose restart api-php`

## Librerías Utilizadas

- **JSON para Java:** https://github.com/stleary/JSON-java (json-20250517.jar)
- **SQLite JDBC:** Driver JDBC para SQLite (sqlite-jdbc.jar)

## Características Principales ✨

### Interfaz Web
- ✅ **Interfaz moderna y responsiva** - Funciona en cualquier dispositivo
- ✅ **Galería visual** - 10 tarjetas con imágenes de aves reales
- ✅ **Buscador en tiempo real** - Filtra aves mientras escribes
- ✅ **Información completa** - Nombre común, científico y descripción
- ✅ **Diseño atractivo** - Colores naturales y efectos visuales

### API REST
- ✅ **Endpoints JSON** - Acceso programático a todos los datos
- ✅ **CORS habilitado** - Consumible desde cualquier aplicación
- ✅ **Documentación clara** - Fácil de usar
- ✅ **SQLite3** - Base de datos ligera y fiable

### Base de Datos
- ✅ **10 especies documentadas** - Aves acuáticas de la Albufera
- ✅ **Información completa** - Nombres, descripciones
- ✅ **Tablas de avistamientos** - Registro de observaciones
- ✅ **Datos pre-poblados** - Listo para usar

### Seguridad y Calidad
- ✅ **Prevención de XSS** - Escapado de HTML en interfaz
- ✅ **Healthcheck** - Verificación automática de servicios
- ✅ **Aislamiento** - Contenedores Docker separados
- ✅ **Red privada** - Comunicación segura entre servicios

## Notas Importantes

1. **Usa docker-compose** - No docker run directamente
2. **El puerto 9191 debe estar libre** en tu sistema
3. **La API tarda unos segundos** en estar lista (healthcheck automático)
4. **El cliente Java se ejecuta automáticamente** cuando la API está lista
5. **Los scripts .sh requieren permisos de ejecución** en Linux/Mac
6. **Interfaz web optimizada** - Sin dependencias externas (npm, build tools)
7. **Imágenes de alta calidad** - Incluidas directamente en el proyecto

## Cambios en la Versión 2.0

**Nuevas características añadidas (Noviembre 2025):**
- 🌐 Interfaz web visual completa
- 📷 10 imágenes de aves de alta calidad
- 🔍 Buscador en tiempo real
- 📱 Diseño responsivo (móvil, tablet, escritorio)
- 🎨 Estilos CSS modernos con gradientes
- ⚙️ JavaScript puro sin dependencias
- 🗄️ Base de datos actualizada con URLs de imágenes
- 📚 Documentación completa

## Licencia

Proyecto educativo para el módulo de Desarrollo de Aplicaciones Multiplataforma (DAM).

---

**Versión:** 2.0
**Última actualización:** 11 de noviembre de 2025
**Autor:** Sistema Albuaves
**Estado:** ✅ Producción
