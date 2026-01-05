@echo off
echo Setting up separate databases for each BPP...
echo.

echo Database Configuration:
echo - BAP Service: travel_discovery (existing)
echo - Flights BPP: flights_bpp
echo - International Flights BPP: international_flights_bpp  
echo - Hotels BPP: hotels_bpp
echo.
echo Username: postgres
echo Password: 123
echo.

set PGPASSWORD=123

echo Creating separate databases and tables...
echo.

echo Running database setup script...
psql -h localhost -U postgres -f setup-separate-databases.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ All databases created successfully!
    echo.
    echo Database Summary:
    echo - flights_bpp: Domestic flights data
    echo - international_flights_bpp: International flights data  
    echo - hotels_bpp: Hotels data
    echo - travel_discovery: BAP service data (users, bookings, etc.)
    echo.
) else (
    echo.
    echo ❌ Error creating databases. Please check:
    echo 1. PostgreSQL is running
    echo 2. Username/password is correct (postgres/123)
    echo 3. You have permission to create databases
    echo.
)

pause