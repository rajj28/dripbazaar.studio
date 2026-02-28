# Supabase Domain Configuration Fix

## Problem
Getting "Network Failed" error when trying to complete transactions on production domain.

## Solution

### Step 1: Configure Supabase Site URL

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Find **Site URL** section
5. Set to: `https://dripbazaar.studio`
6. Click **Save**

### Step 2: Add Redirect URLs

In the same **Settings** → **API** page:

1. Find **Redirect URLs** section
2. Add these URLs (one per line):
   ```
   https://dripbazaar.studio
   https://dripbazaar.studio/*
   https://dripbazaar.studio/auth/callback
   http://localhost:5174
   http://localhost:5174/*
   ```
3. Click **Save**

### Step 3: Verify Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify these exist:
   - `VITE_SUPABASE_URL` = `https://YOUR_PROJECT.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
   - `VITE_RAZORPAY_KEY_ID` = `your-razorpay-key`

### Step 4: Redeploy

After making changes:
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Click **Redeploy** button
4. Wait for deployment to complete

### Step 5: Test

1. Visit `https://dripbazaar.studio`
2. Add items to cart
3. Go through checkout
4. Try completing a transaction
5. Should work now! ✅

## Common Issues

### Issue: Still getting network error
**Solution**: Clear browser cache and cookies, then try again

### Issue: CORS error in console
**Solution**: Make sure you added the domain to Supabase redirect URLs

### Issue: Environment variables not working
**Solution**: 
1. Check if variables are set for "Production" environment in Vercel
2. Redeploy after adding/changing variables

## Verification

To verify Supabase is configured correctly:

1. Open browser console (F12)
2. Go to Network tab
3. Try to complete a transaction
4. Look for requests to `*.supabase.co`
5. Check if they return 200 OK (not 403 or CORS errors)

## Need Help?

If still having issues:
1. Check Supabase logs: Dashboard → Logs
2. Check Vercel logs: Dashboard → Deployments → View Function Logs
3. Check browser console for specific error messages
