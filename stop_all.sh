#!/bin/bash

# DataMinerAI - Stop All Services
# This script stops all running services and cleans up processes

echo "🛑 Stopping DataMinerAI - Advanced Web Crawling & Analytics Platform"
echo "================================================================"

# Function to kill processes by pattern
kill_processes() {
    local pattern=$1
    local service_name=$2
    
    echo "🔄 Stopping $service_name..."
    pkill -f "$pattern" 2>/dev/null || true
    
    # Wait a moment for processes to stop
    sleep 2
    
    # Check if any processes are still running
    if pgrep -f "$pattern" >/dev/null 2>&1; then
        echo "⚠️  Some $service_name processes are still running, force killing..."
        pkill -9 -f "$pattern" 2>/dev/null || true
    fi
    
    echo "✅ $service_name stopped"
}

# Kill processes by pattern
kill_processes "python.*api_server.py" "Python FastAPI server"
kill_processes "nodemon.*backend" "Node.js backend"
kill_processes "next.*dev" "Next.js frontend"
kill_processes "ts-node.*app.ts" "TypeScript backend"

# Remove PID file if it exists
if [ -f "$(dirname "$0")/running_pids.txt" ]; then
    echo "🧹 Cleaning up PID file..."
    rm -f "$(dirname "$0")/running_pids.txt"
fi

# Clean up log files
echo "🧹 Cleaning up log files..."
rm -f "$(dirname "$0")/my-crawler-py/python_server.log" 2>/dev/null || true
rm -f "$(dirname "$0")/crawl-frontend/src/backend/backend_server.log" 2>/dev/null || true
rm -f "$(dirname "$0")/crawl-frontend/frontend_server.log" 2>/dev/null || true

echo ""
echo "✅ All DataMinerAI services have been stopped"
echo "================================================================"
echo "To restart all services, run: ./start_all.sh" 