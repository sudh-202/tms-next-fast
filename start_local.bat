@echo off
echo Starting TMS - Task Management System
echo.

REM Start backend
start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload"

REM Wait a moment for backend to initialize
timeout /t 5

REM Start frontend
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 