# EduTracker Enterprise ERP - One-Click Setup Script
# This script automates the installation and deployment of EduTracker for local network use.

$ErrorActionPreference = "Stop"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   🏫 EduTracker Enterprise ERP Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check for Node.js
Write-Host "[1/6] Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "Found Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed. Please download it from https://nodejs.org/" -ForegroundColor Red
    exit
}

# 2. Detect Local IP Address
Write-Host "[2/6] Detecting Local Network IP..." -ForegroundColor Yellow
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*" -and $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress
if (-not $localIp) {
    $localIp = "localhost"
    Write-Host "Warning: Could not detect local IP. Using 'localhost'." -ForegroundColor Gray
} else {
    Write-Host "Local Network IP detected: $localIp" -ForegroundColor Green
}

# Update .env file with detected IP
$envPath = Join-Path $PSScriptRoot ".env"
$apiUrl = "NEXT_PUBLIC_API_URL=`"http://$localIp`:5000/api`""
if (Test-Path $envPath) {
    $content = Get-Content $envPath
    if ($content -match "NEXT_PUBLIC_API_URL") {
        $content = $content -replace "NEXT_PUBLIC_API_URL=.*", $apiUrl
        $content | Set-Content $envPath
    } else {
        Add-Content $envPath "`n$apiUrl"
    }
} else {
    Set-Content $envPath $apiUrl
}
Write-Host "Configured API URL: http://$localIp`:5000/api" -ForegroundColor Gray

# 3. Install Dependencies
Write-Host "[3/6] Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
Write-Host "--- Root ---"
npm install --silent
Write-Host "--- Backend ---"
Set-Location backend
npm install --silent
Set-Location ..

# 4. Database Setup
Write-Host "[4/6] Setting up Database..." -ForegroundColor Yellow
Set-Location backend
npx prisma generate
npx prisma migrate deploy
Write-Host "Database schema and migrations applied." -ForegroundColor Green
Set-Location ..

# 5. Build Application
Write-Host "[5/6] Building application..." -ForegroundColor Yellow
npm run build --silent
Write-Host "Build completed." -ForegroundColor Green

# 6. Create Desktop Shortcut
Write-Host "[6/6] Creating Desktop Shortcut..." -ForegroundColor Yellow
$WshShell = New-Object -ComObject WScript.Shell
# More robust way to find Desktop folder (handles OneDrive redirection, etc.)
$DesktopPath = [Environment]::GetFolderPath("Desktop")

if (-not (Test-Path $DesktopPath)) {
    Write-Host "Warning: Desktop folder not found. Skipping shortcut creation." -ForegroundColor Gray
} else {
    try {
        $Shortcut = $WshShell.CreateShortcut("$DesktopPath\EduTracker ERP.lnk")
        $Shortcut.TargetPath = "http://$localIp`:6001"
        $Shortcut.Description = "Open EduTracker ERP on Local Network"
        # Use a safe icon location
        if (Test-Path "$PSScriptRoot\public\favicon.ico") {
            $Shortcut.IconLocation = "$PSScriptRoot\public\favicon.ico"
        }
        $Shortcut.Save()
        Write-Host "Shortcut created successfully on your Desktop." -ForegroundColor Green
    } catch {
        Write-Host "Warning: Could not create desktop shortcut. You can access the app at http://$localIp`:6001" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "   ✅ Setup Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "The system is now ready for use."
Write-Host "Local Network URL: http://$localIp`:6001" -ForegroundColor Cyan
Write-Host "A shortcut has been created on your Desktop."
Write-Host ""
Write-Host "To start the server, run: npm start" -ForegroundColor Yellow
Write-Host ""
pause
