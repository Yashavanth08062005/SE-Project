@echo off
echo Starting Beckn Travel Discovery Platform...
echo.
echo This will open 5 terminal windows for each service:
echo 1. BAP Service (Port 8081)
echo 2. Flights BPP (Port 7001) 
echo 3. International Flights BPP (Port 7005)
echo 4. Hotels BPP (Port 7003)
echo 5. Frontend (Port 3000)
echo.
echo Make sure PostgreSQL is running before continuing!
pause

echo Starting services...

echo Starting BAP Service...
start "BAP Service (Port 8081)" cmd /k "cd bap-travel-discovery && npm start"

timeout /t 3

echo Starting Flights BPP...
start "Flights BPP (Port 7001)" cmd /k "cd travel-discovery-bpp-flights && npm start"

timeout /t 2

echo Starting International Flights BPP...
start "International Flights BPP (Port 7005)" cmd /k "cd travel-discovery-bpp-international-flights && npm start"

timeout /t 2

echo Starting Hotels BPP...
start "Hotels BPP (Port 7003)" cmd /k "cd travel-discovery-bpp-hotels && npm start"

timeout /t 2

echo Starting Frontend...
start "Frontend (Port 3000)" cmd /k "cd frontend-travel-discovery && npm run dev"

echo.
echo All services are starting...
echo.
echo Wait for all services to start, then open:
echo Frontend: http://localhost:3000
echo BAP API: http://localhost:8081/health
echo.
echo Press any key to exit this window...
pause > nul