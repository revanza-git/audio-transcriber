@echo off
echo Starting Record to Text Application...
echo.

REM Check if .env file exists
if not exist .env (
    echo WARNING: No .env file found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env > nul
        echo SUCCESS: Created .env file from .env.example
        echo NOTE: You may want to edit .env for your specific configuration
    ) else (
        echo ERROR: No .env.example found. Using default values.
    )
    echo.
)

REM Load and display basic configuration
echo Configuration:
echo    Backend: localhost:8000 (default)
echo    Frontend: localhost:5173 (default)
echo    API URL: http://localhost:8000 (default)
echo.

echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo Starting applications...
echo    Backend will start on http://localhost:8000
echo    Frontend will start on http://localhost:5173
echo.

echo Starting services in separate windows...
start "Record to Text - Backend API" cmd /k "cd backend && python main.py"
start "Record to Text - Frontend" cmd /k "npm run dev"

echo.
echo SUCCESS: Both services are starting in separate windows...
echo.
echo Open your browser to:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000
echo    Health Check: http://localhost:8000/health
echo.
echo Press any key to exit this window (services will continue running)
pause > nul 