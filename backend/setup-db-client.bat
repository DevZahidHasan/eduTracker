@echo off
echo ===================================================
echo   EduTracker Client Database Setup Tool
echo ===================================================
echo.

set /p DB_URL="Enter Database URL (e.g. postgresql://user:pass@localhost:5432/db): "

if "%DB_URL%"=="" (
    echo Database URL cannot be empty.
    pause
    exit /b 1
)

echo.
echo Setting up environment variables...
set "SECRET1=%RANDOM%%RANDOM%%RANDOM%%RANDOM%"
set "SECRET2=%RANDOM%%RANDOM%%RANDOM%%RANDOM%"

(
echo DATABASE_URL="%DB_URL%"
echo PORT=5000
echo NODE_ENV=production
echo ACCESS_TOKEN_SECRET="%SECRET1%"
echo REFRESH_TOKEN_SECRET="%SECRET2%"
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_USER="your-school@gmail.com"
echo SMTP_PASS="your-app-password"
echo FRONTEND_URL="http://localhost:6001"
echo RATE_LIMIT_MAX=1000
echo AUTH_LIMIT_MAX=20
) > .env

echo.
echo [OK] .env file created with new security secrets.
echo [IMPORTANT] Please edit .env later to add your real SMTP/Email details.

echo.
echo Step 1: Generating Prisma Client...
call npx prisma generate

echo.
echo Step 2: Creating Database Tables (Running Migrations)...
call npx prisma migrate deploy

echo.
echo Step 3: Seeding Professional Templates and Admin User...
call npx ts-node prisma/seed-client.ts

echo.
echo ===================================================
echo   DATABASE SETUP COMPLETED!
echo   Admin Email: admin@school.com
echo   Admin Password: admin123
echo ===================================================
echo.
pause
