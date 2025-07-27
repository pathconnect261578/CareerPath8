@echo off
echo Starting Gemini Backend Server...
echo.
echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found. Checking dependencies...
cd gemini-backend
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

echo Starting backend server...
echo.
echo The server will automatically find an available port.
echo If you see any errors, please check the console output.
echo.
node index.js
pause 