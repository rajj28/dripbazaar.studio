# Admin Dashboard Orders Fix

## Issue
Admin dashboard was showing 0 orders even though orders existed in the database with `payment_verified` status.

## Root Cause
The AdminDashboard was filtering for orders with status `'payment_submitted'` in the "Pending Verification" tab, but Razorpay payments were creating orders with status `'payment_verified'` directly (as set in Payment.tsx).

## Solution Applied

### 1. Updated Filter Logic
Changed the pending filter to include multiple statuses:
```typescript
if (filter === 'pending') {
  query = query.in('status', ['pending', 'payment_submitted', 'payment_verified']);
}
```

This now shows orders with:
- `pending` - Initial order creation
- `payment_submitted` - Manual payment screenshot submitted
- `payment_verified` - Razorpay payment completed

### 2. Updated Verify Button Condition
Changed from:
```typescript
order.status === 'payment_submitted' && order.payments?.[0]?.status === 'pending'
```

To:
```typescript
order.status === 'payment_submitted' || order.status === 'payment_verified'
```

Now the "Confirm Order" button shows for both payment types.

### 3. Updated verifyPayment Function
- Removed requirement for payment record (Razorpay orders may not have separate payment records)
- Changed button text from "Verify Payment" to "Confirm Order" (more accurate)
- Function now updates order status to `'confirmed'` regardless of payment method

### 4. Added Better Logging
Added console logs to help debug:
- Filter being applied
- Number of orders fetched
- Order statuses for each order

## Order Status Flow

### Razorpay Payment Flow
1. User completes checkout → Order created with status `'pending'`
2. Razorpay payment succeeds → Order updated to `'payment_verified'`
3. Admin confirms order → Order updated to `'confirmed'`
4. Admin ships order → Order updated to `'shipped'`
5. Order delivered → Order updated to `'delivered'`

### Manual Payment Flow (if implemented)
1. User completes checkout → Order created with status `'pending'`
2. User uploads payment screenshot → Order updated to `'payment_submitted'`
3. Admin verifies payment → Order updated to `'confirmed'`
4. Admin ships order → Order updated to `'shipped'`
5. Order delivered → Order updated to `'delivered'`

## Testing Steps

1. Open Admin Dashboard
2. Check browser console for logs
3. Click "Pending Verification" tab
4. You should see orders with statuses: pending, payment_submitted, or payment_verified
5. Click "All Orders" to see all orders regardless of status
6. Click "Verified & Confirmed" to see confirmed, shipped, and delivered orders

## Console Logs to Check

When you open the admin dashboard, you should see:
```
Fetching orders with filter: pending
Filtering for pending orders (statuses: pending, payment_submitted, payment_verified)
Fetched orders: [...]
Number of orders: 2
Order statuses: [{id: "abc12345", status: "payment_verified"}, ...]
```

## If Orders Still Don't Show

1. Check browser console for errors
2. Verify orders exist in database:
   ```sql
   SELECT id, status, created_at FROM orders ORDER BY created_at DESC;
   ```
3. Check RLS policies on orders table:
   ```sql
   SELECT * FROM orders WHERE status IN ('pending', 'payment_submitted', 'payment_verified');
   ```
4. Ensure user is logged in (admin dashboard requires authentication)
5. Try clicking the "Refresh" button in the admin dashboard

## Files Modified
- `src/pages/AdminDashboard.tsx` - Updated filtering, button conditions, and logging
