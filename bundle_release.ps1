# EduTracker Enterprise - Release Bundler
# This script creates a "Code-Free" production package for clients.

$ReleaseFolder = "EduTracker_Release"
$ErrorActionPreference = "Stop"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   📦 Creating Production Release Package" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Clean previous release
if (Test-Path $ReleaseFolder) {
    Write-Host "Cleaning old release folder..." -ForegroundColor Gray
    Remove-Item -Recurse -Force $ReleaseFolder
}
New-Item -ItemType Directory -Path $ReleaseFolder

# 2. Build Frontend & Backend
Write-Host "Building Frontend production files..." -ForegroundColor Yellow
npm run build
Write-Host "Building Backend production files..." -ForegroundColor Yellow
Set-Location backend
npm run build
Set-Location ..

# 3. Copy necessary files
Write-Host "Gathering production assets..." -ForegroundColor Yellow

# Frontend assets
Copy-Item -Recurse ".next" -Destination "$ReleaseFolder\.next"
Copy-Item -Recurse "public" -Destination "$ReleaseFolder\public"
Copy-Item "package.json" -Destination "$ReleaseFolder\package.json"
Copy-Item "package-lock.json" -Destination "$ReleaseFolder\package-lock.json"
Copy-Item ".env" -Destination "$ReleaseFolder\.env"

# Backend assets
New-Item -ItemType Directory -Path "$ReleaseFolder\backend"
Copy-Item -Recurse "backend\dist" -Destination "$ReleaseFolder\backend\dist"
Copy-Item -Recurse "backend\prisma" -Destination "$ReleaseFolder\backend\prisma"
Copy-Item "backend\package.json" -Destination "$ReleaseFolder\backend\package.json"
Copy-Item "backend\package-lock.json" -Destination "$ReleaseFolder\backend\package-lock.json"
Copy-Item "backend\.env" -Destination "$ReleaseFolder\backend\.env"

# Operational Scripts & Docs
Copy-Item "setup.ps1" -Destination "$ReleaseFolder\setup.ps1"
Copy-Item "START_SYSTEM.bat" -Destination "$ReleaseFolder\START_SYSTEM.bat"
Copy-Item "CLIENT_DEPLOYMENT_GUIDE.md" -Destination "$ReleaseFolder\CLIENT_DEPLOYMENT_GUIDE.md"
Copy-Item -Recurse "business_document" -Destination "$ReleaseFolder\business_document"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "   ✅ RELEASE READY: $ReleaseFolder" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "You can now copy the '$ReleaseFolder' folder to a USB drive for the client."
Write-Host "The source code (src) has been successfully excluded."
Write-Host ""
pause
