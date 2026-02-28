-- QUICK FIX: Admin Dashboard Orders Not Showing
-- Copy and paste this ENTIRE script into Supabase SQL Editor and run it

-- ============================================
-- STEP 1: Check current state
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE '=== CHECKING CURRENT STATE ===';
END $$;

-- Show current orders
DO $$ 
DECLARE
    order_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO order_count FROM orders;
    RAISE NOTICE 'Total orders in database: %', order_count;
END $$;

-- Show order statuses
SELECT 
    COALESCE(status, payment_status, 'unknown') as status, 
    COUNT(*) as count 
FROM orders 
GROUP BY COALESCE(status, payment_status, 'unknown');

-- ============================================
-- STEP 2: Fix table schema
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE '=== FIXING TABLE SCHEMA ===';
END $$;

-- Add status column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status'
    ) THEN
        ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
        RAISE NOTICE '✓ Added status column';
    ELSE
        RAISE NOTICE '✓ status column already exists';
    END IF;
END $$;

-- Add payment_method column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method TEXT;
        RAISE NOTICE '✓ Added payment_method column';
    ELSE
        RAISE NOTICE '✓ payment_method column already exists';
    END IF;
END $$;

-- Migrate payment_status to status if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_status'
    ) THEN
        UPDATE orders 
        SET status = COALESCE(status, payment_status, 'pending')
        WHERE status IS NULL OR status = '';
        RAISE NOTICE '✓ Migrated payment_status to status';
    END IF;
END $$;

-- ============================================
-- STEP 3: Fix RLS policies
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE '=== FIXING RLS POLICIES ===';
END $$;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Public can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;
DROP POLICY IF EXISTS "Anonymous users can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;

-- Create new policies
CREATE POLICY "Authenticated users can view all orders" 
ON orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public can view all orders" 
ON orders FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated users can create orders" 
ON orders FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Anonymous users can create orders" 
ON orders FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders" 
ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DO $$ 
BEGIN
    RAISE NOTICE '✓ Created new RLS policies';
END $$;

-- ============================================
-- STEP 4: Fix payments table (if exists)
-- ============================================
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'payments'
    ) THEN
        RAISE NOTICE '=== FIXING PAYMENTS TABLE ===';
        
        -- Drop old policies
        EXECUTE 'DROP POLICY IF EXISTS "Users can view payments" ON payments';
        EXECUTE 'DROP POLICY IF EXISTS "Users can create payments" ON payments';
        EXECUTE 'DROP POLICY IF EXISTS "Users can update payments" ON payments';
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can view all payments" ON payments';
        EXECUTE 'DROP POLICY IF EXISTS "Public can view all payments" ON payments';
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can create payments" ON payments';
        EXECUTE 'DROP POLICY IF EXISTS "Anonymous users can create payments" ON payments';
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can update payments" ON payments';
        
        -- Create new policies
        EXECUTE 'CREATE POLICY "Authenticated users can view all payments" ON payments FOR SELECT TO authenticated USING (true)';
        EXECUTE 'CREATE POLICY "Public can view all payments" ON payments FOR SELECT TO anon USING (true)';
        EXECUTE 'CREATE POLICY "Authenticated users can create payments" ON payments FOR INSERT TO authenticated WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "Anonymous users can create payments" ON payments FOR INSERT TO anon WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "Authenticated users can update payments" ON payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
        
        RAISE NOTICE '✓ Fixed payments table policies';
    END IF;
END $$;

-- ============================================
-- STEP 5: Create indexes
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE '=== CREATING INDEXES ===';
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

DO $$ 
BEGIN
    RAISE NOTICE '✓ Created indexes';
END $$;

-- ============================================
-- STEP 6: Verify the fix
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE '=== VERIFICATION ===';
END $$;

-- Show final state
SELECT 
    '✓ Orders by status' as info,
    status, 
    COUNT(*) as count 
FROM orders 
GROUP BY status;

-- Show recent orders
SELECT 
    '✓ Recent orders' as info,
    id,
    status,
    payment_method,
    total_amount,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;

-- Show policies
SELECT 
    '✓ RLS Policies' as info,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'orders';

-- Final message
DO $$ 
BEGIN
    RAISE NOTICE '=== FIX COMPLETE ===';
    RAISE NOTICE 'Now refresh your Admin Dashboard and click "Pending Verification"';
    RAISE NOTICE 'You should see your orders!';
END $$;
