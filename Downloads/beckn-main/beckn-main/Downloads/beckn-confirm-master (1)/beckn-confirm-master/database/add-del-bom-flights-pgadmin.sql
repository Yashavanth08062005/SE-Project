-- Add DEL to BOM flights using pgAdmin
-- Copy and paste this into pgAdmin Query Tool for flights_bpp database

-- First, check current DEL → BOM flights
SELECT flight_code, airline_name, departure_airport, arrival_airport, price 
FROM flights 
WHERE departure_airport = 'DEL' AND arrival_airport = 'BOM';

-- Add DEL → BOM flights
INSERT INTO flights (
    flight_code, airline_name, aircraft_model, departure_airport, arrival_airport,
    departure_city, arrival_city, departure_time, arrival_time, duration_minutes,
    price, flight_type, short_desc, long_desc, meals_included, baggage_kg,
    wifi_available, seat_type
) VALUES 
    ('AI-2001', 'Air India', 'Boeing 737', 'DEL', 'BOM', 'Delhi', 'Mumbai', 
     '06:00:00', '08:15:00', 135, 6500.00, 'DOMESTIC',
     'Early morning flight', 'Early morning non-stop flight from Delhi to Mumbai',
     true, 20, true, 'Economy'),
    
    ('6E-3001', 'IndiGo', 'Airbus A320', 'DEL', 'BOM', 'Delhi', 'Mumbai',
     '10:30:00', '12:45:00', 135, 4800.00, 'DOMESTIC',
     'Budget airline', 'Affordable non-stop flight from Delhi to Mumbai',
     false, 15, false, 'Economy'),
    
    ('UK-4001', 'Vistara', 'Airbus A321', 'DEL', 'BOM', 'Delhi', 'Mumbai',
     '14:15:00', '16:30:00', 135, 8200.00, 'DOMESTIC',
     'Premium service', 'Premium full-service flight from Delhi to Mumbai',
     true, 30, true, 'Premium Economy'),
    
    ('SG-5001', 'SpiceJet', 'Boeing 737', 'DEL', 'BOM', 'Delhi', 'Mumbai',
     '18:45:00', '21:00:00', 135, 5200.00, 'DOMESTIC',
     'Evening flight', 'Evening non-stop flight from Delhi to Mumbai',
     false, 15, false, 'Economy')
ON CONFLICT (flight_code) DO NOTHING;

-- Verify the flights were added
SELECT flight_code, airline_name, departure_city, arrival_city, price, departure_time
FROM flights 
WHERE departure_airport = 'DEL' AND arrival_airport = 'BOM'
ORDER BY price;

-- Check total flights in database
SELECT COUNT(*) as total_flights FROM flights;

-- Check flights by route
SELECT 
    departure_airport || ' → ' || arrival_airport as route,
    COUNT(*) as flight_count
FROM flights 
GROUP BY departure_airport, arrival_airport
ORDER BY departure_airport, arrival_airport;