# Admin Access Control Setup

## Problem Fixed
Previously, any logged-in user could access the `/admin` dashboard. Now, only users with admin privileges can access it.

## How It Works

The admin dashboard now checks for admin access in two ways:

1. **Database Role Check** (Primary): Checks if `profile.role === 'admin'`
2. **Email Whitelist** (Fallback): Checks if user's email is in the admin emails list

## Setup Steps

### Step 1: Fix RLS Policies and Add Role Column

**IMPORTANT**: If you're getting "401 Unauthorized" or "violates row-level security policy" errors, you need to fix the RLS policies first.

Run the complete fix script in Supabase SQL Editor:

```bash
# Use this complete script that fixes everything:
db/fix-profiles-rls-and-add-role.sql

# Or see the detailed guide:
db/FIX_ADMIN_ACCESS_COMPLETE.md
```

The script will:
- Add role column to profiles table
- Fix RLS policies to allow profile creation
- Create profiles for all existing users
- Set up auto-profile creation trigger

### Step 2: Set Admin Users

Choose one of these methods:

#### Method A: Set Admin by Email (Recommended)
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

#### Method B: Set Admin by User ID
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id-here';
```

#### Method C: Use Email Whitelist (No Database Change)
Edit `db/src/pages/AdminDashboard.tsx` and add your email to the `adminEmails` array:

```typescript
const adminEmails = [
  'admin@dripbazaar.studio',
  'your-email@example.com', // Add your admin email here
];
```

### Step 3: Verify Admin Access

1. Log in with your admin account
2. Navigate to `/admin`
3. You should see the admin dashboard

Non-admin users will see:
- "Access Denied" message
- "You do not have permission to access the admin dashboard."
- Automatic redirect to home page

## Testing

### Test as Admin:
1. Log in with admin email
2. Go to `http://localhost:5174/admin`
3. Should see the admin dashboard

### Test as Regular User:
1. Log in with non-admin email
2. Go to `http://localhost:5174/admin`
3. Should see "Access Denied" and be redirected to home

## Security Features

- ✅ Checks authentication (must be logged in)
- ✅ Checks admin role in database
- ✅ Fallback to email whitelist
- ✅ Shows loading state while checking access
- ✅ Displays clear access denied message
- ✅ Redirects unauthorized users to home page
- ✅ Alert notification for access denial

## Troubleshooting

### Issue: Getting "401 Unauthorized" or "violates row-level security policy"

**This is the main issue!** The RLS policies are blocking profile creation.

**Solution**: Run the complete fix script `db/fix-profiles-rls-and-add-role.sql` which:
1. Fixes RLS policies to allow profile creation
2. Creates profiles for all existing users
3. Adds the role column

### Issue: No profile entry in profiles table

**Solution**: The fix script creates profiles for all existing users automatically:
```sql
-- This is included in the fix script
INSERT INTO profiles (id, email, full_name, role)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'full_name', u.email), 'user'
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

### Issue: Still seeing "Access Denied" as admin

**Solution 1**: Check if role was set correctly
```sql
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';
```

**Solution 2**: Add your email to the whitelist in `AdminDashboard.tsx`

**Solution 3**: Clear browser cache and localStorage
```javascript
// In browser console:
localStorage.clear();
// Then refresh and log in again
```

### Issue: Role column doesn't exist

Run the SQL script again:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
```

### Issue: Need to add multiple admins

```sql
-- Add multiple admins at once
UPDATE profiles SET role = 'admin' 
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);
```

## Files Modified

1. `db/src/lib/supabaseClient.ts` - Added `role` field to Profile type
2. `db/src/pages/AdminDashboard.tsx` - Already had admin checking logic
3. `db/add-role-to-profiles.sql` - New SQL script to add role column

## Next Steps

1. Run the SQL script in Supabase
2. Set your user as admin
3. Test access with admin and non-admin accounts
4. Remove test/demo admin emails from the whitelist if not needed
