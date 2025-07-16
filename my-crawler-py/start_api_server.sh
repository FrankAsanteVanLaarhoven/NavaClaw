#!/bin/bash

# Start the My-Crawler API Server
echo "Starting My-Crawler API Server..."

# Navigate to the project directory
cd "$(dirname "$0")"

# Install dependencies if needed
echo "Installing dependencies..."
poetry install

# Start the API server
echo "Starting FastAPI server on http://localhost:8000"
echo "API documentation available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the API server
poetry run python api_server.py 