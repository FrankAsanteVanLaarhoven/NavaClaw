#!/bin/bash

# DataMinerAI - Service Status
# This script checks the status of all services

echo "📊 DataMinerAI Service Status"
echo "============================="

# Function to check service status
check_service() {
    local port=$1
    local service_name=$2
    local pattern=$3
    
    echo -n "🔍 $service_name: "
    
    # Check if port is in use
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -n "✅ Running (Port $port) "
        
        # Check if process is running
        if pgrep -f "$pattern" >/dev/null 2>&1; then
            echo "✅ Process Active"
        else
            echo "⚠️  Port in use but process not found"
        fi
    else
        echo "❌ Not Running"
    fi
}

# Check each service
check_service 8000 "Python FastAPI Server" "python.*api_server.py"
check_service 3001 "Node.js Backend" "nodemon.*backend"
check_service 3000 "Next.js Frontend" "next.*dev"

echo ""
echo "🌐 Access Points:"
echo "   • Frontend (InsightsAI): http://localhost:3000"
echo "   • Backend API:           http://localhost:3001"
echo "   • Python API:            http://localhost:8000"
echo "   • API Documentation:     http://localhost:8000/docs"
echo ""
echo "📝 Logs:"
echo "   • Python server:         $(dirname "$0")/my-crawler-py/python_server.log"
echo "   • Node.js backend:       $(dirname "$0")/crawl-frontend/src/backend/backend_server.log"
echo "   • Next.js frontend:      $(dirname "$0")/crawl-frontend/frontend_server.log"
echo ""
echo "🛠️  Commands:"
echo "   • Start all:             ./start_all.sh"
echo "   • Stop all:              ./stop_all.sh"
echo "   • Start frontend only:   ./start_frontend.sh"
echo "   • Start backend only:    ./start_backend.sh"
echo "   • Start Python only:     ./start_python.sh"
echo "=============================" 