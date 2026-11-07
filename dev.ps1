# WIPPEL Development Startup Script
# This script starts both backend and frontend servers concurrently

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WIPPEL Development Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists in backend
if (-Not (Test-Path "backend\.env")) {
    Write-Host "[WARNING] backend\.env not found!" -ForegroundColor Yellow
    Write-Host "Creating backend\.env from template..." -ForegroundColor Yellow
    
    # Check if backend exists
    if (Test-Path "backend") {
        Copy-Item "backend\.env" "backend\.env" -ErrorAction SilentlyContinue
    }
    Write-Host "Please configure backend\.env with your credentials" -ForegroundColor Yellow
    Write-Host ""
}

# Check if frontend .env.local exists
if (-Not (Test-Path "frontend\.env.local")) {
    Write-Host "[WARNING] frontend\.env.local not found!" -ForegroundColor Yellow
    Write-Host "Creating frontend\.env.local..." -ForegroundColor Yellow
    
    @"
NEXT_PUBLIC_BACKEND_URL=http://localhost:9050
"@ | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    
    Write-Host "Created frontend\.env.local" -ForegroundColor Green
    Write-Host ""
}

Write-Host "[INFO] Starting WIPPEL development servers..." -ForegroundColor Green
Write-Host "[INFO] Backend will run on http://localhost:9050" -ForegroundColor Green
Write-Host "[INFO] Frontend will run on http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers using npm (which will use concurrently)
npm run dev
