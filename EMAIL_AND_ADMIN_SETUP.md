# Email & Admin Dashboard Setup Guide

## Overview
Complete email notification system using Resend and full-featured admin dashboard for payment verification.

## Part 1: Resend Email Setup

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up for a free account (3,000 emails/month free)
3. Verify your email address

### Step 2: Get API Key
1. Go to Resend Dashboard → API Keys
2. Click "Create API Key"
3. Name it "DRIP BAZAAR Production"
4. Copy the API key (starts with `re_`)

### Step 3: Add Domain (Optional but Recommended)
1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `dripbazaar.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually 5-10 minutes)

**Note:** Without a custom domain, emails will be sent from `onboarding@resend.dev`

### Step 4: Deploy Supabase Edge Function

#### Install Supabase CLI:
```bash
# Windows (using npm)
npm install -g supabase

# Or using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### Login to Supabase:
```bash
supabase login
```

#### Link to your project:
```bash
cd c:\Users\Acer\db
supabase link --project-ref fdobfognqagtloyxmosg
```

#### Set environment variables:
```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Verify secrets
supabase secrets list
```

#### Deploy the function:
```bash
supabase functions deploy send-email
```

### Step 5: Test Email Function

Test in Supabase Dashboard → Edge Functions → send-email → Invoke:

```json
{
  "type": "order_confirmation",
  "orderId": "test-order-id",
  "userEmail": "your-email@example.com"
}
```

## Part 2: Admin Dashboard

### Features:
✅ View all orders with filters (All, Pending, Verified, Confirmed)
✅ Order cards with customer details, payment info, and status
✅ Detailed order modal with payment screenshot
✅ One-click payment verification
✅ Automatic email sending on verification
✅ Payment rejection with reason notes
✅ Real-time status updates

### Access Admin Dashboard:
Navigate to: `http://localhost:5174/admin`

### Admin Dashboard Workflow:

1. **View Pending Payments**
   - Click "Pending Verification" filter
   - See all orders with status "payment_submitted"

2. **Review Order Details**
   - Click "View Details" on any order
   - Modal opens with full information
   - View payment screenshot
   - Check transaction ID

3. **Verify Payment**
   - Click "✓ Verify Payment" button
   - System updates:
     - Payment status → "verified"
     - Order status → "payment_verified"
     - Sends verification email to customer
   - Order moves to "Verified" tab

4. **Reject Payment** (if needed)
   - Click "✕ Reject Payment"
   - Enter rejection reason
   - System updates:
     - Payment status → "failed"
     - Order status → "cancelled"
     - Saves admin notes

## Part 3: Email Templates

### 1. Order Confirmation Email
**Sent:** When user completes pre-booking form
**Trigger:** PreBook.tsx after order creation
**Content:**
- Order details (ID, product, size, amount)
- Delivery address
- Next steps (payment instructions)

### 2. Payment Received Email
**Sent:** When user submits payment with screenshot
**Trigger:** PreBookPayment.tsx after payment submission
**Content:**
- Payment information (transaction ID, amount)
- Verification timeline (24 hours)
- What happens next

### 3. Payment Verified Email
**Sent:** When admin verifies payment
**Trigger:** AdminDashboard.tsx after clicking verify
**Content:**
- Payment confirmation
- Order confirmed status
- Shipping information
- Estimated delivery (15-20 days)

## Part 4: Database Updates

### Add Admin Role (Optional)

To restrict admin dashboard access, add admin role to profiles:

```sql
-- Add admin column to profiles
ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Make yourself admin (replace with your user ID)
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'your-admin-email@example.com';
```

Then update AdminDashboard.tsx to check:
```typescript
useEffect(() => {
  if (!user) {
    navigate('/auth');
    return;
  }
  
  // Check if user is admin
  const checkAdmin = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!data?.is_admin) {
      alert('Access denied. Admin only.');
      navigate('/');
    }
  };
  
  checkAdmin();
}, [user]);
```

## Part 5: Testing Complete Flow

### Test as Customer:
1. ✅ Sign up / Login
2. ✅ Pre-book a drop
3. ✅ Check email for order confirmation
4. ✅ Submit payment with screenshot
5. ✅ Check email for payment received confirmation
6. ✅ Wait for admin verification

### Test as Admin:
1. ✅ Go to `/admin`
2. ✅ Click "Pending Verification"
3. ✅ View order details
4. ✅ Check payment screenshot
5. ✅ Click "Verify Payment"
6. ✅ Confirm customer receives verification email

## Part 6: Production Checklist

### Before Going Live:

- [ ] Add custom domain to Resend
- [ ] Update email "from" address in Edge Function
- [ ] Set up admin role in database
- [ ] Add admin access control to dashboard
- [ ] Test all three email types
- [ ] Verify email deliverability (check spam folders)
- [ ] Set up email monitoring in Resend dashboard
- [ ] Add error logging for failed emails
- [ ] Create backup admin accounts
- [ ] Document admin procedures

### Email Best Practices:

1. **Test thoroughly** - Send test emails to multiple providers (Gmail, Outlook, Yahoo)
2. **Monitor deliverability** - Check Resend dashboard for bounces/complaints
3. **Keep templates updated** - Match your brand voice and design
4. **Add unsubscribe links** - For marketing emails (not required for transactional)
5. **Track opens/clicks** - Use Resend analytics

## Part 7: Troubleshooting

### Email not sending:
- Check Resend API key is set correctly
- Verify Edge Function is deployed
- Check Supabase logs for errors
- Ensure user email exists in database

### Admin dashboard not loading:
- Check user is authenticated
- Verify orders exist in database
- Check browser console for errors
- Ensure Supabase connection is working

### Payment verification fails:
- Check payment record exists
- Verify order ID is correct
- Ensure user has permission to update
- Check RLS policies in Supabase

## Part 8: Future Enhancements

### Email Enhancements:
- [ ] Shipping notification email
- [ ] Delivery confirmation email
- [ ] Order cancellation email
- [ ] Refund processed email
- [ ] Newsletter/marketing emails

### Admin Dashboard Enhancements:
- [ ] Bulk payment verification
- [ ] Export orders to CSV
- [ ] Sales analytics dashboard
- [ ] Inventory management
- [ ] Customer management
- [ ] Shipping label generation
- [ ] Order tracking integration

## Support

For issues:
- Resend: https://resend.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Admin Dashboard: Check browser console and Supabase logs

---

**Ready to test!** Start by setting up Resend, then deploy the Edge Function, and finally test the complete flow.
