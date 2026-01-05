-- Fix database schema to match application expectations

-- Add any missing columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(50) UNIQUE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_id VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS order_id VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS passenger_details JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS fulfillment_details JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS quote_details JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS billing_details JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS message_id VARCHAR(100);

-- Create index on booking_reference if not exists
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);

-- Show final schema
\d bookings;