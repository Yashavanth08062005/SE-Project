-- Create BPP Booking Mapping Table in BAP Database (travel_discovery)
-- This table maps platform booking IDs to BPP booking IDs
-- Run this in pgAdmin for travel_discovery database

-- Create the mapping table
CREATE TABLE IF NOT EXISTS bpp_booking_mappings (
    id SERIAL PRIMARY KEY,
    platform_booking_id VARCHAR(50) NOT NULL,
    platform_booking_reference VARCHAR(50) NOT NULL,
    bpp_service_type VARCHAR(50) NOT NULL, -- 'flights', 'international_flights', 'hotels'
    bpp_booking_id VARCHAR(50) NOT NULL,
    bpp_service_url VARCHAR(200),
    beckn_transaction_id VARCHAR(100),
    beckn_message_id VARCHAR(100),
    mapping_status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'CANCELLED', 'FAILED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(platform_booking_id, bpp_service_type),
    FOREIGN KEY (platform_booking_reference) REFERENCES bookings(booking_reference) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bpp_mappings_platform_id ON bpp_booking_mappings(platform_booking_id);
CREATE INDEX IF NOT EXISTS idx_bpp_mappings_bpp_id ON bpp_booking_mappings(bpp_booking_id);
CREATE INDEX IF NOT EXISTS idx_bpp_mappings_reference ON bpp_booking_mappings(platform_booking_reference);
CREATE INDEX IF NOT EXISTS idx_bpp_mappings_service_type ON bpp_booking_mappings(bpp_service_type);
CREATE INDEX IF NOT EXISTS idx_bpp_mappings_status ON bpp_booking_mappings(mapping_status);

-- Add a comment to the table
COMMENT ON TABLE bpp_booking_mappings IS 'Maps platform booking IDs to BPP booking IDs for tracking bookings across services';

-- Verify the table was created
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'bpp_booking_mappings' 
ORDER BY ordinal_position;