-- ============================================
-- Singapore ↔ Delhi International Flights
-- Database: international_flights_bpp
-- Run this in pgAdmin Query Tool
-- ============================================

-- Connect to international_flights_bpp database first
-- \c international_flights_bpp;

-- Add Singapore to Delhi International Flights
INSERT INTO flights (flight_code, airline_name, aircraft_model, departure_airport, arrival_airport, 
    departure_city, arrival_city, departure_time, arrival_time, duration_minutes, price, 
    flight_type, short_desc, long_desc, meals_included, baggage_kg, wifi_available, seat_type, status, currency)
VALUES
    -- Singapore to Delhi flights
    ('SQ-401', 'Singapore Airlines', 'Boeing 777', 'SIN', 'DEL', 'Singapore', 'Delhi', 
     '08:00:00', '13:30:00', 330, 35000.00, 'INTERNATIONAL',
     'Premium international service', 'Singapore Airlines premium service with excellent amenities', 
     true, 30, true, 'Economy', 'ACTIVE', 'INR'),
    
    ('AI-381', 'Air India', 'Boeing 787', 'SIN', 'DEL', 'Singapore', 'Delhi',
     '14:00:00', '19:30:00', 330, 32000.00, 'INTERNATIONAL',
     'Direct international flight', 'Air India international service with meals and entertainment',
     true, 30, true, 'Economy', 'ACTIVE', 'INR'),
    
    ('6E-1401', 'IndiGo', 'Airbus A321', 'SIN', 'DEL', 'Singapore', 'Delhi',
     '22:00:00', '03:30:00', 330, 28000.00, 'INTERNATIONAL',
     'Budget international', 'Affordable international travel with IndiGo',
     false, 20, false, 'Economy', 'ACTIVE', 'INR'),
    
    ('SQ-402', 'Singapore Airlines', 'Airbus A350', 'SIN', 'DEL', 'Singapore', 'Delhi',
     '16:30:00', '22:00:00', 330, 45000.00, 'INTERNATIONAL',
     'Business class available', 'Premium service with business class options',
     true, 40, true, 'Business', 'ACTIVE', 'INR'),

    -- Delhi to Singapore flights (return flights)
    ('SQ-403', 'Singapore Airlines', 'Boeing 777', 'DEL', 'SIN', 'Delhi', 'Singapore', 
     '09:00:00', '16:30:00', 330, 36000.00, 'INTERNATIONAL',
     'Premium international service', 'Singapore Airlines premium service to Singapore', 
     true, 30, true, 'Economy', 'ACTIVE', 'INR'),
    
    ('AI-382', 'Air India', 'Boeing 787', 'DEL', 'SIN', 'Delhi', 'Singapore',
     '15:00:00', '22:30:00', 330, 33000.00, 'INTERNATIONAL',
     'Direct international flight', 'Air India international service to Singapore',
     true, 30, true, 'Economy', 'ACTIVE', 'INR'),
    
    ('6E-1402', 'IndiGo', 'Airbus A321', 'DEL', 'SIN', 'Delhi', 'Singapore',
     '23:00:00', '06:30:00', 330, 29000.00, 'INTERNATIONAL',
     'Budget international', 'Affordable international travel to Singapore',
     false, 20, false, 'Economy', 'ACTIVE', 'INR')

ON CONFLICT (flight_code) DO UPDATE SET
    price = EXCLUDED.price,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- Verification Queries
-- ============================================

-- Check total international flights
SELECT COUNT(*) as total_international_flights 
FROM flights 
WHERE flight_type = 'INTERNATIONAL';

-- Show all Singapore-Delhi routes
SELECT 
    flight_code,
    airline_name,
    departure_city || ' → ' || arrival_city as route,
    departure_time,
    '₹' || price as price,
    seat_type,
    CASE 
        WHEN meals_included THEN 'Meals ✓' 
        ELSE 'No Meals' 
    END as meals,
    CASE 
        WHEN wifi_available THEN 'WiFi ✓' 
        ELSE 'No WiFi' 
    END as wifi
FROM flights 
WHERE (departure_airport = 'SIN' AND arrival_airport = 'DEL')
   OR (departure_airport = 'DEL' AND arrival_airport = 'SIN')
ORDER BY departure_city, departure_time;

-- Show flight summary by route
SELECT 
    departure_city || ' → ' || arrival_city as route,
    COUNT(*) as flight_count,
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(price)::DECIMAL(10,2) as avg_price
FROM flights 
WHERE (departure_airport = 'SIN' AND arrival_airport = 'DEL')
   OR (departure_airport = 'DEL' AND arrival_airport = 'SIN')
GROUP BY departure_city, arrival_city
ORDER BY departure_city;

-- ============================================
-- Expected Results:
-- ============================================
-- Total flights: Should show 11 international flights
-- Singapore → Delhi: 4 flights (₹28,000 - ₹45,000)
-- Delhi → Singapore: 4 flights (₹22,000 - ₹36,000)
-- Airlines: Singapore Airlines, Air India, IndiGo
-- ============================================