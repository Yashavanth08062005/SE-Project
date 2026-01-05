@echo off
echo Checking Beckn Travel Discovery Services...
echo.

echo [1/5] BAP Service (Port 8081)...
curl -s http://localhost:8081/health > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ BAP Service: RUNNING
) else (
    echo ❌ BAP Service: NOT RUNNING
)

echo [2/5] Flights BPP (Port 7001)...
curl -s http://localhost:7001/health > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Flights BPP: RUNNING
) else (
    echo ❌ Flights BPP: NOT RUNNING
)

echo [3/5] International Flights BPP (Port 7005)...
curl -s http://localhost:7005/health > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ International Flights BPP: RUNNING
) else (
    echo ❌ International Flights BPP: NOT RUNNING
)

echo [4/5] Hotels BPP (Port 7003)...
curl -s http://localhost:7003/health > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Hotels BPP: RUNNING
) else (
    echo ❌ Hotels BPP: NOT RUNNING
)

echo [5/5] Frontend (Port 3000)...
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Frontend: RUNNING
) else (
    echo ❌ Frontend: NOT RUNNING
)

echo.
echo 🌐 Access the application at: http://localhost:3000
echo.
pause