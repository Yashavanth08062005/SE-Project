-- ============================================
-- VIEW BOOKINGS DATA IN PGADMIN
-- Copy and paste this into pgAdmin Query Tool
-- Make sure you're connected to 'travel_discovery' database
-- ============================================

-- 1. Check if table exists
SELECT 'Bookings table exists' as status
WHERE EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings'
);

-- 2. Count total bookings
SELECT COUNT(*) as total_bookings FROM bookings;

-- 3. View all bookings (formatted)
SELECT 
    id,
    booking_reference,
    booking_type,
    passenger_name,
    passenger_email,
    origin || ' → ' || destination as route,
    'INR ' || amount as price,
    booking_status,
    payment_status,
    created_at::date as booking_date,
    created_at::time as booking_time
FROM bookings 
ORDER BY created_at DESC;

-- 4. View detailed booking info
SELECT 
    'Booking #' || id as booking_number,
    booking_reference,
    passenger_name,
    passenger_email,
    passenger_phone,
    booking_type,
    item_name as airline_or_hotel,
    item_code as flight_or_room,
    CASE 
        WHEN booking_type = 'flight' THEN origin || ' → ' || destination
        WHEN booking_type = 'hotel' THEN city || ' (' || check_in_date || ' to ' || check_out_date || ')'
        ELSE 'N/A'
    END as travel_details,
    currency || ' ' || amount as total_amount,
    payment_method,
    booking_status,
    created_at
FROM bookings 
ORDER BY created_at DESC;

-- 5. Booking summary by type
SELECT 
    booking_type,
    COUNT(*) as total_bookings,
    SUM(amount) as total_revenue,
    AVG(amount) as average_amount,
    MIN(created_at) as first_booking,
    MAX(created_at) as latest_booking
FROM bookings 
GROUP BY booking_type;

-- ============================================
-- Expected Results:
-- - 6 total bookings
-- - All flight bookings (DEL → BOM)
-- - User: admin@gmail.com
-- - Amounts: ₹4,000 - ₹4,800
-- - All confirmed status
-- ============================================