# Quick Start: Admin Dashboard & Emails

## 🚀 Quick Setup (5 minutes)

### 1. Get Resend API Key
```
1. Go to https://resend.com
2. Sign up (free)
3. Dashboard → API Keys → Create
4. Copy the key (starts with re_)
```

### 2. Deploy Email Function
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
cd c:\Users\Acer\db
supabase link --project-ref fdobfognqagtloyxmosg

# Set API key
supabase secrets set RESEND_API_KEY=re_your_key_here

# Deploy
supabase functions deploy send-email
```

### 3. Access Admin Dashboard
```
URL: http://localhost:5174/admin
```

## 📧 Email Flow

### Automatic Emails:
1. **Order Confirmation** → Sent when user completes pre-booking
2. **Payment Received** → Sent when user uploads payment proof
3. **Payment Verified** → Sent when admin clicks verify

### Email Sender:
- Default: `orders@dripbazaar.com` (via Resend)
- Shows as: "DRIP BAZAAR <orders@dripbazaar.com>"

## 🎛️ Admin Dashboard Guide

### Filters:
- **All Orders** - See everything
- **Pending Verification** - Needs your attention ⚠️
- **Verified** - Approved payments ✓
- **Confirmed** - Ready to ship 📦

### Actions:
1. **View Details** - See full order info + payment screenshot
2. **Verify Payment** - Approve payment (sends email to customer)
3. **Reject Payment** - Decline with reason

### Order Card Info:
- Customer name, email, phone
- Product, size, amount
- Transaction ID
- Payment screenshot
- Order date & status

## ✅ Daily Workflow

### Morning Routine:
1. Open `/admin`
2. Click "Pending Verification"
3. For each order:
   - Click "View Details"
   - Check payment screenshot
   - Verify transaction ID matches
   - Click "✓ Verify Payment"
4. Customer gets email automatically

### If Payment is Invalid:
1. Click "✕ Reject Payment"
2. Enter reason (e.g., "Invalid transaction ID")
3. Customer can resubmit

## 🔍 What to Check

### Before Verifying:
- [ ] Payment screenshot is clear
- [ ] Transaction ID is visible in screenshot
- [ ] Transaction ID matches what user entered
- [ ] Amount is ₹1234
- [ ] Payment is to correct UPI ID

### Red Flags:
- ❌ Blurry screenshot
- ❌ Transaction ID doesn't match
- ❌ Wrong amount
- ❌ Old/reused screenshot
- ❌ Edited/fake screenshot

## 📊 Order Status Flow

```
pending → payment_submitted → confirmed → shipped → delivered
                ↓
            cancelled (if rejected)
```

### Status Meanings:
- **pending** - Order created, waiting for payment
- **payment_submitted** - User uploaded proof, needs verification
- **confirmed** - Payment verified by admin, order confirmed and ready to ship
- **shipped** - On the way to customer
- **delivered** - Customer received it
- **cancelled** - Payment rejected or order cancelled

## 🎨 Dashboard Features

### Order Cards Show:
- Drop name (DROP 01, 02, 03)
- Customer details
- Payment info
- Status badge (color-coded)
- Quick actions

### Modal Shows:
- Full customer info
- Complete delivery address
- Payment screenshot (clickable)
- Transaction details
- Verify/Reject buttons

## 🔐 Security Notes

### Admin Access:
- Currently: Anyone logged in can access `/admin`
- Recommended: Add admin role check (see EMAIL_AND_ADMIN_SETUP.md)

### Payment Verification:
- Always verify screenshot authenticity
- Cross-check transaction ID
- Look for signs of editing
- When in doubt, contact customer

## 📱 Mobile Friendly

Dashboard works on:
- Desktop ✓
- Tablet ✓
- Mobile ✓

## 🆘 Troubleshooting

### Emails not sending?
```bash
# Check if function is deployed
supabase functions list

# Check secrets
supabase secrets list

# View logs
supabase functions logs send-email
```

### Dashboard not loading?
- Check you're logged in
- Check browser console (F12)
- Verify Supabase connection
- Check .env file has correct keys

### Can't verify payment?
- Ensure payment record exists
- Check order status is "payment_submitted"
- Verify you have permission
- Check Supabase logs

## 📞 Quick Commands

```bash
# View function logs
supabase functions logs send-email --tail

# Update Resend key
supabase secrets set RESEND_API_KEY=new_key

# Redeploy function
supabase functions deploy send-email

# Check project status
supabase status
```

## 🎯 Success Metrics

Track in Resend Dashboard:
- Emails sent
- Delivery rate
- Open rate
- Bounce rate

Track in Admin Dashboard:
- Pending verifications
- Verified today
- Total orders
- Revenue

---

**Need help?** Check EMAIL_AND_ADMIN_SETUP.md for detailed instructions.
