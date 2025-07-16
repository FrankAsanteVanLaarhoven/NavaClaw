#!/bin/bash

# DataMinerAI - Start Backend Only
# This script starts only the Node.js backend service

echo "🟢 Starting DataMinerAI Backend (Node.js + Express)"
echo "=================================================="

# Check if port 3001 is available
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3001 is already in use. Please stop the service using port 3001 first."
    exit 1
fi

# Kill any existing backend processes
echo "🧹 Cleaning up existing backend processes..."
pkill -f "nodemon.*backend" 2>/dev/null || true
pkill -f "ts-node.*app.ts" 2>/dev/null || true
sleep 2

# Start Node.js backend
echo "🚀 Starting Node.js backend..."
cd "$(dirname "$0")/crawl-frontend/src/backend"

if ! npm run dev > backend_server.log 2>&1 & then
    echo "❌ Failed to start Node.js backend"
    exit 1
fi

BACKEND_PID=$!
echo "✅ Node.js backend started (PID: $BACKEND_PID)"

# Save PID to file
echo "$BACKEND_PID" > "$(dirname "$0")/backend_pid.txt"

echo ""
echo "🎉 Backend is now running!"
echo "=================================================="
echo "🌐 Access Point: http://localhost:3001"
echo "📝 Log: $(dirname "$0")/crawl-frontend/src/backend/backend_server.log"
echo ""
echo "🛑 To stop backend, run: ./stop_backend.sh"
echo "=================================================="

# Keep script running and handle cleanup on exit
trap 'echo ""; echo "🛑 Shutting down backend..."; kill $BACKEND_PID 2>/dev/null || true; rm -f "$(dirname "$0")/backend_pid.txt"; echo "✅ Backend stopped"; exit 0' INT TERM

# Wait for user to stop
echo "Press Ctrl+C to stop backend..."
wait 