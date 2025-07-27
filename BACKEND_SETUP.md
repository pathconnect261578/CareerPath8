# Backend Setup Instructions

## Quick Start

### Option 1: Using PowerShell (Recommended)
```powershell
cd pathconnect
.\start-backend.ps1
```

### Option 2: Using Command Prompt
```cmd
cd pathconnect
start-backend.bat
```

### Option 3: Manual Start
```bash
cd pathconnect/gemini-backend
node index.js
```

## What You Should See
When the backend starts successfully, you should see:
```
🚀 Gemini backend running on port 8080
📡 Ready to generate career roadmaps!
🔗 Test endpoint: http://localhost:8080/test
```

## Troubleshooting

1. **If you get "port already in use" error:**
   - Press Ctrl+C to stop the server
   - Wait 10 seconds and try again

2. **If the frontend shows "Disconnected":**
   - Make sure the backend is running
   - Check that port 8080 is not blocked
   - Try refreshing the frontend page

3. **If you get module not found errors:**
   ```bash
   cd pathconnect/gemini-backend
   npm install
   node index.js
   ```

## Testing the Backend
Once the backend is running, you can test it by visiting:
http://localhost:8080/test

You should see: `{"message":"Backend is working!"}` 