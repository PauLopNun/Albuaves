#!/bin/bash

echo "=========================================="
echo "  Testing Albuaves API"
echo "=========================================="
echo ""

# Wait a moment for the API to be ready
echo "Waiting 3 seconds for the API to be ready..."
sleep 3

echo ""
echo "Testing endpoint: http://localhost:9191/api.php"
echo ""

# Test the API with curl
if command -v curl &> /dev/null; then
    echo "Result:"
    echo "----------------------------------------"
    curl -s http://localhost:9191/api.php | head -n 20
    echo ""
    echo "----------------------------------------"
    echo ""

    # Verify if the API responded
    if [ $? -eq 0 ]; then
        echo "✅ The API is working correctly at http://localhost:9191/api.php"
    else
        echo "❌ Error: The API is not responding. Verify that Docker is running."
        echo ""
        echo "Run: docker-compose ps"
        echo "You should see the 'albuaves-api' container running."
    fi
else
    echo "⚠️  curl is not installed. Try in your browser:"
    echo "   http://localhost:9191/api.php"
fi

echo ""
echo "=========================================="
