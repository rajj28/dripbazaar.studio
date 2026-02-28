-- Fix Admin Dashboard Orders Visibility
-- This script ensures admins can see all orders in the admin dashboard

-- First, let's check if the orders table has the correct columns
-- Run this to see the current structure:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';

-- Drop existing policies on orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- Create new policies that allow:
-- 1. Anyone can view all orders (for admin dashboard)
-- 2. Authenticated users can create orders
-- 3. Authenticated users can update orders

-- Policy 1: Allow all authenticated users to view all orders
-- This is needed for the admin dashboard to work
CREATE POLICY "Authenticated users can view all orders" 
ON orders 
FOR SELECT 
TO authenticated
USING (true);

-- Policy 2: Allow anonymous users to view all orders (if needed for public order tracking)
CREATE POLICY "Public can view all orders" 
ON orders 
FOR SELECT 
TO anon
USING (true);

-- Policy 3: Allow authenticated users to create orders
CREATE POLICY "Authenticated users can create orders" 
ON orders 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Policy 4: Allow anonymous users to create orders (for guest checkout)
CREATE POLICY "Anonymous users can create orders" 
ON orders 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Policy 5: Allow authenticated users to update all orders (for admin)
CREATE POLICY "Authenticated users can update orders" 
ON orders 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 6: Allow service role to do everything (for backend operations)
CREATE POLICY "Service role can do everything on orders" 
ON orders 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Similarly, fix payments table policies
DROP POLICY IF EXISTS "Users can view payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments" ON payments;
DROP POLICY IF EXISTS "Users can update payments" ON payments;

-- Create policies for payments table
CREATE POLICY "Authenticated users can view all payments" 
ON payments 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Public can view all payments" 
ON payments 
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Authenticated users can create payments" 
ON payments 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Anonymous users can create payments" 
ON payments 
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments" 
ON payments 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do everything on payments" 
ON payments 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('orders', 'payments')
ORDER BY tablename, policyname;

-- Check if there are any orders in the database
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

-- Check if there are any payments in the database
SELECT 
    id,
    order_id,
    status,
    amount,
    payment_method,
    created_at
FROM payments
ORDER BY created_at DESC
LIMIT 10;
