@echo off
echo ========================================
echo Restarting All Beckn Services
echo ========================================

echo.
echo Starting BAP Service (Port 8081)...
start "BAP Service" cmd /k "cd bap-travel-discovery && npm start"
timeout /t 3

echo.
echo Starting Domestic Flights BPP (Port 7001)...
start "Flights BPP" cmd /k "cd travel-discovery-bpp-flights && npm start"
timeout /t 3

echo.
echo Starting International Flights BPP (Port 7005)...
start "Intl Flights BPP" cmd /k "cd travel-discovery-bpp-international-flights && npm start"
timeout /t 3

echo.
echo Starting Hotels BPP (Port 7003)...
start "Hotels BPP" cmd /k "cd travel-discovery-bpp-hotels && npm start"
timeout /t 3

echo.
echo Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd frontend-travel-discovery && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo BAP: http://localhost:8081
echo Frontend: http://localhost:3000
echo Flights BPP: http://localhost:7001
echo Intl Flights BPP: http://localhost:7005
echo Hotels BPP: http://localhost:7003
echo ========================================
pause
