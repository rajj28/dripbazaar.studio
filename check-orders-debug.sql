-- =====================================================
-- DEBUG: Check Orders and Payments
-- Run this in Supabase SQL Editor to diagnose issues
-- =====================================================

-- 1. Check if orders table exists and has data
SELECT 
    'Orders Table' as table_name,
    COUNT(*) as total_rows
FROM orders;

-- 2. Check recent orders
SELECT 
    id,
    user_id,
    status,
    total_amount,
    payment_method,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check if payments table exists and has data
SELECT 
    'Payments Table' as table_name,
    COUNT(*) as total_rows
FROM payments;

-- 4. Check recent payments
SELECT 
    id,
    order_id,
    user_id,
    status,
    amount,
    payment_method,
    created_at
FROM payments
ORDER BY created_at DESC
LIMIT 10;

-- 5. Check orders with their payments (JOIN)
SELECT 
    o.id as order_id,
    o.status as order_status,
    o.total_amount,
    o.created_at as order_date,
    p.id as payment_id,
    p.status as payment_status,
    p.amount as payment_amount
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
ORDER BY o.created_at DESC
LIMIT 10;

-- 6. Check orders by status
SELECT 
    status,
    COUNT(*) as count
FROM orders
GROUP BY status;

-- 7. Check if user_id is being set correctly
SELECT 
    id,
    user_id,
    CASE 
        WHEN user_id IS NULL THEN 'NULL - PROBLEM!'
        ELSE 'OK'
    END as user_id_status,
    status,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- 8. Check RLS policies on orders table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'orders';

-- 9. Check if orders table has correct columns
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 10. Check if payments table has correct columns
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- =====================================================
-- EXPECTED RESULTS
-- =====================================================
-- If everything is working:
-- 1. Orders table should have rows
-- 2. Payments table should have rows
-- 3. Orders should have user_id set (not NULL)
-- 4. JOIN should show matching orders and payments
-- 5. RLS policies should allow users to read their own orders

-- =====================================================
-- COMMON ISSUES
-- =====================================================
-- Issue 1: No orders in database
--   Solution: Place a test order through the app

-- Issue 2: user_id is NULL
--   Solution: User must be logged in when placing order

-- Issue 3: RLS blocking queries
--   Solution: Check RLS policies, may need to adjust

-- Issue 4: Orders exist but not showing in admin
--   Solution: Check admin dashboard filter logic
