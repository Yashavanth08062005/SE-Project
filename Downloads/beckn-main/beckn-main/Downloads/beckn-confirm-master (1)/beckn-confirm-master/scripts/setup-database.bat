@echo off
echo Setting up PostgreSQL database for Beckn Travel Discovery...
echo.
echo Using database: travel_discovery
echo Username: postgres
echo Password: 123456
echo.

set PGPASSWORD=123456

echo Creating database...
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE travel_discovery;" 2>nul

echo.
echo Setting up tables and data...
psql -U postgres -h localhost -p 5432 -d travel_discovery -f database-setup.sql

echo.
echo Setting up authentication tables...
psql -U postgres -h localhost -p 5432 -d travel_discovery -f database-auth-setup.sql

echo.
echo Adding sample flight data...
psql -U postgres -h localhost -p 5432 -d travel_discovery -f add-del-bom-flights.sql

echo.
echo Adding international flights...
psql -U postgres -h localhost -p 5432 -d travel_discovery -f add-international-flights.sql

echo.
echo Database setup complete!
echo.
echo Verifying setup...
psql -U postgres -h localhost -p 5432 -d travel_discovery -c "SELECT COUNT(*) as total_flights FROM flights;"
psql -U postgres -h localhost -p 5432 -d travel_discovery -c "SELECT COUNT(*) as total_hotels FROM hotels;"

pause