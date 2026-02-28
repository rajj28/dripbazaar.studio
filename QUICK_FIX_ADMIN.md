# Quick Fix: Admin Access (2 Minutes)

## The Problem
- ❌ Any user can access `/admin`
- ❌ No profile entry for admin in database
- ❌ Getting "401 Unauthorized" error

## The Solution (Copy & Paste)

### Step 1: Open Supabase SQL Editor
Go to your Supabase project → SQL Editor

### Step 2: Run This Complete Script

```sql
-- Add role column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Fix RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Allow users to view own profile" ON profiles FOR SELECT TO authenticated, anon USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own profile" ON profiles FOR INSERT TO authenticated, anon WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE TO authenticated, anon USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles for all existing users
INSERT INTO profiles (id, email, full_name, role)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'full_name', u.email), 'user'
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Set up auto-profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Set Your Admin User

Replace `your-email@example.com` with your actual email:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Step 4: Verify

```sql
SELECT email, role FROM profiles WHERE role = 'admin';
```

You should see your email with role = 'admin'

### Step 5: Test

1. Clear browser cache: Press F12 → Console → Type `localStorage.clear()` → Enter
2. Refresh page and log in with your admin email
3. Go to `http://localhost:5174/admin`
4. ✅ You should see the admin dashboard

## Done! 🎉

Non-admin users will now see "Access Denied" when trying to access `/admin`.

---

## Alternative: Quick Email Whitelist (No Database)

If you want to skip database changes, edit `db/src/pages/AdminDashboard.tsx` around line 60:

```typescript
const adminEmails = [
  'admin@dripbazaar.studio',
  'your-email@example.com', // Add your email
];
```

Save the file and refresh. This works immediately but is less scalable.
