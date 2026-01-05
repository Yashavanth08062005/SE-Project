@echo off
echo Installing dependencies for all services...
echo.

echo [1/5] Installing BAP Service dependencies...
cd bap-travel-discovery
call npm install
cd ..

echo.
echo [2/5] Installing Flights BPP dependencies...
cd travel-discovery-bpp-flights
call npm install
cd ..

echo.
echo [3/5] Installing International Flights BPP dependencies...
cd travel-discovery-bpp-international-flights
call npm install
cd ..

echo.
echo [4/5] Installing Hotels BPP dependencies...
cd travel-discovery-bpp-hotels
call npm install
cd ..

echo.
echo [5/5] Installing Frontend dependencies...
cd frontend-travel-discovery
call npm install
cd ..

echo.
echo All dependencies installed successfully!
echo You can now run start-all-services.bat to start the application.
pause