#!/bin/bash

set -e  # Exit if any error occurs

echo "======================================"
echo "  Starting Albuaves with Docker"
echo "======================================"
echo ""

# Stop and clean previous containers
echo "[1/4] Cleaning previous containers..."
docker-compose down 2>/dev/null || true

# Build images
echo ""
echo "[2/4] Building Docker images..."
if ! docker-compose build; then
    echo ""
    echo "ERROR: Failed to build Docker images"
    exit 1
fi

# Start services
echo ""
echo "[3/4] Starting services..."
if ! docker-compose up -d api-php; then
    echo ""
    echo "ERROR: Failed to start API service"
    exit 1
fi

# Wait for API to be ready
echo ""
echo "[4/4] Waiting for API to be ready..."
echo "📡 API available at: http://localhost:9191/api.php"
echo "Waiting for healthcheck..."
sleep 10

# Run Java client
echo ""
echo "======================================"
echo "  Running Java client"
echo "======================================"
echo ""
docker-compose up client-java

echo ""
echo "======================================"
echo "  Process completed"
echo "======================================"
echo ""

# Improved visual message with links and examples
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ ALBUAVES STARTED SUCCESSFULLY                ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 APPLICATION ACCESS:"
echo ""
echo "🌐 Web Interface (End users):"
echo "   URL: http://localhost:9191"
echo "   Description: Visual gallery of waterfowl"
echo ""
echo "💻 REST API (Developers):"
echo "   Base URL: http://localhost:9191/api.php"
echo "   Description: Programmatic access to the bird database"
echo ""
echo "────────────────────────────────────────────────────────────────────"
echo ""
echo "📝 USAGE EXAMPLES:"
echo ""
echo "  • Get all birds:"
echo "    curl 'http://localhost:9191/api.php?action=list'"
echo ""
echo "  • Query a specific bird (ID=1):"
echo "    curl 'http://localhost:9191/api.php?action=get&id=1'"
echo ""
echo "  • View formatted response (ID=1):"
echo "    curl -s 'http://localhost:9191/api.php?action=get&id=1' | jq ."
echo ""
echo "────────────────────────────────────────────────────────────────────"
echo ""
echo "🛑 To stop the services, run:"
echo "   docker-compose down"
echo ""

exit 0
