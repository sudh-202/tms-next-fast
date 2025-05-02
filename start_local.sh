#!/bin/bash

echo "Starting TMS - Task Management System"
echo ""

# Start backend in a new terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload"'
else
    # Linux
    gnome-terminal -- bash -c "cd $(pwd)/backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload; exec bash"
fi

# Wait a moment for backend to initialize
sleep 5

# Start frontend in a new terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/frontend && npm install && npm run dev"'
else
    # Linux
    gnome-terminal -- bash -c "cd $(pwd)/frontend && npm install && npm run dev; exec bash"
fi

echo ""
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to exit this script..."

# Keep the script running
while true; do
    sleep 1
done 