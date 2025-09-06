@echo off
echo Starting Service Navigator Application...
echo.

echo Starting Backend Server...
cd server
start "Backend Server" cmd /c "npm start"
timeout /t 3

echo Starting Frontend Application...
cd ..\client
start "Frontend App" cmd /c "npm start"

echo.
echo Both services are starting up!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001
echo.
pause
