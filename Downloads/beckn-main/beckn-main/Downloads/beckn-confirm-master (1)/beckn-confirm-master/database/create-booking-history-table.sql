-- ============================================
-- BOOKING HISTORY TABLE
-- Run this in pgAdmin to create booking history
-- ============================================

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Booking Type
    booking_type VARCHAR(20) NOT NULL, -- 'flight' or 'hotel'
    
    -- Item Details (flight or hotel)
    item_id VARCHAR(100) NOT NULL,
    provider_id VARCHAR(100),
    item_name VARCHAR(255), -- Airline name or Hotel name
    item_code VARCHAR(100), -- Flight number or Hotel code
    
    -- Flight specific
    origin VARCHAR(10),
    destination VARCHAR(10),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    
    -- Hotel specific
    check_in_date DATE,
    check_out_date DATE,
    
    -- Passenger/Guest Details
    passenger_name VARCHAR(255) NOT NULL,
    passenger_email VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(50) NOT NULL,
    passenger_gender VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    
    -- Address Details
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Payment Details
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50), -- 'card', 'upi', 'wallet'
    payment_status VARCHAR(50) DEFAULT 'PAID', -- 'PAID', 'PENDING', 'FAILED', 'REFUNDED'
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    -- Booking Status
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'CANCELLED', 'COMPLETED'
    
    -- Beckn Details
    beckn_transaction_id VARCHAR(100),
    beckn_message_id VARCHAR(100),
    order_id VARCHAR(100),
    
    -- Additional Details (JSON for flexibility)
    item_details JSONB, -- Complete item object
    booking_metadata JSONB, -- Any additional data
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_transaction_id ON bookings(transaction_id);
CREATE INDEX idx_bookings_booking_type ON bookings(booking_type);
CREATE INDEX idx_bookings_booking_status ON bookings(booking_status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_passenger_email ON bookings(passenger_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_bookings_updated_at_trigger ON bookings;
CREATE TRIGGER update_bookings_updated_at_trigger
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_bookings_updated_at();

-- Create view for user booking history
CREATE OR REPLACE VIEW user_booking_history AS
SELECT 
    b.id,
    b.booking_reference,
    b.booking_type,
    b.item_name,
    b.item_code,
    b.origin,
    b.destination,
    b.departure_time,
    b.check_in_date,
    b.passenger_name,
    b.amount,
    b.currency,
    b.booking_status,
    b.payment_status,
    b.created_at,
    u.email as user_email,
    u.full_name as user_full_name
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
ORDER BY b.created_at DESC;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if bookings table exists
SELECT 'Bookings table created successfully' as status;

-- View table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- Count bookings
SELECT COUNT(*) as total_bookings FROM bookings;
