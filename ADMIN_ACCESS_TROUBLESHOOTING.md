# Admin Access Troubleshooting

## Issue
Email `dripbazaar.studio@gmail.com` has role='admin' in database but still getting "Admin privileges required" error.

## Quick Fix

### Option 1: Email Whitelist (Immediate Fix)
The email has been added to the whitelist in the code. Clear your browser cache and try again:

1. **Clear browser cache and localStorage**:
   - Press F12 to open DevTools
   - Go to Console tab
   - Type: `localStorage.clear()`
   - Press Enter
   - Close DevTools

2. **Hard refresh the page**:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Log out and log in again**:
   - Go to profile menu
   - Click "Sign Out"
   - Log in with `dripbazaar.studio@gmail.com`
   - Navigate to `/admin`

### Option 2: Verify Database (If Option 1 doesn't work)

Run this SQL in Supabase SQL Editor:

```sql
-- Check if profile exists and has admin role
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'dripbazaar.studio@gmail.com';

-- If role is NULL or 'user', update it
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'dripbazaar.studio@gmail.com';

-- Verify the update
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'dripbazaar.studio@gmail.com';
```

## Debugging Steps

### Step 1: Check Browser Console
1. Open the site
2. Press F12 to open DevTools
3. Go to Console tab
4. Log in with admin email
5. Navigate to `/admin`
6. Look for these console logs:

```
🔍 Admin Check - User: dripbazaar.studio@gmail.com
🔍 Admin Check - Profile: {id: "...", email: "...", role: "admin"}
🔍 Admin Check - Profile Role: admin
✅ Admin access granted via profile role
```

OR

```
🔍 Admin Check - User: dripbazaar.studio@gmail.com
🔍 Admin Check - Profile: {id: "...", email: "...", role: null}
🔍 Admin Check - Profile Role: null
🔍 Checking email whitelist: ["admin@dripbazaar.studio", "dripbazaar.studio@gmail.com"]
🔍 User email: dripbazaar.studio@gmail.com
✅ Admin access granted via email whitelist
```

### Step 2: Check What's Failing

If you see:
```
❌ Admin access denied
```

Then check:
1. Is the email correct in the console?
2. Is the profile loaded?
3. Is the role field present?

### Step 3: Common Issues

#### Issue A: Profile is NULL
**Symptom**: Console shows `Profile: null`

**Solution**: Profile not loaded yet. The code should wait for profile to load. Check AuthContext.

#### Issue B: Role is NULL
**Symptom**: Console shows `Profile Role: null`

**Solution**: Run the SQL update:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'dripbazaar.studio@gmail.com';
```

#### Issue C: Email doesn't match
**Symptom**: Console shows different email

**Solution**: Make sure you're logged in with the correct account.

#### Issue D: Old code cached
**Symptom**: No console logs appear

**Solution**: 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Restart dev server

## Code Changes Made

### AdminDashboard.tsx
Added email to whitelist:
```typescript
const adminEmails = [
  'admin@dripbazaar.studio',
  'dripbazaar.studio@gmail.com', // Admin email
];
```

Added debug logging:
```typescript
console.log('🔍 Admin Check - User:', user.email);
console.log('🔍 Admin Check - Profile:', profile);
console.log('🔍 Admin Check - Profile Role:', profile?.role);
```

## Testing Checklist

- [ ] Clear browser cache and localStorage
- [ ] Hard refresh the page
- [ ] Log out completely
- [ ] Log in with `dripbazaar.studio@gmail.com`
- [ ] Check browser console for debug logs
- [ ] Navigate to `/admin`
- [ ] Should see admin dashboard

## If Still Not Working

### Last Resort: Manual Override

Edit `db/src/pages/AdminDashboard.tsx` and temporarily bypass the check:

```typescript
useEffect(() => {
  // TEMPORARY: Force admin access for debugging
  setIsAdmin(true);
  setCheckingAdmin(false);
  return;
  
  // ... rest of the code
}, [user, profile, navigate]);
```

This will let you access the admin panel while we debug the issue.

## Expected Behavior

When working correctly:
1. User logs in with `dripbazaar.studio@gmail.com`
2. AuthContext fetches profile from database
3. Profile includes `role: 'admin'`
4. AdminDashboard checks `profile?.role === 'admin'`
5. Access granted, dashboard loads

## Files to Check

1. `db/src/pages/AdminDashboard.tsx` - Admin check logic
2. `db/src/context/AuthContext.tsx` - Profile fetching
3. `db/src/lib/supabaseClient.ts` - Profile type definition
4. Supabase profiles table - Database records

## SQL Queries for Verification

```sql
-- Check auth user
SELECT id, email FROM auth.users WHERE email = 'dripbazaar.studio@gmail.com';

-- Check profile
SELECT * FROM profiles WHERE email = 'dripbazaar.studio@gmail.com';

-- Check if role column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';

-- List all admins
SELECT email, role FROM profiles WHERE role = 'admin';
```
