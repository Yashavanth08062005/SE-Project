-- Add cancellation and refund fields to BPP booking tables
-- Run this in PostgreSQL (pgAdmin) to update the schema

-- ============================================
-- FLIGHTS BPP DATABASE - Add cancellation fields
-- ============================================
\c flights_bpp;

-- Add cancellation and refund related columns to bpp_bookings table
ALTER TABLE bpp_bookings 
ADD COLUMN IF NOT EXISTS cancellation_status VARCHAR(20) DEFAULT 'NOT_CANCELLED',
ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR(100),
ADD COLUMN IF NOT EXISTS cancellation_time TIMESTAMP,
ADD COLUMN IF NOT EXISTS cancellation_charges DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS refund_status VARCHAR(20) DEFAULT 'NOT_INITIATED',
ADD COLUMN IF NOT EXISTS refund_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS refund_initiated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS refund_completed_at TIMESTAMP;

-- ============================================
-- INTERNATIONAL FLIGHTS BPP DATABASE - Add cancellation fields
-- ============================================
\c international_flights_bpp;

-- Add cancellation and refund related columns to bpp_bookings table
ALTER TABLE bpp_bookings 
ADD COLUMN IF NOT EXISTS cancellation_status VARCHAR(20) DEFAULT 'NOT_CANCELLED',
ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR(100),
ADD COLUMN IF NOT EXISTS cancellation_time TIMESTAMP,
ADD COLUMN IF NOT EXISTS cancellation_charges DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS refund_status VARCHAR(20) DEFAULT 'NOT_INITIATED',
ADD COLUMN IF NOT EXISTS refund_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS refund_initiated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS refund_completed_at TIMESTAMP;

-- ============================================
-- HOTELS BPP DATABASE - Add cancellation fields
-- ============================================
\c hotels_bpp;

-- Add cancellation and refund related columns to bpp_bookings table
ALTER TABLE bpp_bookings 
ADD COLUMN IF NOT EXISTS cancellation_status VARCHAR(20) DEFAULT 'NOT_CANCELLED',
ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR(100),
ADD COLUMN IF NOT EXISTS cancellation_time TIMESTAMP,
ADD COLUMN IF NOT EXISTS cancellation_charges DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS refund_status VARCHAR(20) DEFAULT 'NOT_INITIATED',
ADD COLUMN IF NOT EXISTS refund_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS refund_initiated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS refund_completed_at TIMESTAMP;

-- Verify the changes
\c flights_bpp;
\d bpp_bookings;

\c international_flights_bpp;
\d bpp_bookings;

\c hotels_bpp;
\d bpp_bookings;