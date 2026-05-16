@echo off
TITLE EduTracker Enterprise ERP - Server Console
COLOR 0B

echo ========================================================
echo   🏫 EduTracker Enterprise ERP - Starting System...
echo ========================================================
echo.

:: 1. Start Backend in a separate window
echo [1/2] Starting Database Engine (Backend)...
start "EduTracker Backend" cmd /c "cd backend && npm start"

:: 2. Start Frontend in this window
echo [2/2] Starting User Interface (Frontend)...
echo.
echo --------------------------------------------------------
echo ✅ System is ONLINE!
echo --------------------------------------------------------
echo.
echo Use the Desktop shortcut or visit: http://localhost:6001
echo.
echo (Keep this window open while using the app)
echo --------------------------------------------------------
echo.

npm start
