# 🚀 DRIP BAZAAR - Quick Reference Guide

## 📋 Project Overview

**Website:** DRIP BAZAAR - India's First Verified Thrift Marketplace
**Domain:** dripbazaar.studio (to be purchased)
**Founder:** Rajvardhan Mane

---

## 🔑 Important Credentials & URLs

### Supabase:
- **Project Ref:** fdobfognqagtloyxmosg
- **URL:** https://fdobfognqagtloyxmosg.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/fdobfognqagtloyxmosg

### Admin:
- **Email:** dripbazaar.studio@gmail.com
- **Dashboard URL:** http://localhost:5174/admin (local)
- **Dashboard URL:** https://dripbazaar.studio/admin (production)

### Contact:
- **WhatsApp:** +91 7028549428
- **Instagram:** https://www.instagram.com/dripbazaar.studio?igsh=MW45ZnFuZ3BveDV2NQ==

### Development:
- **Local Dev:** http://localhost:5174
- **Ngrok URL:** https://7dc3-150-107-26-2.ngrok-free.app

---

## 💰 Pricing & Stock

### Current Drop:
- **Original Price:** ₹4999 (strikethrough)
- **Sale Price:** ₹1234
- **Stock:** 50 pieces per drop
- **Drops:** DROP 01, DROP 02, DROP 03

---

## 📁 Project Structure

```
db/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── HeroHeadline.tsx
│   │   ├── Carousel3D.tsx
│   │   ├── CollectionShowcase.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── PaperCrumpleScroll.tsx
│   │   ├── StoryPage.tsx
│   │   └── Footer3D.tsx
│   ├── pages/               # Page components
│   │   ├── Auth.tsx         # Login/Signup
│   │   ├── PreBook.tsx      # Pre-booking form
│   │   ├── PreBookPayment.tsx
│   │   ├── PaymentSuccess.tsx
│   │   └── AdminDashboard.tsx
│   ├── context/             # React context
│   │   └── AuthContext.tsx
│   ├── lib/                 # Libraries
│   │   └── supabaseClient.ts
│   ├── utils/               # Utilities
│   │   └── errorHandler.ts
│   └── App.tsx              # Main app
├── supabase/
│   └── functions/
│       └── send-email/      # Email function
├── public/                  # Static assets
│   ├── logo.png
│   ├── hero3.png
│   ├── a1.png - a5.png      # Carousel images
│   ├── drop1-3.png          # Collection images
│   └── qr.png               # Payment QR code
└── Documentation files
```

---

## 🗄️ Database Schema

### Tables:

#### profiles
```sql
- id (uuid, primary key)
- email (text)
- created_at (timestamp)
```

#### orders
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- product_name (text)
- size (text)
- amount (numeric)
- full_name (text)
- phone (text)
- address (text)
- city (text)
- state (text)
- pincode (text)
- status (text) - pending, payment_submitted, confirmed, shipped, delivered, cancelled
- created_at (timestamp)
```

#### payments
```sql
- id (uuid, primary key)
- order_id (uuid, foreign key)
- user_id (uuid, foreign key)
- transaction_id (text)
- screenshot_url (text)
- amount (numeric)
- status (text) - pending, verified, rejected
- rejection_reason (text)
- verified_at (timestamp)
- created_at (timestamp)
```

---

## 📧 Email Flow

### 1. Order Confirmation
- **Trigger:** User completes pre-booking
- **Sent to:** Customer
- **Contains:** Order details, next steps

### 2. Payment Received
- **Trigger:** User uploads payment proof
- **Sent to:** Customer
- **Contains:** Payment received confirmation, verification pending

### 3. Order Confirmed (Payment Verified)
- **Trigger:** Admin verifies payment
- **Sent to:** Customer
- **Contains:** Order confirmed, shipping details

---

## 🔄 Order Status Flow

```
pending → payment_submitted → confirmed → shipped → delivered
            ↓
        cancelled (if rejected)
```

### Status Meanings:
- **pending:** Order created, waiting for payment
- **payment_submitted:** Payment proof uploaded, needs admin verification
- **confirmed:** Payment verified, order ready to ship
- **shipped:** Package sent to customer
- **delivered:** Customer received the order
- **cancelled:** Order cancelled or payment rejected

---

## 🛠️ Common Commands

### Development:
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Git:
```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main
```

### Supabase:
```bash
# Login to Supabase
supabase login

# Link project
supabase link --project-ref fdobfognqagtloyxmosg

# Set Resend API key
supabase secrets set RESEND_API_KEY=your_key_here

# Deploy email function
supabase functions deploy send-email

# View function logs
supabase functions logs send-email --tail

# List secrets
supabase secrets list
```

---

## 📱 Routes

### Public Routes:
- `/` - Homepage
- `/auth` - Login/Signup

### Protected Routes (require login):
- `/prebook` - Pre-booking form
- `/prebook-payment/:orderId` - Payment page
- `/payment-success` - Success page
- `/admin` - Admin dashboard

---

## 🎨 Key Features

### Homepage:
1. Hero section with logo and tagline
2. 3D carousel with product images
3. Collection showcase (3 drops)
4. Featured products (coming soon - blurred)
5. Drip Riwaaz section (active)
6. Story section (coming soon - blurred)
7. Footer with social links

### Pre-Booking:
- Authentication required
- Form validation
- Size selection
- Address collection
- Order saved to database
- Email confirmation sent

### Payment:
- QR code display
- Screenshot upload
- Transaction ID capture
- Payment record saved
- Email notification sent

### Admin Dashboard:
- Order listing with filters
- Order details modal
- Payment screenshot view
- One-click verification
- Payment rejection with notes
- Email sent on verification

---

## 🔐 Environment Variables

### Required in .env:
```env
VITE_SUPABASE_URL=https://fdobfognqagtloyxmosg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Required in Supabase Secrets:
```bash
RESEND_API_KEY=re_your_key_here
```

---

## 📚 Documentation Files

### Setup Guides:
- `AUTH_AND_DB_SETUP.md` - Database and auth setup
- `EMAIL_AND_ADMIN_SETUP.md` - Email and admin configuration
- `SETUP_EMAILS_SIMPLE.md` - Simplified email setup
- `INSTALL_SUPABASE_CLI.md` - CLI installation guide

### Deployment:
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `PRE_DEPLOYMENT_CHECKLIST.md` - Pre-launch checklist

### Admin:
- `README_ADMIN.md` - Admin dashboard guide
- `QUICK_START_ADMIN.md` - Quick admin reference

### Development:
- `MOBILE_OPTIMIZATION_SUMMARY.md` - Mobile responsiveness
- `IMPLEMENTATION_SUMMARY.md` - Feature implementation details
- `README.md` - Main project readme

---

## 🚨 Troubleshooting

### Dev server won't start:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Supabase connection issues:
- Check .env file exists and has correct values
- Verify Supabase project is active
- Check network connection

### Emails not sending:
```bash
# Check if function is deployed
supabase functions list

# Check secrets
supabase secrets list

# View logs for errors
supabase functions logs send-email --tail
```

### Admin dashboard not accessible:
- Ensure you're logged in
- Check URL is correct (/admin)
- Verify auth is working
- Check browser console for errors

---

## 📞 Support

### For Technical Issues:
- Check documentation files
- Review error logs
- Test in incognito mode
- Clear browser cache

### For Deployment Issues:
- Follow DEPLOYMENT_GUIDE.md step by step
- Check Vercel deployment logs
- Verify DNS settings
- Wait for DNS propagation (up to 30 minutes)

---

## ✅ Next Steps

1. **Test Everything Locally:**
   - Complete user flow (signup → prebook → payment)
   - Test admin dashboard
   - Verify emails are sending

2. **Buy Domain:**
   - Purchase dripbazaar.studio
   - Keep domain registrar login handy

3. **Deploy to Production:**
   - Follow DEPLOYMENT_GUIDE.md
   - Push code to GitHub
   - Deploy to Vercel
   - Configure DNS
   - Update Supabase settings

4. **Go Live:**
   - Test on production
   - Monitor for issues
   - Share with customers

---

## 🎯 Success Metrics

### Track These:
- Number of pre-bookings
- Payment verification rate
- Email delivery rate
- Page load speed
- Mobile vs desktop traffic
- Conversion rate

### Monitor In:
- Supabase Dashboard (database usage)
- Vercel Analytics (traffic)
- Resend Dashboard (email delivery)

---

**Need more details? Check the specific documentation files listed above!**

