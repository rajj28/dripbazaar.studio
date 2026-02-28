# Admin Dashboard Orders Not Showing - Debug Guide

## Problem
Admin dashboard shows "0 orders" even though orders exist in the database with `payment_submitted` or `payment_verified` status.

## Possible Causes & Solutions

### 1. Row Level Security (RLS) Policies

**Issue**: RLS policies might be blocking the admin from viewing orders.

**Solution**: Run the RLS fix script
```bash
# In Supabase SQL Editor, run:
db/fix-admin-orders-rls.sql
```

This script will:
- Drop old restrictive policies
- Create new policies that allow authenticated users to view all orders
- Allow both authenticated and anonymous users to create orders
- Allow admins to update orders

### 2. Missing `status` Column

**Issue**: Old schema uses `payment_status` but code uses `status`.

**Solution**: Run the schema migration script
```bash
# In Supabase SQL Editor, run:
db/fix-orders-table-schema.sql
```

This script will:
- Add `status` column if missing
- Add `payment_method` column if missing
- Migrate data from `payment_status` to `status`
- Create indexes for better performance

### 3. Check Orders Exist in Database

**Run this query in Supabase SQL Editor:**
```sql
-- Check all orders
SELECT 
    id,
    user_id,
    status,
    payment_method,
    total_amount,
    created_at
FROM orders
ORDER BY created_at DESC;
```

**Expected Result**: You should see your 2 orders with status `payment_submitted` or `payment_verified`.

### 4. Check Browser Console

**Steps:**
1. Open Admin Dashboard
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Look for these logs:

```
Fetching orders with filter: pending
Filtering for pending orders (statuses: pending, payment_submitted, payment_verified)
Fetched orders: [...]
Number of orders: 2
```

**If you see errors:**
- `Failed to load orders: permission denied` → RLS policy issue (run fix-admin-orders-rls.sql)
- `column "status" does not exist` → Schema issue (run fix-orders-table-schema.sql)
- `No orders found` but database has orders → Filter issue (already fixed in code)

### 5. Verify User is Logged In

**Check:**
1. Open Browser DevTools → Application → Local Storage
2. Look for key: `drip-riwaaz-auth`
3. Should contain user session data

**If not logged in:**
- Go to `/auth` and sign in
- Admin dashboard requires authentication

### 6. Check Supabase Connection

**Verify .env file:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Test connection:**
```sql
-- In Supabase SQL Editor
SELECT current_user, current_database();
```

### 7. Clear Cache and Reload

Sometimes the issue is just cached data:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+Shift+R)
3. Or use Incognito/Private mode

## Step-by-Step Debugging Process

### Step 1: Check Database
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) as total_orders FROM orders;
SELECT status, COUNT(*) as count FROM orders GROUP BY status;
```

**Expected**: Should show 2 orders with their statuses.

### Step 2: Check RLS Policies
```sql
-- Run in Supabase SQL Editor
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'orders';
```

**Expected**: Should show policies that allow SELECT for authenticated users.

### Step 3: Test Direct Query
```sql
-- Run in Supabase SQL Editor (as authenticated user)
SELECT * FROM orders WHERE status IN ('pending', 'payment_submitted', 'payment_verified');
```

**Expected**: Should return your 2 orders.

### Step 4: Check Admin Dashboard Code
Open `db/src/pages/AdminDashboard.tsx` and verify:
- Line ~50: Filter includes `'payment_submitted'` and `'payment_verified'`
- Console logs are present
- No TypeScript errors

### Step 5: Test in Browser
1. Open Admin Dashboard
2. Open DevTools Console
3. Click "Pending Verification" tab
4. Click "Refresh" button
5. Check console logs

## Quick Fix Commands

### Run All Fixes at Once
```sql
-- Copy and paste this entire block into Supabase SQL Editor

-- 1. Fix RLS Policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

CREATE POLICY "Authenticated users can view all orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can view all orders" ON orders FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can create orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anonymous users can create orders" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated users can update orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 2. Add missing columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- 4. Verify
SELECT id, status, payment_method, total_amount, created_at FROM orders ORDER BY created_at DESC;
```

## After Running Fixes

1. Refresh the Admin Dashboard page
2. Click "Pending Verification" tab
3. You should now see your 2 orders
4. Check browser console for confirmation logs

## Still Not Working?

If orders still don't show after all fixes:

1. **Export your orders data:**
```sql
SELECT * FROM orders;
```
Copy the results and save them.

2. **Check if payments table exists:**
```sql
SELECT * FROM payments;
```

3. **Verify the join query works:**
```sql
SELECT o.*, p.* 
FROM orders o
LEFT JOIN payments p ON p.order_id = o.id
WHERE o.status IN ('pending', 'payment_submitted', 'payment_verified')
ORDER BY o.created_at DESC;
```

4. **Contact support with:**
   - Browser console logs
   - SQL query results
   - Network tab showing the API request/response

## Prevention

To prevent this issue in the future:

1. Always test RLS policies after creating tables
2. Use consistent column names across schema and code
3. Add proper indexes for frequently queried columns
4. Test admin dashboard after each deployment
5. Keep schema documentation updated

## Files to Check

- `db/src/pages/AdminDashboard.tsx` - Admin dashboard code
- `db/supabase-schema.sql` - Database schema
- `db/fix-admin-orders-rls.sql` - RLS policy fixes
- `db/fix-orders-table-schema.sql` - Schema migration
- `db/.env` - Supabase connection settings
