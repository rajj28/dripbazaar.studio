-- Simple script to add role column and create admin
-- Run this in Supabase SQL Editor

-- Step 1: Add role column (if not exists)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 2: Check which users exist in auth but not in profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  CASE WHEN p.id IS NULL THEN '❌ NO PROFILE' ELSE '✅ HAS PROFILE' END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Step 3: Create profiles for all users who don't have one
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email),
  'user'
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 4: Verify all users now have profiles
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.role,
  CASE WHEN p.id IS NULL THEN '❌ NO PROFILE' ELSE '✅ HAS PROFILE' END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Step 5: Set your admin user (REPLACE WITH YOUR EMAIL)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Step 6: Verify admin was set
-- SELECT id, email, full_name, role FROM profiles WHERE role = 'admin';
