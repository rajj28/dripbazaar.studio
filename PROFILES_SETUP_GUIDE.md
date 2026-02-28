# Profiles Setup Guide

## Issue
When creating a new user, no entry appears in the `profiles` table in the database.

## Solution
The profiles table needs to be created with an automatic trigger that creates a profile entry whenever a new user signs up.

## Setup Steps

### 1. Run the SQL Script in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase-profiles-setup.sql`
4. Copy and paste the entire content into the SQL Editor
5. Click **Run** to execute the script

### 2. What the Script Does

The script will:

1. **Create the `profiles` table** with the following columns:
   - `id` (UUID, primary key, references auth.users)
   - `email` (TEXT, not null)
   - `full_name` (TEXT, nullable)
   - `phone` (TEXT, nullable)
   - `avatar_url` (TEXT, nullable)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **Enable Row Level Security (RLS)** with policies:
   - Public can view all profiles
   - Users can insert their own profile
   - Users can update their own profile

3. **Create a trigger function** `handle_new_user()` that:
   - Automatically runs when a new user signs up
   - Creates a profile entry with the user's email and full_name
   - Extracts full_name from user metadata

4. **Create a trigger** `on_auth_user_created` that:
   - Fires AFTER INSERT on auth.users
   - Calls the handle_new_user() function

5. **Create an update trigger** that:
   - Automatically updates the `updated_at` timestamp
   - Fires on profile updates

### 3. Verify the Setup

After running the script, verify it worked:

```sql
-- Check if profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
) AS profiles_table_exists;

-- Check if trigger exists
SELECT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
) AS trigger_exists;

-- View all profiles
SELECT * FROM profiles;
```

### 4. Test User Creation

1. Go to your app's signup page
2. Create a new user with:
   - Email: test@example.com
   - Password: Test123!
   - Full Name: Test User
3. Check the `profiles` table in Supabase
4. You should see a new entry with the user's information

### 5. Fallback Mechanism

The `AuthContext.tsx` has been updated with a fallback mechanism:

- After signup, it waits 500ms for the trigger to execute
- Checks if the profile was created
- If not, manually creates the profile
- This ensures profiles are always created even if the trigger fails

## How It Works

### Automatic Profile Creation Flow

```
User Signs Up
    ↓
auth.users table INSERT
    ↓
Trigger: on_auth_user_created fires
    ↓
Function: handle_new_user() executes
    ↓
profiles table INSERT
    ↓
Profile created with user data
```

### Fallback Flow (if trigger fails)

```
User Signs Up
    ↓
AuthContext.signUp() called
    ↓
Wait 500ms
    ↓
Check if profile exists
    ↓
If not exists → Manually create profile
    ↓
Profile created
```

## Troubleshooting

### Profile not created after signup

1. **Check if trigger exists:**
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. **Check trigger function:**
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. **Check RLS policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

4. **Check for errors in Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for any errors related to profiles or triggers

### Manual profile creation

If you need to manually create a profile for an existing user:

```sql
INSERT INTO profiles (id, email, full_name)
VALUES (
    'user-uuid-here',
    'user@example.com',
    'User Full Name'
);
```

### Reset and recreate

If you need to start fresh:

```sql
-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop profiles table
DROP TABLE IF EXISTS profiles CASCADE;

-- Then run the setup script again
```

## Database Schema

### profiles table structure

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes

- Primary key on `id`
- Index on `email` for faster lookups

### Relationships

- `id` references `auth.users(id)` with CASCADE delete
- When a user is deleted, their profile is automatically deleted

## Security

### Row Level Security (RLS)

1. **Public Read**: Anyone can view profiles
2. **Authenticated Insert**: Users can only insert their own profile
3. **Authenticated Update**: Users can only update their own profile

### Policies

```sql
-- View all profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Insert own profile
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Update own profile
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
```

## Additional Features

### Auto-update timestamp

The `updated_at` field is automatically updated whenever a profile is modified:

```sql
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

### Metadata extraction

The trigger automatically extracts the `full_name` from user metadata:

```sql
COALESCE(NEW.raw_user_meta_data->>'full_name', '')
```

## Next Steps

After setting up profiles:

1. ✅ Users will automatically get profiles on signup
2. ✅ Profile data will be available in NavOverlay
3. ✅ Users can update their profiles
4. ✅ JWT sessions will persist profile data

## Support

If you encounter issues:

1. Check Supabase logs for errors
2. Verify trigger and function exist
3. Check RLS policies are correct
4. Test with a new user signup
5. Check browser console for errors

## Files Modified

- `db/supabase-profiles-setup.sql` - SQL script to create profiles table and trigger
- `db/src/context/AuthContext.tsx` - Added fallback profile creation
- `db/PROFILES_SETUP_GUIDE.md` - This guide
