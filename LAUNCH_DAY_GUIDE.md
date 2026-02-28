# 🚀 Launch Day Guide - DRIP BAZAAR

## Your step-by-step guide to going live

---

## ⏰ Timeline: ~2 hours total

- **Domain Purchase:** 10 minutes
- **GitHub Setup:** 10 minutes
- **Vercel Deployment:** 15 minutes
- **DNS Configuration:** 10 minutes
- **Supabase Updates:** 5 minutes
- **Testing:** 60 minutes
- **Final Checks:** 10 minutes

---

## 📋 Before You Start

### Have These Ready:
- [ ] Credit/debit card for domain purchase (~$10-15)
- [ ] GitHub account (create at github.com if needed)
- [ ] Vercel account (will create during deployment)
- [ ] Supabase dashboard access
- [ ] Test email address for verification
- [ ] Test phone number for orders

### Ensure These Work Locally:
- [ ] Dev server runs: `npm run dev`
- [ ] Can signup/login
- [ ] Can create pre-booking
- [ ] Can upload payment
- [ ] Admin dashboard accessible
- [ ] Emails are sending

---

## Step 1: Buy Domain (10 minutes)

### 1.1 Choose Registrar
Recommended: **Namecheap** (cheapest, easiest)
- Go to: https://www.namecheap.com

### 1.2 Search & Purchase
1. Search for: `dripbazaar.studio`
2. Add to cart
3. Proceed to checkout
4. Create account or login
5. Complete payment (~$10-15)
6. You'll receive confirmation email

### 1.3 Access Domain Management
1. Login to Namecheap
2. Go to "Domain List"
3. Click "Manage" next to dripbazaar.studio
4. Keep this tab open (you'll need it later)

**✅ Checkpoint:** Domain purchased and accessible in registrar dashboard

---

## Step 2: Push Code to GitHub (10 minutes)

### 2.1 Create GitHub Repository
1. Go to: https://github.com/new
2. Repository name: `drip-bazaar`
3. Description: "DRIP BAZAAR - India's First Verified Thrift Marketplace"
4. Select: **Private**
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### 2.2 Initialize Git Locally
Open PowerShell in your project folder:

```powershell
cd C:\Users\Acer\db

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - DRIP BAZAAR ready for launch"
```

### 2.3 Push to GitHub
Replace `YOUR_USERNAME` with your GitHub username:

```powershell
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/drip-bazaar.git

# Push
git branch -M main
git push -u origin main
```

If prompted, login with your GitHub credentials.

**✅ Checkpoint:** Code visible on GitHub at github.com/YOUR_USERNAME/drip-bazaar

---

## Step 3: Deploy to Vercel (15 minutes)

### 3.1 Create Vercel Account
1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access GitHub
4. Complete signup

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Find `drip-bazaar` in the list
3. Click "Import"

### 3.3 Configure Project
**Framework Preset:** Vite (should auto-detect)

**Build & Development Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Root Directory:** `./` (leave as is)

### 3.4 Add Environment Variables
Click "Environment Variables" and add these:

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://fdobfognqagtloyxmosg.supabase.co
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkb2Jmb2ducWFndGxveXhtb3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDU0MTQsImV4cCI6MjA4Nzc4MTQxNH0.bJE1qI0dEFL7lf7aRSjvvfxsHPa5kmh775BMTMtl12c
```

### 3.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes (watch the build logs)
3. You'll see "Congratulations!" when done
4. Click "Visit" to see your site

**✅ Checkpoint:** Site live at something like `drip-bazaar.vercel.app`

---

## Step 4: Connect Custom Domain (10 minutes)

### 4.1 Add Domain in Vercel
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Enter: `dripbazaar.studio`
4. Click "Add"

Vercel will show you DNS records to add.

### 4.2 Configure DNS in Namecheap
1. Go back to Namecheap tab
2. Click "Advanced DNS" tab
3. Delete any existing A records or CNAME records for @ and www

**Add Record 1 (Root Domain):**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

**Add Record 2 (WWW):**
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

4. Click "Save All Changes"

### 4.3 Wait for DNS Propagation
- Usually takes 5-30 minutes
- Check status: https://dnschecker.org
- Enter: dripbazaar.studio

**✅ Checkpoint:** https://dripbazaar.studio loads your site with HTTPS

---

## Step 5: Update Supabase Settings (5 minutes)

### 5.1 Update Site URL
1. Go to: https://supabase.com/dashboard/project/fdobfognqagtloyxmosg/settings/auth
2. Scroll to "Site URL"
3. Change from `http://localhost:5174` to `https://dripbazaar.studio`
4. Click "Save"

### 5.2 Add Redirect URLs
Scroll to "Redirect URLs" and add these (one per line):

```
https://dripbazaar.studio
https://dripbazaar.studio/**
https://www.dripbazaar.studio
https://www.dripbazaar.studio/**
```

Click "Save"

**✅ Checkpoint:** Supabase configured for production domain

---

## Step 6: Comprehensive Testing (60 minutes)

### 6.1 Basic Site Test (5 minutes)
- [ ] Visit https://dripbazaar.studio
- [ ] Site loads with HTTPS (padlock icon)
- [ ] Logo displays correctly
- [ ] All images load
- [ ] 3D carousel works
- [ ] Navigation menu works
- [ ] Footer links work

### 6.2 Authentication Test (10 minutes)

**Signup:**
- [ ] Click "PRE-BOOK NOW"
- [ ] Click "Sign Up"
- [ ] Enter test email and password
- [ ] Signup succeeds
- [ ] Redirected to pre-booking form

**Logout:**
- [ ] Click profile/logout
- [ ] Logged out successfully

**Login:**
- [ ] Click "PRE-BOOK NOW"
- [ ] Click "Login"
- [ ] Enter same credentials
- [ ] Login succeeds
- [ ] Redirected to pre-booking form

### 6.3 Pre-Booking Test (15 minutes)

**Fill Form:**
- [ ] Full Name: Test Customer
- [ ] Phone: 9876543210
- [ ] Address: 123 Test Street
- [ ] City: Mumbai
- [ ] State: Maharashtra
- [ ] Pincode: 400001
- [ ] Size: M
- [ ] Click "CONFIRM PRE-BOOKING"

**Verify:**
- [ ] Success message appears
- [ ] Redirected to payment page
- [ ] Order ID visible in URL

**Check Email:**
- [ ] Order confirmation email received
- [ ] Email has correct details
- [ ] Email looks professional

**Check Database:**
1. Go to Supabase dashboard
2. Table Editor → orders
3. [ ] New order visible
4. [ ] Status is "pending"
5. [ ] All details correct

### 6.4 Payment Test (15 minutes)

**Upload Payment:**
- [ ] QR code displays
- [ ] Take screenshot of any payment (or use test image)
- [ ] Click "Choose File"
- [ ] Select screenshot
- [ ] Enter Transaction ID: TEST123456
- [ ] Click "SUBMIT PAYMENT"

**Verify:**
- [ ] Success message appears
- [ ] Redirected to success page
- [ ] Success page displays correctly

**Check Email:**
- [ ] Payment received email arrives
- [ ] Email has correct details

**Check Database:**
1. Supabase → Table Editor → payments
2. [ ] New payment record visible
3. [ ] Screenshot URL present
4. [ ] Transaction ID correct
5. [ ] Status is "pending"

6. Supabase → Table Editor → orders
7. [ ] Order status changed to "payment_submitted"

### 6.5 Admin Dashboard Test (15 minutes)

**Access Dashboard:**
- [ ] Go to https://dripbazaar.studio/admin
- [ ] Login with admin email: dripbazaar.studio@gmail.com
- [ ] Dashboard loads correctly

**View Orders:**
- [ ] Test order visible in list
- [ ] Order card shows correct info
- [ ] Status badge shows "Payment Submitted"

**Filter Orders:**
- [ ] Click "All Orders" - shows all
- [ ] Click "Pending Verification" - shows test order
- [ ] Click "Verified" - shows none (yet)
- [ ] Click "Confirmed" - shows none (yet)

**View Order Details:**
- [ ] Click "View Details" on test order
- [ ] Modal opens
- [ ] All customer details visible
- [ ] Payment screenshot visible
- [ ] Click screenshot - opens in new tab
- [ ] Transaction ID visible

**Verify Payment:**
- [ ] Click "✓ Verify Payment"
- [ ] Confirmation prompt appears
- [ ] Click "Yes, verify"
- [ ] Success message appears
- [ ] Modal closes
- [ ] Order status updates to "Confirmed"
- [ ] Status badge turns green

**Check Email:**
- [ ] Customer receives "Order Confirmed" email
- [ ] Email has correct details
- [ ] Email looks professional

**Check Database:**
1. Supabase → payments table
2. [ ] Payment status changed to "verified"
3. [ ] verified_at timestamp set

4. Supabase → orders table
5. [ ] Order status changed to "confirmed"

### 6.6 Mobile Test (10 minutes)

**On Your Phone:**
1. Open browser (Chrome/Safari)
2. Go to: https://dripbazaar.studio

**Test:**
- [ ] Site loads properly
- [ ] Images display correctly
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] Navigation menu works
- [ ] Can scroll smoothly
- [ ] 3D carousel works
- [ ] Forms are usable

**Test Pre-Booking on Mobile:**
- [ ] Can fill form easily
- [ ] Can upload photo
- [ ] Can submit payment

---

## Step 7: Final Checks (10 minutes)

### 7.1 Performance Check
1. Go to: https://pagespeed.web.dev
2. Enter: https://dripbazaar.studio
3. Click "Analyze"
4. [ ] Mobile score > 70
5. [ ] Desktop score > 80

### 7.2 Security Check
- [ ] HTTPS working (padlock icon)
- [ ] No mixed content warnings
- [ ] No console errors (F12)

### 7.3 SEO Check
- [ ] Page title correct
- [ ] Meta description present
- [ ] Favicon displays

### 7.4 Functionality Check
- [ ] All links work
- [ ] No broken images
- [ ] Forms validate properly
- [ ] Error messages display correctly

---

## Step 8: Go Live! 🎉

### 8.1 Announce Launch
**Instagram Post:**
```
🚀 WE'RE LIVE! 🚀

DRIP BAZAAR is now officially open!

India's First Verified Thrift Marketplace

✨ Exclusive Drops
💯 Verified Quality
🔥 Limited Stock (Only 50 pieces!)

Pre-book now at dripbazaar.studio

#DripBazaar #ThriftIndia #SustainableFashion
```

**WhatsApp Status:**
```
🎉 DRIP BAZAAR IS LIVE!

Visit: dripbazaar.studio

Limited stock - Pre-book now! 🔥
```

### 8.2 Monitor First Day
**Check Every Hour:**
- [ ] Site is up and running
- [ ] Orders coming in
- [ ] Emails sending
- [ ] No errors in Vercel logs
- [ ] No errors in Supabase logs

**Respond Quickly:**
- [ ] Answer customer questions
- [ ] Verify payments promptly
- [ ] Fix any issues immediately

---

## 🆘 Emergency Troubleshooting

### Site is Down
1. Check Vercel status: https://vercel.com/status
2. Check Supabase status: https://status.supabase.com
3. Check domain DNS: https://dnschecker.org

### Emails Not Sending
```bash
# Check function logs
supabase functions logs send-email --tail

# Redeploy if needed
supabase functions deploy send-email
```

### Orders Not Saving
1. Check Supabase dashboard
2. Check browser console (F12)
3. Verify environment variables in Vercel

### Payment Upload Failing
1. Check Supabase storage bucket
2. Verify file size < 5MB
3. Check file type (jpg, png, pdf)

---

## 📊 Post-Launch Monitoring

### Daily Tasks:
- [ ] Check admin dashboard for new orders
- [ ] Verify payments
- [ ] Respond to customer queries
- [ ] Monitor email delivery (Resend dashboard)

### Weekly Tasks:
- [ ] Review analytics (Vercel)
- [ ] Check database usage (Supabase)
- [ ] Backup important data
- [ ] Update stock counts if needed

### Monthly Tasks:
- [ ] Review performance metrics
- [ ] Optimize based on user feedback
- [ ] Plan new drops
- [ ] Update content

---

## 🎯 Success Metrics

### Track These:
- **Orders per day**
- **Conversion rate** (visitors → orders)
- **Payment verification time**
- **Email delivery rate**
- **Page load speed**
- **Mobile vs desktop traffic**

### Goals for First Week:
- [ ] 10+ pre-bookings
- [ ] 100% email delivery
- [ ] < 3 second page load
- [ ] Zero downtime
- [ ] All payments verified within 24 hours

---

## 🎉 Congratulations!

You've successfully launched DRIP BAZAAR!

### What You've Accomplished:
✅ Built a complete e-commerce platform
✅ Integrated authentication and database
✅ Set up automated email system
✅ Created admin dashboard
✅ Made it mobile-friendly
✅ Deployed to production
✅ Connected custom domain

### Next Steps:
1. Keep monitoring the site
2. Respond to customers quickly
3. Verify payments promptly
4. Gather feedback
5. Plan improvements
6. Scale as you grow

---

**You're now live! Time to make some sales! 🚀💰**

Need help? Check the other documentation files or reach out for support.

