# 🦅 Albuaves - Albufera Bird Management System

Complete dockerized system for managing and querying waterfowl from the Albufera of Valencia. Includes:
- 🌐 **Visual web interface** with bird gallery and images
- 📱 **REST API** in PHP with SQLite
- 💻 **Java client** to consume the API
- 🗄️ **Database** with 10 species of waterfowl

## Requirements

- Docker Desktop installed
- Docker Compose installed

**That's all.** You don't need to install PHP, Java, or any other dependencies on your system.

## Quick Start

Choose one of these options (all do the same thing automatically):

### Windows
```bash
run-docker.bat
```

### Linux/Mac/WSL
```bash
chmod +x start.sh
./start.sh
```

**Note:** The above scripts internally run `docker-compose up --build`, so you can also use directly:
```bash
docker-compose up --build
```

## Quick Access

Once the system is started, you have two ways to access it:

### 🌐 Option 1: Visual Web Interface (Recommended)

**URL:** http://localhost:9191/

This is the easiest and most visual way to explore the birds. You will see:
- 📷 **10 cards with images** of each waterfowl
- 🔍 **Real-time search** to filter birds by name
- ℹ️ **Complete information** for each bird (common name, scientific name, description)
- 📱 **Responsive design** that works on mobile, tablet and desktop

### 📡 Option 2: REST API (For developers)

**URL:** http://localhost:9191/api.php

#### Available endpoints

---

## 🖼️ Web Interface - Preview

### Screenshot of the interface

![Web Interface - Albuaves Bird Gallery](docimgs/Albuaves%20-%20Sistema%20de%20Gestión%20de%20Aves-1.png)

### What you will see in the interface

- **Header:** Title "🦅 Albuaves" with description
- **Search:** Real-time search box at the top
- **Gallery:** Grid of cards (2-4 columns depending on screen) with:
  - 📷 Image of each bird (high-quality real photos)
  - 🏷️ Common name
  - 🔬 Scientific name
  - 📝 Detailed description
- **Responsive:** Automatically adapts to mobile, tablet and desktop
- **Interactive:** Cards elevate on hover, with smooth visual effects

---

```bash
# Get all birds in JSON
curl http://localhost:9191/api.php

# Get a specific bird by ID
curl http://localhost:9191/api.php?id=1

# Or simply open in your browser:
http://localhost:9191/api.php
```

#### Example response
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

## Project Structure

```
UP02-Proyecto-DAM-Albuaves/
├── docker-compose.yml                    # Docker services orchestration
├── README.md                             # This file (documentation)
├── start.sh                              # Linux/Mac/WSL startup script
├── run-docker.sh                        # Detailed Linux/Mac startup script
├── run-docker.bat                       # Windows startup script
├── test-api.sh                          # Script to test the API
│
├── php/                                  # 🌐 WEB INTERFACE
│   ├── Dockerfile                       # Docker image PHP 8.2 + Apache
│   ├── api.php                          # REST API in PHP
│   ├── index.html                       # Main page (visual interface)
│   ├── style.css                        # Interface CSS styles
│   ├── script.js                        # JavaScript - interface logic
│   ├── .htaccess                        # Apache configuration (URL rewriting)
│   ├── router.php                       # Auxiliary router
│   └── imgs/aves/                       # 📷 BIRD IMAGES (10 photos)
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
├── java/                                 # 💻 JAVA CLIENT
│   ├── Dockerfile                       # Docker image Java 17
│   └── BuscadorAvesAPI.java             # Client that consumes the API
│
├── db/                                   # 🗄️ DATABASE
│   ├── albuaves.db                      # SQLite with 10 species
│   ├── albuaves-db-create.sql          # Table creation script
│   └── albuaves-tables-population.sql  # Data insertion script
│
└── libs/                                 # 📚 LIBRARIES
    ├── json-20250517.jar               # JSON parser for Java
    └── sqlite-jdbc.jar                 # SQLite JDBC driver
```

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Docker Compose                            │
│                                                                   │
│  ┌──────────────────────────────────┐  ┌────────────────────┐   │
│  │         api-php (Port 9191)       │  │   client-java      │   │
│  │     PHP 8.2 + Apache + SQLite     │◄─│   OpenJDK 17       │   │
│  │                                   │  │   Consumes API     │   │
│  │  ┌─ Visual Web Interface ────┐   │  │                    │   │
│  │  │ 🌐 index.html (HTML)       │   │  │  Healthcheck OK ✓  │   │
│  │  │ 🎨 style.css (CSS)         │   │  │  depends_on: api   │   │
│  │  │ ⚙️ script.js (JavaScript) │   │  │                    │   │
│  │  │ 📡 api.php (REST API)      │   │  └────────────────────┘   │
│  │  └────────────────────────────┘   │                           │
│  │                                   │                           │
│  │  ┌─ Bird Images ─────────────┐   │                           │
│  │  │ 📷 imgs/aves/              │   │                           │
│  │  │   ├── martinete.jpg        │   │                           │
│  │  │   ├── garza_real.jpg       │   │                           │
│  │  │   ├── flamenco_comun.jpg   │   │                           │
│  │  │   └── ... (10 images)      │   │                           │
│  │  └────────────────────────────┘   │                           │
│  └──────────────────────────────────┘                           │
│             │                                                     │
│             ▼                                                     │
│  ┌──────────────────────────────────┐                           │
│  │      SQLite database             │                           │
│  │      albuaves.db                 │                           │
│  │  (10 bird species)               │                           │
│  └──────────────────────────────────┘                           │
│                                                                   │
│         Private network: albuaves-network (Bridge)               │
└──────────────────────────────────────────────────────────────────┘
```

## Services

### 🌐 PHP API + Web Interface (api-php)
- **Port:** 9191
- **Technology:** PHP 8.2 + Apache
- **Access:**
  - Visual interface: http://localhost:9191/
  - JSON API: http://localhost:9191/api.php
- **Database:** SQLite3 with 10 bird species
- **Healthcheck:** Verifies that the API responds before starting other services
- **Features:**
  - Modern and responsive web interface
  - Real-time search
  - 10 high-quality bird images
  - REST API for developers

### 💻 Java Client (client-java)
- **Function:** Consumes the API and displays results in a console table
- **Technology:** OpenJDK 17 + JSON and SQLite JDBC libraries
- **Execution:** Automatic after the API is ready
- **Dependencies:** Runs only after healthcheck OK

## 🌐 Web Interface Guide

### What is it?
The web interface is a modern and easy-to-use application to explore the 10 waterfowl species of the Albufera. No technical knowledge required.

### How do I access it?
Simply open in your browser: **http://localhost:9191/**

### Main features

#### 1. **Bird Gallery**
The main page displays a grid of cards, each with:
- 📷 **Species image** (high-quality real photograph)
- 🏷️ **Common name** (e.g., "Martinete")
- 🔬 **Scientific name** (e.g., "Nycticorax nycticorax")
- 📝 **Description** of the species
- 🆔 **ID** for API reference

#### 2. **Real-time Search**
At the top there is a search box that allows you to:
- Type the common or scientific name of a bird
- Automatically filters as you type
- Shows the number of results found
- You can also search by description

#### 3. **Responsive Design**
- ✅ Works on **desktop computer**
- ✅ Works on **tablet**
- ✅ Works on **mobile**
- Cards automatically adapt to screen size

#### 4. **Visual Effects**
- When hovering over a card, it elevates slightly
- Images zoom on hover
- Smooth transitions for a better experience

### 10 Available Birds

| ID | Common Name | Scientific Name | Image |
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

### Web Interface Technology

**Frontend:**
- HTML5 for structure
- CSS3 with modern design and gradients
- Vanilla JavaScript (no external dependencies)
- Fetch API for server communication

**Backend:**
- PHP 8.2 with Apache
- REST API that returns JSON
- SQLite3 as database

**Technical features:**
- No npm dependencies or build tools
- Image loading with lazy loading
- XSS prevention (HTML escaping)
- Intelligent HTTP cache for images
- CORS enabled for consumption from other applications

## Useful Commands

### Service management
```bash
# Build and start everything
docker-compose up --build

# Start in background
docker-compose up -d

# View logs in real time
docker-compose logs -f

# View logs of a specific service
docker-compose logs api-php
docker-compose logs client-java

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache
```

### Verification
```bash
# Check running containers
docker ps

# Test the API
curl http://localhost:9191/api.php

# Enter the API container
docker-compose exec api-php sh

# Enter the client container
docker-compose exec client-java sh
```

## Troubleshooting

### Web interface loads but without images

**Cause:** Browser cache. The browser has old versions of the files cached.

**Solution:**

**Option 1: Clear browser cache (Recommended)**
```bash
1. Press: Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
2. Select "Clear cache"
3. Press: Ctrl+F5 at http://localhost:9191/
```

**Option 2: Use private/incognito browser**
```bash
1. Open an incognito window (Ctrl+Shift+N)
2. Go to http://localhost:9191/
```

**Option 3: Clear Docker cache**
```bash
docker-compose down -v
docker-compose up --build
```

### Port 9191 not responding

**Cause:** You probably used `docker run` instead of `docker-compose`, or there's another process using the port.

**Solution:**
```bash
# Stop everything
docker stop $(docker ps -aq)

# Verify that the port is free
lsof -i :9191  # (on Linux/Mac)
netstat -ano | findstr :9191  # (on Windows)

# Use docker-compose
docker-compose up --build
```

### Error: "Cannot connect to the Docker daemon"
```bash
# Make sure Docker Desktop is started

# On Linux/WSL
sudo systemctl start docker
# or
sudo service docker start
```

### Error: "Permission denied" on scripts
```bash
# Give execution permissions
chmod +x start.sh
chmod +x run-docker.sh
```

### Error: "docker-compose: command not found"
```bash
# Option 1: Install docker-compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Option 2: Use docker compose (without hyphen)
docker compose up --build
```

### API responds but client fails
```bash
# View client logs
docker-compose logs client-java

# Check connectivity between containers
docker-compose exec client-java ping api-php
```

### Start from scratch
```bash
# Remove everything (containers, images, volumes)
docker-compose down -v --rmi all

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

## Database

### Schema of the `aves` table
```sql
CREATE TABLE aves (
  id_ave INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_comun TEXT NOT NULL,
  nombre_cientifico TEXT NOT NULL,
  descripcion TEXT,
  imagen_url TEXT
);
```

### Included birds
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

## Technical Features

- **Portability:** Works on Windows, Linux and macOS
- **Isolation:** Doesn't contaminate the system with dependencies
- **Automation:** Scripts for one-command deployment
- **Healthchecks:** Ensures the API is ready before starting the client
- **Volumes:** Database mounted as read-only for security
- **Private network:** Secure communication between containers
- **Environment variables:** Flexible Java client configuration

## Development

### Modify the PHP API
1. Edit `php/api.php`
2. Restart the service: `docker-compose restart api-php`

### Modify the Java client
1. Edit `java/BuscadorAvesAPI.java`
2. Rebuild: `docker-compose build client-java`
3. Run: `docker-compose up client-java`

### Modify the database
1. Edit `db/albuaves.db` with an SQLite client
2. Restart the service: `docker-compose restart api-php`

## Used Libraries

- **JSON for Java:** https://github.com/stleary/JSON-java (json-20250517.jar)
- **SQLite JDBC:** JDBC driver for SQLite (sqlite-jdbc.jar)

## Main Features ✨

### Web Interface
- ✅ **Modern and responsive interface** - Works on any device
- ✅ **Visual gallery** - 10 cards with real bird images
- ✅ **Real-time search** - Filter birds as you type
- ✅ **Complete information** - Common name, scientific name and description
- ✅ **Attractive design** - Natural colors and visual effects

### REST API
- ✅ **JSON endpoints** - Programmatic access to all data
- ✅ **CORS enabled** - Consumable from any application
- ✅ **Clear documentation** - Easy to use
- ✅ **SQLite3** - Lightweight and reliable database

### Database
- ✅ **10 documented species** - Waterfowl from the Albufera
- ✅ **Complete information** - Names, descriptions
- ✅ **Sighting tables** - Record of observations
- ✅ **Pre-populated data** - Ready to use

### Security and Quality
- ✅ **XSS prevention** - HTML escaping in interface
- ✅ **Healthcheck** - Automatic service verification
- ✅ **Isolation** - Separate Docker containers
- ✅ **Private network** - Secure communication between services

## Important Notes

1. **Use docker-compose** - Not docker run directly
2. **Port 9191 must be free** on your system
3. **The API takes a few seconds** to be ready (automatic healthcheck)
4. **The Java client runs automatically** when the API is ready
5. **The .sh scripts require execution permissions** on Linux/Mac
6. **Optimized web interface** - No external dependencies (npm, build tools)
7. **High-quality images** - Included directly in the project

## Changes in Version 2.0

**New features added (November 2025):**
- 🌐 Complete visual web interface
- 📷 10 high-quality bird images
- 🔍 Real-time search
- 📱 Responsive design (mobile, tablet, desktop)
- 🎨 Modern CSS styles with gradients
- ⚙️ Pure JavaScript without dependencies
- 🗄️ Updated database with image URLs
- 📚 Complete documentation

## License

Educational project for the Multiplatform Application Development (DAM) module.

---

**Version:** 2.0
**Last update:** November 11, 2025
**Author:** Albuaves System
**Status:** ✅ Production
