# Requires Run as Administrator
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "This script requires Administrator privileges. Please run PowerShell as Administrator."
    Exit
}

$ErrorActionPreference = "Stop"
$AppPath = $PSScriptRoot

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   🏫 eduTracker Enterprise - IIS Automated Installer" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Database Initialization
Write-Host "[1/4] Initializing PostgreSQL Database..." -ForegroundColor Yellow
$batPath = Join-Path $AppPath "backend\setup-database.bat"
if (Test-Path $batPath) {
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$batPath`"" -Wait -NoNewWindow
} else {
    Write-Host "Warning: setup-database.bat not found. Ensure the database is configured manually." -ForegroundColor Red
}

# 2. Enable IIS Features
Write-Host "`n[2/4] Verifying/Enabling Windows IIS Features..." -ForegroundColor Yellow
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-StaticContent, IIS-DefaultDocument, IIS-DirectoryBrowsing, IIS-HttpErrors -NoRestart -All | Out-Null
Write-Host "IIS base features enabled." -ForegroundColor Green

# 3. Import WebAdministration Module
Import-Module WebAdministration

# 4. Setup Backend API Site in IIS
Write-Host "`n[3/4] Configuring Backend API (Port 6002)..." -ForegroundColor Yellow
$BackendSiteName = "EduTracker-Backend"
$BackendPort = 6002
$BackendPath = Join-Path $AppPath "backend"

if (Test-Path "IIS:\Sites\$BackendSiteName") {
    Write-Host "Removing existing Backend site..." -ForegroundColor Gray
    Remove-WebSite -Name $BackendSiteName
}

New-WebSite -Name $BackendSiteName -Port $BackendPort -PhysicalPath $BackendPath -ApplicationPool "DefaultAppPool" -Force | Out-Null
Write-Host "Backend API site created successfully on port $BackendPort." -ForegroundColor Green

# 5. Setup Frontend Site in IIS
Write-Host "`n[4/4] Configuring Frontend App (Port 6001)..." -ForegroundColor Yellow
$FrontendSiteName = "EduTracker-Frontend"
$FrontendPort = 6001
$FrontendPath = $AppPath # Root folder contains next.js build

if (Test-Path "IIS:\Sites\$FrontendSiteName") {
    Write-Host "Removing existing Frontend site..." -ForegroundColor Gray
    Remove-WebSite -Name $FrontendSiteName
}

New-WebSite -Name $FrontendSiteName -Port $FrontendPort -PhysicalPath $FrontendPath -ApplicationPool "DefaultAppPool" -Force | Out-Null
Write-Host "Frontend application site created successfully on port $FrontendPort." -ForegroundColor Green

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "   ✅ INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Important Requirements:" -ForegroundColor Yellow
Write-Host "1. Ensure 'iisnode' is installed on this server."
Write-Host "2. Ensure 'URL Rewrite' module is installed in IIS."
Write-Host "3. Ensure your .env files are configured."
Write-Host ""
Write-Host "The application is now running as a background Windows Service."
Write-Host "Access the application at: http://localhost:$FrontendPort" -ForegroundColor Cyan
Write-Host ""
Pause
