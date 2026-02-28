# ✅ Pre-Deployment Checklist - DRIP BAZAAR

## Complete this checklist before deploying to production

---

## 🔐 Authentication & Database

- [x] Supabase project created (fdobfognqagtloyxmosg)
- [x] Database schema deployed (profiles, orders, payments tables)
- [x] Row Level Security (RLS) policies enabled
- [x] Auth configured (email/password)
- [x] Environment variables set in .env
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test logout flow

---

## 📧 Email System

- [x] Resend account created
- [x] Resend API key obtained
- [x] Email function deployed to Supabase
- [x] RESEND_API_KEY set in Supabase secrets
- [ ] Test order confirmation email
- [ ] Test payment received email
- [ ] Test payment verified email
- [ ] Verify emails arrive in inbox (not spam)

---

## 🎨 Website Content

- [x] Hero section with logo and tagline
- [x] 3D carousel with product images (a1-a5.png)
- [x] Collection showcase with drops (drop1-3.png)
- [x] Featured products section (blurred - coming soon)
- [x] Drip Riwaaz section (unblurred)
- [x] Story section (blurred - coming soon)
- [x] Footer with founder name and social links
- [ ] All images loading correctly
- [ ] All links working

---

## 🛒 Pre-Booking System

- [x] Pre-booking form created
- [x] Payment page with QR code
- [x] Payment success page
- [x] Form validation working
- [x] Data saving to Supabase
- [x] Authentication required
- [ ] Test complete pre-booking flow
- [ ] Test with different sizes
- [ ] Test with different addresses

---

## 💳 Payment System

- [x] QR code image added (qr.png)
- [x] Screenshot upload working
- [x] Transaction ID capture
- [x] Payment records saving to database
- [ ] Test screenshot upload
- [ ] Test with different file types
- [ ] Verify payment data in Supabase

---

## 🎛️ Admin Dashboard

- [x] Admin dashboard created (/admin)
- [x] Order listing with filters
- [x] Order detail modal
- [x] Payment verification button
- [x] Payment rejection with notes
- [x] Email sent on verification
- [ ] Test admin login
- [ ] Test order filtering
- [ ] Test payment verification
- [ ] Test payment rejection
- [ ] Verify email sent after verification

---

## 📱 Mobile Responsiveness

- [x] Hero section responsive
- [x] Navbar mobile menu
- [x] 3D carousel mobile-friendly
- [x] Collection showcase mobile layout
- [x] Featured products responsive
- [x] Footer responsive
- [x] Pre-booking form mobile-friendly
- [x] Payment page mobile-friendly
- [x] Admin dashboard mobile-friendly
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet
- [ ] Test all breakpoints (480px, 768px, 968px)

---

## 🔒 Security

- [x] Environment variables not committed to git
- [x] Supabase RLS policies enabled
- [x] API keys stored securely
- [ ] Add admin role check (recommended)
- [ ] Test unauthorized access attempts
- [ ] Verify payment screenshot security
- [ ] Check for SQL injection vulnerabilities

---

## 🚀 Performance

- [ ] Test page load speed (< 3 seconds)
- [ ] Optimize images if needed
- [ ] Check 3D model performance
- [ ] Test on slow connection
- [ ] Verify lazy loading works
- [ ] Check bundle size

---

## 🧪 Testing Checklist

### User Flow:
1. [ ] Visit homepage
2. [ ] Browse products
3. [ ] Click "PRE-BOOK NOW"
4. [ ] Sign up / Login
5. [ ] Fill pre-booking form
6. [ ] Submit order
7. [ ] Receive confirmation email
8. [ ] Go to payment page
9. [ ] Upload payment screenshot
10. [ ] Enter transaction ID
11. [ ] Submit payment
12. [ ] Receive payment received email

### Admin Flow:
1. [ ] Login as admin (dripbazaar.studio@gmail.com)
2. [ ] Go to /admin
3. [ ] See pending orders
4. [ ] Click order to view details
5. [ ] View payment screenshot
6. [ ] Verify payment
7. [ ] Confirm customer receives email

### Error Handling:
- [ ] Test with invalid email
- [ ] Test with weak password
- [ ] Test with missing form fields
- [ ] Test with invalid phone number
- [ ] Test with invalid pincode
- [ ] Test with large file upload
- [ ] Test with no internet connection

---

## 📊 Data Verification

### Check Supabase Tables:

#### profiles table:
- [ ] User profiles created on signup
- [ ] Email stored correctly
- [ ] Created_at timestamp set

#### orders table:
- [ ] Orders created on pre-booking
- [ ] All fields populated correctly
- [ ] User_id linked to profile
- [ ] Status set to "pending"

#### payments table:
- [ ] Payment records created
- [ ] Screenshot URL stored
- [ ] Transaction ID captured
- [ ] Status set to "pending"

---

## 🌐 Domain & Hosting

- [ ] Domain purchased (dripbazaar.studio)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Custom domain connected
- [ ] DNS records configured
- [ ] SSL certificate active (HTTPS)
- [ ] Site accessible at https://dripbazaar.studio

---

## 🔧 Supabase Configuration

- [ ] Site URL updated to https://dripbazaar.studio
- [ ] Redirect URLs added:
  - [ ] https://dripbazaar.studio
  - [ ] https://dripbazaar.studio/**
  - [ ] https://www.dripbazaar.studio
  - [ ] https://www.dripbazaar.studio/**
- [ ] Email templates customized (optional)
- [ ] Storage bucket configured for screenshots

---

## 📧 Resend Configuration (Optional)

- [ ] Custom domain added (dripbazaar.studio)
- [ ] DNS records configured
- [ ] Domain verified
- [ ] Email function updated with custom domain
- [ ] Test email from custom domain

---

## 📈 Analytics & Monitoring

- [ ] Vercel Analytics enabled
- [ ] Google Analytics added (optional)
- [ ] Error tracking set up (optional)
- [ ] Uptime monitoring (optional)

---

## 📝 Documentation

- [x] README.md updated
- [x] Deployment guide created
- [x] Admin guide created
- [x] Email setup guide created
- [x] Mobile optimization documented
- [ ] Add troubleshooting section
- [ ] Document common issues

---

## 🎯 Final Checks

### Before Going Live:
- [ ] All features tested end-to-end
- [ ] No console errors
- [ ] No broken links
- [ ] All images loading
- [ ] All emails sending
- [ ] Admin dashboard working
- [ ] Mobile version tested
- [ ] Performance acceptable
- [ ] Security measures in place

### After Going Live:
- [ ] Test live site thoroughly
- [ ] Monitor error logs
- [ ] Check email delivery
- [ ] Monitor database usage
- [ ] Set up backups
- [ ] Create support process
- [ ] Plan for scaling

---

## 🆘 Emergency Contacts

### Services:
- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Resend Support**: https://resend.com/support

### Quick Commands:
```bash
# View Supabase logs
supabase functions logs send-email --tail

# Redeploy email function
supabase functions deploy send-email

# Check Vercel deployment
vercel logs

# Rollback Vercel deployment
vercel rollback
```

---

## 📞 Support Information

### Admin Email:
dripbazaar.studio@gmail.com

### WhatsApp:
+91 7028549428

### Instagram:
@dripbazaar.studio

---

## ✅ Sign-Off

Once all items are checked:

- [ ] I have tested all user flows
- [ ] I have tested all admin functions
- [ ] I have verified all emails work
- [ ] I have tested on mobile devices
- [ ] I have checked security measures
- [ ] I am ready to go live

**Signed by:** ___________________

**Date:** ___________________

---

**🚀 Ready to launch? Follow DEPLOYMENT_GUIDE.md!**

