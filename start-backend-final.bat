@echo off
echo ========================================
echo    AI Career Path Generator Backend
echo ========================================
echo.
echo Stopping any existing backend processes...
taskkill /f /im node.exe >nul 2>&1
echo.
echo Starting backend server...
echo The server will automatically find an available port.
echo.

cd gemini-backend
node index.js

pause 