#!/bin/bash

# DataMinerAI - Start Python Only
# This script starts only the Python FastAPI service

echo "🐍 Starting DataMinerAI Python Crawler (FastAPI)"
echo "==============================================="

# Check if port 8000 is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use. Please stop the service using port 8000 first."
    exit 1
fi

# Kill any existing Python processes
echo "🧹 Cleaning up existing Python processes..."
pkill -f "python.*api_server.py" 2>/dev/null || true
sleep 2

# Start Python FastAPI server
echo "🚀 Starting Python FastAPI server..."
cd "$(dirname "$0")/my-crawler-py"

if ! poetry run python api_server.py > python_server.log 2>&1 & then
    echo "❌ Failed to start Python server"
    exit 1
fi

PYTHON_PID=$!
echo "✅ Python server started (PID: $PYTHON_PID)"

# Save PID to file
echo "$PYTHON_PID" > "$(dirname "$0")/python_pid.txt"

echo ""
echo "🎉 Python server is now running!"
echo "==============================================="
echo "🌐 Access Point: http://localhost:8000"
echo "📚 API Docs:     http://localhost:8000/docs"
echo "📝 Log:          $(dirname "$0")/my-crawler-py/python_server.log"
echo ""
echo "🛑 To stop Python server, run: ./stop_python.sh"
echo "==============================================="

# Keep script running and handle cleanup on exit
trap 'echo ""; echo "🛑 Shutting down Python server..."; kill $PYTHON_PID 2>/dev/null || true; rm -f "$(dirname "$0")/python_pid.txt"; echo "✅ Python server stopped"; exit 0' INT TERM

# Wait for user to stop
echo "Press Ctrl+C to stop Python server..."
wait 