#!/bin/bash

echo "Starting Record to Text Application..."
echo

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo "📝 You may want to edit .env for your specific configuration"
    else
        echo "❌ No .env.example found. Using default values."
    fi
    echo
fi

# Load environment variables for display
source .env 2>/dev/null || true

echo "🔧 Configuration:"
echo "   Backend: ${BACKEND_HOST:-0.0.0.0}:${BACKEND_PORT:-8000}"
echo "   Frontend: ${VITE_DEV_HOST:-localhost}:${VITE_DEV_PORT:-5173}"
echo "   API URL: ${VITE_API_BASE_URL:-http://localhost:8000}"
echo

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📦 Installing Node.js dependencies..."
npm install

echo
echo "🚀 Starting applications..."
echo "   Backend will start on http://${BACKEND_HOST:-0.0.0.0}:${BACKEND_PORT:-8000}"
echo "   Frontend will start on http://${VITE_DEV_HOST:-localhost}:${VITE_DEV_PORT:-5173}"
echo

# Start backend in background
echo "🐍 Starting backend..."
cd backend && python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Return to root directory and start frontend
cd ..
echo "⚛️  Starting frontend..."
npm run dev &
FRONTEND_PID=$!

# Function to handle cleanup
cleanup() {
    echo
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo
echo "✅ Services started! Press Ctrl+C to stop."
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo
echo "📱 Open your browser to:"
echo "   🌐 Frontend: http://${VITE_DEV_HOST:-localhost}:${VITE_DEV_PORT:-5173}"
echo "   🔌 Backend API: http://${BACKEND_HOST:-0.0.0.0}:${BACKEND_PORT:-8000}"
echo "   🏥 Health Check: http://${BACKEND_HOST:-0.0.0.0}:${BACKEND_PORT:-8000}/health"

# Wait for user to stop
wait 