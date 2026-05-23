# EduTracker Deployment Script: Database Schema Initialization
# This script initializes the database structure without seeding any dummy data.

Write-Host "Checking for environment configuration..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found in the root directory." -ForegroundColor Red
    Write-Host "Please create a .env file with DATABASE_URL before running this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "Initializing backend database schema..." -ForegroundColor Cyan
cd backend

# Ensure Prisma client is generated
Write-Host "Generating Prisma Client..." -ForegroundColor Gray
npx prisma generate

# Apply all migrations to build the structure
Write-Host "Applying migrations..." -ForegroundColor Gray
npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDatabase schema has been successfully built!" -ForegroundColor Green
    Write-Host "All tables and columns are ready for use." -ForegroundColor Green
} else {
    Write-Host "`nFailed to initialize database schema. Please check your DATABASE_URL and connection." -ForegroundColor Red
}

cd ..
