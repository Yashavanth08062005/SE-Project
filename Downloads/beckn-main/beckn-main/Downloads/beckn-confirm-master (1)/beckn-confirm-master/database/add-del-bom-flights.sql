-- Add Delhi to Mumbai flights
INSERT INTO flights (flight_code, airline_name, aircraft_model, departure_airport, arrival_airport, 
    departure_city, arrival_city, departure_time, arrival_time, duration_minutes, price, 
    flight_type, short_desc, long_desc, meals_included, baggage_kg, wifi_available, seat_type, status)
VALUES
    ('AI-2001', 'Air India', 'Boeing 737', 'DEL', 'BOM', 'Delhi', 'Mumbai', 
     '09:00:00', '11:15:00', 135, 5800.00, 'DOMESTIC',
     'Morning flight', 'Comfortable economy class with meals included', 
     true, 20, true, 'Economy', 'ACTIVE'),
    
    ('6E-3001', 'IndiGo', 'Airbus A320', 'DEL', 'BOM', 'Delhi', 'Mumbai',
     '13:00:00', '15:15:00', 135, 4500.00, 'DOMESTIC',
     'Afternoon flight', 'Budget airline with reliable service',
     false, 15, false, 'Economy', 'ACTIVE'),
    
    ('UK-4001', 'Vistara', 'Airbus A321', 'DEL', 'BOM', 'Delhi', 'Mumbai',
     '17:30:00', '19:45:00', 135, 8200.00, 'DOMESTIC',
     'Evening premium', 'Full-service airline with premium amenities',
     true, 30, true, 'Premium Economy', 'ACTIVE'),
    
    ('SG-5001', 'SpiceJet', 'Boeing 737', 'DEL', 'BOM', 'Delhi', 'Mumbai',
     '07:00:00', '09:15:00', 135, 4000.00, 'DOMESTIC',
     'Early bird special', 'Budget-friendly morning flight',
     false, 15, false, 'Economy', 'ACTIVE');
