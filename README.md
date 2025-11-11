# Albuaves - Sistema de Gestión de Aves de la Albufera

Sistema completo dockerizado para gestión y consulta de aves de la Albufera de Valencia. Incluye una API REST en PHP con SQLite y un cliente Java para consumir la API.

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

## Acceder a la API

Una vez iniciado el sistema, la API estará disponible en:

**URL:** http://localhost:9191/api.php

### Endpoints disponibles

```bash
# Obtener todas las aves
curl http://localhost:9191/api.php

# Obtener un ave específica por ID
curl http://localhost:9191/api.php?id=1

# O simplemente abre en tu navegador:
http://localhost:9191/api.php
```

### Respuesta ejemplo
```json
[
  {
    "id_ave": 1,
    "nombre_comun": "Martinete",
    "nombre_cientifico": "Nycticorax nycticorax",
    "descripcion": "Ave nocturna de plumaje blanco y negro, común en humedales.",
    "imagen_url": "./imgs/aves//martinete.jpg"
  },
  ...
]
```

## Estructura del Proyecto

```
UP02-Proyecto-DAM-Albuaves/
├── docker-compose.yml          # Orquestación de servicios
├── start.sh                    # Script inicio Linux/Mac/WSL
├── run-docker.sh              # Script inicio detallado Linux/Mac
├── run-docker.bat             # Script inicio Windows
├── php/
│   ├── Dockerfile             # Imagen Docker PHP
│   └── api.php                # API REST
├── java/
│   ├── Dockerfile             # Imagen Docker Java
│   └── BuscadorAvesAPI.java   # Cliente que consume la API
├── db/
│   ├── albuaves.db            # Base de datos SQLite
│   ├── albuaves-db-create.sql # Script creación DB
│   └── albuaves-tables-population.sql # Script población datos
└── libs/
    ├── json-20250517.jar      # Librería JSON para Java
    └── sqlite-jdbc.jar        # Driver JDBC SQLite
```

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
│                                                          │
│  ┌─────────────────────┐      ┌────────────────────┐   │
│  │   api-php           │      │   client-java      │   │
│  │   PHP 8.2 + SQLite  │◄─────│   OpenJDK 17       │   │
│  │   Puerto: 9191      │      │   Consume API      │   │
│  │                     │      │                    │   │
│  │   Healthcheck ✓     │      │   Depends_on       │   │
│  └──────────┬──────────┘      └────────────────────┘   │
│             │                                            │
│             ▼                                            │
│  ┌─────────────────────┐                                │
│  │   Base de datos     │                                │
│  │   albuaves.db       │                                │
│  │   (SQLite)          │                                │
│  └─────────────────────┘                                │
│                                                          │
│         albuaves-network (Bridge)                        │
└─────────────────────────────────────────────────────────┘
```

## Servicios

### API PHP (api-php)
- **Puerto:** 9191
- **Acceso:** http://localhost:9191/api.php
- **Base de datos:** SQLite3
- **Healthcheck:** Verifica que la API responde antes de iniciar el cliente

### Cliente Java (client-java)
- **Función:** Consume la API y muestra los resultados en formato tabla
- **Dependencias:** Librerías JSON y SQLite JDBC incluidas
- **Ejecución:** Automática después de que la API esté lista

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

### El puerto 9191 no responde

**Causa:** Probablemente usaste `docker run` en lugar de `docker-compose`.

**Solución:**
```bash
# Detener todo
docker stop $(docker ps -aq)

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

## Notas Importantes

1. **Usa docker-compose, no docker run directamente**
2. **El puerto 9191 debe estar libre** en tu sistema
3. **La API tarda unos segundos** en estar lista (healthcheck)
4. **El cliente Java se ejecuta automáticamente** cuando la API está lista
5. **Los scripts .sh requieren permisos de ejecución** en Linux/Mac

## Licencia

Proyecto educativo para el módulo de Desarrollo de Aplicaciones Multiplataforma (DAM).

---

**Versión:** 1.0
**Última actualización:** 11 de noviembre de 2025
