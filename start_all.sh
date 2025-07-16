#!/bin/bash

# DataMinerAI - Start All Services
# This script starts all three services in the correct order

echo "🚀 Starting DataMinerAI - Advanced Web Crawling & Analytics Platform"
echo "================================================================"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using port $1 first."
        return 1
    fi
    return 0
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready..."
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts - waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo "❌ $service_name failed to start within expected time"
    return 1
}

# Check if ports are available
echo "🔍 Checking port availability..."
if ! check_port 8000; then exit 1; fi
if ! check_port 3001; then exit 1; fi
if ! check_port 3000; then exit 1; fi

echo "✅ All ports are available"

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "python.*api_server.py" 2>/dev/null || true
pkill -f "nodemon.*backend" 2>/dev/null || true
pkill -f "next.*dev" 2>/dev/null || true

sleep 2

# Start Python FastAPI server
echo ""
echo "🐍 Starting Python FastAPI server..."
cd "$(dirname "$0")/my-crawler-py"
if ! poetry run python api_server.py > python_server.log 2>&1 & then
    echo "❌ Failed to start Python server"
    exit 1
fi
PYTHON_PID=$!
echo "✅ Python server started (PID: $PYTHON_PID)"

# Wait for Python server to be ready
if ! wait_for_service "http://localhost:8000" "Python FastAPI server"; then
    echo "❌ Python server failed to start properly"
    kill $PYTHON_PID 2>/dev/null || true
    exit 1
fi

# Start Node.js backend
echo ""
echo "🟢 Starting Node.js backend..."
cd "$(dirname "$0")/crawl-frontend/src/backend"
if ! npm run dev > backend_server.log 2>&1 & then
    echo "❌ Failed to start Node.js backend"
    kill $PYTHON_PID 2>/dev/null || true
    exit 1
fi
BACKEND_PID=$!
echo "✅ Node.js backend started (PID: $BACKEND_PID)"

# Wait for backend to be ready
if ! wait_for_service "http://localhost:3001" "Node.js backend"; then
    echo "❌ Node.js backend failed to start properly"
    kill $PYTHON_PID $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start Next.js frontend
echo ""
echo "⚛️  Starting Next.js frontend..."
cd "$(dirname "$0")/crawl-frontend"
if ! npm run dev > frontend_server.log 2>&1 & then
    echo "❌ Failed to start Next.js frontend"
    kill $PYTHON_PID $BACKEND_PID 2>/dev/null || true
    exit 1
fi
FRONTEND_PID=$!
echo "✅ Next.js frontend started (PID: $FRONTEND_PID)"

# Wait for frontend to be ready
if ! wait_for_service "http://localhost:3000" "Next.js frontend"; then
    echo "❌ Next.js frontend failed to start properly"
    kill $PYTHON_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

# Save PIDs to file for easy cleanup
echo "$PYTHON_PID $BACKEND_PID $FRONTEND_PID" > "$(dirname "$0")/running_pids.txt"

echo ""
echo "🎉 DataMinerAI is now running!"
echo "================================================================"
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
echo "🛑 To stop all services, run: ./stop_all.sh"
echo "================================================================"

# Keep script running and handle cleanup on exit
trap 'echo ""; echo "🛑 Shutting down DataMinerAI..."; kill $PYTHON_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; rm -f "$(dirname "$0")/running_pids.txt"; echo "✅ All services stopped"; exit 0' INT TERM

# Wait for user to stop
echo "Press Ctrl+C to stop all services..."
wait 