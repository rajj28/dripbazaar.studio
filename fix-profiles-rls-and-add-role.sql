-- Fix profiles table RLS policies and add role column
-- Run this in Supabase SQL Editor

-- Step 1: Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 2: Drop existing restrictive RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Step 3: Create permissive RLS policies that allow profile creation
CREATE POLICY "Allow users to view own profile"
ON profiles FOR SELECT
TO authenticated, anon
USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile"
ON profiles FOR INSERT
TO authenticated, anon
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE
TO authenticated, anon
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 4: Enable RLS (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create or replace the trigger function to auto-create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Manually create profile for existing admin user
-- Replace 'your-admin-email@example.com' with your actual admin email
-- First, find your user ID:
-- SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';

-- Then insert the profile (replace USER_ID_HERE with actual ID from above query):
-- INSERT INTO profiles (id, email, full_name, role)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), 'admin'
-- FROM auth.users
-- WHERE email = 'your-admin-email@example.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Or if you know your user ID already:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('your-user-id-here', 'your-email@example.com', 'Your Name', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Step 8: Verify the setup
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.role,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- Step 9: Check which users don't have profiles yet
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  p.id as profile_exists
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Step 10: Create profiles for all existing users who don't have one
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

-- Step 11: Now set your admin user (replace with your email)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Final verification - check all profiles
SELECT id, email, full_name, role, created_at FROM profiles ORDER BY created_at DESC;
