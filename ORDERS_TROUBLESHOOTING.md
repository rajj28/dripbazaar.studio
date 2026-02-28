## Orders Not Showing - Troubleshooting Guide

### Issue: Orders not visible in "My Orders" or Admin Dashboard

## Step 1: Check Database

Run `check-orders-debug.sql` in Supabase SQL Editor to verify:

1. **Orders exist in database**
   ```sql
   SELECT COUNT(*) FROM orders;
   ```

2. **Orders have user_id set**
   ```sql
   SELECT id, user_id, status FROM orders ORDER BY created_at DESC LIMIT 5;
   ```

3. **Check order status**
   ```sql
   SELECT status, COUNT(*) FROM orders GROUP BY status;
   ```

## Step 2: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Place a test order
4. Look for:
   - "Loading orders for user: [user-id]"
   - "Orders loaded: [array]"
   - Any error messages

## Step 3: Verify User is Logged In

1. Check if profile icon shows user info
2. Open Console and type: `localStorage.getItem('drip-riwaaz-auth')`
3. Should show JWT token

## Step 4: Check RLS Policies

Run in Supabase SQL Editor:

```sql
-- Check orders RLS policies
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- If no policies or wrong policies, run:
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;

CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IN (
  SELECT id FROM profiles WHERE email LIKE '%admin%'
));

CREATE POLICY "Users can create orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON orders FOR UPDATE 
USING (auth.uid() = user_id);
```

## Step 5: Test Order Creation

### Manual Test:

1. Log in to your app
2. Add items to cart
3. Go to checkout
4. Fill in address
5. Go to payment
6. Complete payment
7. Check browser console for errors
8. Check Supabase logs

### Check if order was created:

```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```

## Step 6: Common Issues & Solutions

### Issue 1: user_id is NULL

**Cause:** User not logged in when placing order

**Solution:**
- Ensure user is logged in before checkout
- Check AuthContext is providing user
- Verify JWT token exists

### Issue 2: RLS blocking queries

**Cause:** Row Level Security policies too restrictive

**Solution:**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Test if orders show up
-- If yes, RLS is the issue

-- Re-enable and fix policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

### Issue 3: Wrong import path

**Cause:** Using wrong supabase import

**Solution:**
- Should use: `import { supabase } from '../lib/supabaseClient'`
- NOT: `import { supabase } from '../lib/supabase'`

### Issue 4: Payment record creation fails

**Cause:** Missing required fields in payments table

**Solution:**
```sql
-- Check payments table structure
SELECT column_name, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'payments';

-- Make payment_screenshot_url nullable if not already
ALTER TABLE payments 
ALTER COLUMN payment_screenshot_url DROP NOT NULL;
```

### Issue 5: Orders exist but not showing in UI

**Cause:** Filter logic or query issue

**Solution:**
- Check AdminDashboard filter (default is 'pending')
- Change filter to 'all' to see all orders
- Check Orders page is querying correct user_id

## Step 7: Enable Detailed Logging

Add to Payment.tsx after order creation:

```typescript
const order = await createOrder();
console.log('Order created:', order);
console.log('Order ID:', order?.id);
console.log('User ID:', user?.id);
```

Add to Orders.tsx:

```typescript
useEffect(() => {
  console.log('User:', user);
  console.log('User ID:', user?.id);
  if (user) {
    loadOrders();
  }
}, [user]);
```

## Step 8: Verify Database Schema

Run in Supabase:

```sql
-- Check orders table structure
\d orders

-- Should have these columns:
-- id (uuid)
-- user_id (uuid)
-- items (jsonb)
-- total_amount (numeric)
-- address (jsonb)
-- status (text)
-- payment_method (text)
-- razorpay_order_id (text)
-- razorpay_payment_id (text)
-- created_at (timestamp)
```

## Step 9: Test with SQL Insert

Manually insert a test order:

```sql
INSERT INTO orders (
  user_id,
  items,
  total_amount,
  address,
  status,
  payment_method
) VALUES (
  (SELECT id FROM auth.users LIMIT 1), -- Use your user ID
  '[{"name": "Test Product", "quantity": 1, "price": 100}]'::jsonb,
  100,
  '{"full_name": "Test User", "phone": "1234567890", "city": "Mumbai"}'::jsonb,
  'pending',
  'test'
);

-- Check if it shows up in Orders page
SELECT * FROM orders WHERE payment_method = 'test';
```

## Step 10: Check Network Requests

1. Open DevTools → Network tab
2. Filter by "orders"
3. Place an order
4. Check:
   - POST request to create order (status 201)
   - GET request to fetch orders (status 200)
   - Response data

## Quick Fix Checklist

- [ ] User is logged in
- [ ] JWT token exists in localStorage
- [ ] Orders table has RLS policies
- [ ] user_id is set when creating orders
- [ ] Using correct supabase import
- [ ] payment_screenshot_url is nullable
- [ ] Browser console shows no errors
- [ ] Network requests succeed
- [ ] Orders exist in database
- [ ] RLS policies allow user to read their orders

## Still Not Working?

1. Share browser console errors
2. Share Supabase logs
3. Share result of check-orders-debug.sql
4. Check if orders table exists: `SELECT * FROM orders LIMIT 1;`
