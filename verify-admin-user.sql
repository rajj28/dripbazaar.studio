-- Verify admin user in database
-- Run this in Supabase SQL Editor to check if admin is set up correctly

-- Step 1: Check if user exists in auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'dripbazaar.studio@gmail.com';

-- Step 2: Check if profile exists with role
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles 
WHERE email = 'dripbazaar.studio@gmail.com';

-- Step 3: If profile exists but role is NULL or 'user', update it
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'dripbazaar.studio@gmail.com';

-- Step 4: Verify the update
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles 
WHERE email = 'dripbazaar.studio@gmail.com';

-- Step 5: Check all admin users
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles 
WHERE role = 'admin';
