#!/bin/bash

# DataMinerAI - Start Frontend Only
# This script starts only the Next.js frontend service

echo "⚛️  Starting DataMinerAI Frontend (Next.js)"
echo "=========================================="

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Please stop the service using port 3000 first."
    exit 1
fi

# Kill any existing frontend processes
echo "🧹 Cleaning up existing frontend processes..."
pkill -f "next.*dev" 2>/dev/null || true
sleep 2

# Start Next.js frontend
echo "🚀 Starting Next.js frontend..."
cd "$(dirname "$0")/crawl-frontend"

if ! npm run dev > frontend_server.log 2>&1 & then
    echo "❌ Failed to start Next.js frontend"
    exit 1
fi

FRONTEND_PID=$!
echo "✅ Next.js frontend started (PID: $FRONTEND_PID)"

# Save PID to file
echo "$FRONTEND_PID" > "$(dirname "$0")/frontend_pid.txt"

echo ""
echo "🎉 Frontend is now running!"
echo "=========================================="
echo "🌐 Access Point: http://localhost:3000"
echo "📝 Log: $(dirname "$0")/crawl-frontend/frontend_server.log"
echo ""
echo "🛑 To stop frontend, run: ./stop_frontend.sh"
echo "=========================================="

# Keep script running and handle cleanup on exit
trap 'echo ""; echo "🛑 Shutting down frontend..."; kill $FRONTEND_PID 2>/dev/null || true; rm -f "$(dirname "$0")/frontend_pid.txt"; echo "✅ Frontend stopped"; exit 0' INT TERM

# Wait for user to stop
echo "Press Ctrl+C to stop frontend..."
wait 