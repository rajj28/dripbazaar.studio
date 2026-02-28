-- =====================================================
-- ADD ADDRESS FIELDS TO PROFILES TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add address columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS default_address_id TEXT;

-- Create index for faster address lookups
CREATE INDEX IF NOT EXISTS profiles_addresses_idx ON profiles USING GIN (addresses);

-- Add comment to explain the structure
COMMENT ON COLUMN profiles.addresses IS 'Array of address objects: [{id, full_name, phone, address_line1, address_line2, city, state, pincode, is_default}]';
COMMENT ON COLUMN profiles.default_address_id IS 'ID of the default address from the addresses array';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if columns were added
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('addresses', 'default_address_id');

-- View profiles table structure
SELECT * FROM profiles LIMIT 1;

-- =====================================================
-- EXAMPLE ADDRESS STRUCTURE
-- =====================================================

-- addresses column will store an array of objects like this:
-- [
--   {
--     "id": "addr_123",
--     "full_name": "John Doe",
--     "phone": "9876543210",
--     "address_line1": "123 Main Street",
--     "address_line2": "Apt 4B",
--     "city": "Mumbai",
--     "state": "Maharashtra",
--     "pincode": "400001",
--     "is_default": true
--   }
-- ]

-- =====================================================
-- NOTES
-- =====================================================
-- 1. addresses is a JSONB array that stores multiple addresses
-- 2. default_address_id stores the ID of the default address
-- 3. Users can have multiple addresses
-- 4. One address can be marked as default
-- 5. JSONB allows flexible querying and indexing
