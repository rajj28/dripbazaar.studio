-- Add role column to profiles table for admin access control
-- Run this in Supabase SQL Editor

-- Add role column (default is 'user')
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update your admin user's role (replace with your actual email)
-- Example: UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- To set an admin, run one of these commands:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@dripbazaar.studio';
-- UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id-here';

-- Verify the change
SELECT id, email, role FROM profiles WHERE role = 'admin';
