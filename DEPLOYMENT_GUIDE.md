# 🚀 Deployment Guide - dripbazaar.studio

## Complete guide to deploy DRIP BAZAAR live with custom domain

---

## Part 1: Buy Domain (5 minutes)

### Recommended Registrars:
1. **Namecheap** - https://www.namecheap.com (Cheapest, ~$10/year)
2. **GoDaddy** - https://www.godaddy.com
3. **Google Domains** - https://domains.google

### Steps:
1. Search for: `dripbazaar.studio`
2. Add to cart
3. Complete purchase
4. You'll get domain management access

**Don't configure DNS yet - we'll do that after deployment!**

---

## Part 2: Deploy to Vercel (10 minutes)

### Why Vercel?
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy custom domain setup
- ✅ Automatic deployments from Git

### Step 1: Push Code to GitHub

#### Create GitHub Repository:
1. Go to: https://github.com/new
2. Repository name: `drip-bazaar`
3. Make it Private
4. Click "Create repository"

#### Push Your Code:
```bash
cd C:\Users\Acer\db

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - DRIP BAZAAR"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/drip-bazaar.git

# Push
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Sign up for Vercel:**
   - Go to: https://vercel.com/signup
   - Sign up with GitHub (easiest)

2. **Import Project:**
   - Click "Add New" → "Project"
   - Select your `drip-bazaar` repository
   - Click "Import"

3. **Configure Build Settings:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL=https://fdobfognqagtloyxmosg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkb2Jmb2ducWFndGxveXhtb3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDU0MTQsImV4cCI6MjA4Nzc4MTQxNH0.bJE1qI0dEFL7lf7aRSjvvfxsHPa5kmh775BMTMtl12c
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `drip-bazaar.vercel.app`

---

## Part 3: Connect Custom Domain (5 minutes)

### In Vercel Dashboard:

1. Go to your project → Settings → Domains
2. Click "Add Domain"
3. Enter: `dripbazaar.studio`
4. Click "Add"

Vercel will show you DNS records to add.

### In Your Domain Registrar (Namecheap/GoDaddy):

1. Go to Domain Management → DNS Settings
2. Add these records (Vercel will show exact values):

**For Root Domain (dripbazaar.studio):**
```
Type: A
Host: @
Value: 76.76.21.21
TTL: Automatic
```

**For WWW (www.dripbazaar.studio):**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

3. Save DNS settings
4. Wait 5-30 minutes for DNS propagation

### Verify:
- Go to: https://dripbazaar.studio
- Should show your site with HTTPS! 🎉

---

## Part 4: Update Supabase Settings (2 minutes)

### Add Domain to Supabase:

1. Go to: https://supabase.com/dashboard/project/fdobfognqagtloyxmosg/settings/auth
2. Scroll to "Site URL"
3. Change from `http://localhost:5174` to `https://dripbazaar.studio`
4. Scroll to "Redirect URLs"
5. Add:
   ```
   https://dripbazaar.studio
   https://dripbazaar.studio/**
   https://www.dripbazaar.studio
   https://www.dripbazaar.studio/**
   ```
6. Click "Save"

---

## Part 5: Update Resend Email Domain (Optional but Recommended)

### Add Custom Domain to Resend:

1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter: `dripbazaar.studio`
4. Add DNS records shown (in your domain registrar)
5. Wait for verification

### Update Email Function:
In Supabase Dashboard → Edge Functions → send-email:
- Change `from: 'DRIP BAZAAR <orders@dripbazaar.com>'`
- To: `from: 'DRIP BAZAAR <orders@dripbazaar.studio>'`

---

## Part 6: Test Everything (5 minutes)

### Test Checklist:

1. **Website Loads:**
   - ✅ https://dripbazaar.studio loads
   - ✅ HTTPS (padlock icon) is working
   - ✅ All images load
   - ✅ 3D models work

2. **Authentication:**
   - ✅ Sign up works
   - ✅ Login works
   - ✅ Email verification works

3. **Pre-Booking:**
   - ✅ Click "PRE-BOOK NOW"
   - ✅ Fill form and submit
   - ✅ Receive order confirmation email

4. **Payment:**
   - ✅ Upload payment screenshot
   - ✅ Receive payment received email

5. **Admin Dashboard:**
   - ✅ Go to https://dripbazaar.studio/admin
   - ✅ Login
   - ✅ See orders
   - ✅ Verify payment
   - ✅ Customer receives verification email

---

## Part 7: Automatic Deployments

### Every time you make changes:

```bash
cd C:\Users\Acer\db

# Make your changes, then:
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys! (takes 2-3 minutes)
```

---

## Alternative: Deploy to Netlify

If you prefer Netlify over Vercel:

1. Go to: https://app.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables (same as Vercel)
7. Deploy
8. Add custom domain in Site settings → Domain management

---

## Costs Breakdown

### Free:
- ✅ Vercel hosting (Free forever)
- ✅ Supabase (Free tier: 500MB database, 1GB file storage)
- ✅ Resend emails (Free: 3,000 emails/month)

### Paid:
- 💰 Domain: ~$10-15/year (dripbazaar.studio)
- 💰 Supabase Pro (optional): $25/month (if you need more)
- 💰 Resend Pro (optional): $20/month (if you need more emails)

**Total to start: ~$10-15/year** (just the domain!)

---

## Troubleshooting

### Site not loading after DNS change:
- Wait 30 minutes for DNS propagation
- Clear browser cache (Ctrl + Shift + Delete)
- Try incognito mode
- Check DNS: https://dnschecker.org

### Build fails on Vercel:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Emails not sending:
- Check Resend dashboard for errors
- Verify Edge Function is deployed
- Check Supabase function logs

### Admin dashboard not accessible:
- Ensure you're logged in
- Check browser console for errors
- Verify Supabase connection

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Add admin role check (see EMAIL_AND_ADMIN_SETUP.md)
- [ ] Enable Supabase RLS policies (already done ✅)
- [ ] Add rate limiting (optional)
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Add Google Analytics (optional)
- [ ] Test payment flow thoroughly
- [ ] Backup database regularly

---

## Post-Launch

### Monitor:
- Vercel Analytics (free)
- Supabase Dashboard (database usage)
- Resend Dashboard (email delivery)

### Backup:
- Database: Supabase auto-backups (Pro plan)
- Code: GitHub (already backed up)
- Images: Keep local copies

### Updates:
- Push to GitHub → Auto-deploys to Vercel
- No downtime!

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Resend Docs: https://resend.com/docs

---

**You're ready to go live! 🚀**

Total time: ~30 minutes
Total cost: ~$10-15/year
