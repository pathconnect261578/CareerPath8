Write-Host "Starting Gemini Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Change to backend directory
Set-Location "gemini-backend"

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host "The server will automatically find an available port." -ForegroundColor Cyan
Write-Host "If you see any errors, please check the console output." -ForegroundColor Cyan
Write-Host ""

# Start the server
node index.js 