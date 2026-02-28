# Fix Admin Access - Complete Guide

## Problem
1. Admin dashboard is accessible to any logged-in user
2. No profile entry exists for admin account in profiles table
3. RLS policy blocks profile creation (401 Unauthorized error)

## Solution - Run This SQL Script

Open Supabase SQL Editor and run this complete script:

```sql
-- ============================================
-- COMPLETE FIX FOR ADMIN ACCESS
-- ============================================

-- Step 1: Add role column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 2: Fix RLS policies to allow profile creation
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create trigger to auto-create profiles on signup
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Create profiles for ALL existing users
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

-- Step 5: Verify all users now have profiles
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.role,
  CASE WHEN p.id IS NULL THEN '❌ NO PROFILE' ELSE '✅ HAS PROFILE' END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

## After Running the Script

### Set Your Admin User

**Option 1: Set admin by email (easiest)**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Option 2: Set admin by user ID**
```sql
-- First find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then set as admin
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id-here';
```

### Verify Admin Setup
```sql
-- Check admin users
SELECT id, email, full_name, role FROM profiles WHERE role = 'admin';
```

## Test Admin Access

1. **Log out** from your current session
2. **Clear browser cache** and localStorage:
   ```javascript
   // In browser console (F12):
   localStorage.clear();
   ```
3. **Log in again** with your admin email
4. **Navigate to** `http://localhost:5174/admin`
5. **You should see** the admin dashboard

### Test Non-Admin Access

1. Log in with a different (non-admin) account
2. Try to access `/admin`
3. Should see "Access Denied" message
4. Should be redirected to home page

## Quick Troubleshooting

### Issue: Still getting 401 error when creating profile

**Solution**: The SQL script above fixes the RLS policies. Run it again.

### Issue: Profile exists but still can't access admin

**Solution**: Check if role is set correctly
```sql
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';
```

If role is NULL or 'user', update it:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Issue: Can't find my user in auth.users

**Solution**: You need to sign up first
1. Go to `/auth` and create an account
2. Then run the SQL to set that user as admin

### Issue: Multiple users need admin access

```sql
-- Set multiple admins at once
UPDATE profiles SET role = 'admin' 
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);
```

## What This Fixes

✅ Adds `role` column to profiles table  
✅ Fixes RLS policies to allow profile creation  
✅ Creates profiles for all existing users  
✅ Sets up auto-profile creation for new signups  
✅ Allows setting admin role  
✅ Restricts admin dashboard to admin users only  

## Files Modified

1. `db/src/lib/supabaseClient.ts` - Added `role` to Profile type
2. `db/src/pages/AdminDashboard.tsx` - Already has admin checking
3. `db/fix-profiles-rls-and-add-role.sql` - Complete fix script

## Alternative: Email Whitelist (No Database Changes)

If you don't want to modify the database, you can use email whitelist:

Edit `db/src/pages/AdminDashboard.tsx` line ~60:
```typescript
const adminEmails = [
  'admin@dripbazaar.studio',
  'your-actual-email@example.com', // Add your email here
];
```

This works immediately without database changes, but role-based access is more scalable.
