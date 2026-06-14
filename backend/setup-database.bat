@echo off
echo ========================================================
echo        eduTracker Database Initial Setup
echo ========================================================
echo.
echo This script will create all necessary database tables
echo and columns on this server.
echo.
echo Please ensure that PostgreSQL is installed and the
echo DATABASE_URL in the .env file is correct.
echo.
pause

echo.
echo [1/3] Applying Database Migrations (Creating Tables)...
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Database migration failed. Please check your .env database credentials.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Prisma client generation failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Seeding Initial Data (Default Admin, Settings)...
call npx ts-node prisma/seed-client.ts
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Database seeding failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo        DATABASE SETUP COMPLETED SUCCESSFULLY!
echo ========================================================
echo You can now start the application.
echo.
pause
