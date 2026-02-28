-- Fix Orders Table Schema
-- This script ensures the orders table has all the required columns

-- Check current columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Add missing columns if they don't exist

-- Add 'status' column (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'status') THEN
        ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
        RAISE NOTICE 'Added status column';
    ELSE
        RAISE NOTICE 'status column already exists';
    END IF;
END $$;

-- Add 'payment_method' column (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE orders ADD COLUMN payment_method TEXT;
        RAISE NOTICE 'Added payment_method column';
    ELSE
        RAISE NOTICE 'payment_method column already exists';
    END IF;
END $$;

-- Migrate data from payment_status to status (if payment_status exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'orders' AND column_name = 'payment_status') THEN
        -- Copy data from payment_status to status
        UPDATE orders SET status = payment_status WHERE status IS NULL OR status = 'pending';
        RAISE NOTICE 'Migrated payment_status to status';
        
        -- Optionally drop payment_status column
        -- ALTER TABLE orders DROP COLUMN payment_status;
    END IF;
END $$;

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Verify the schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Show sample data
SELECT 
    id,
    user_id,
    status,
    payment_method,
    total_amount,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;
