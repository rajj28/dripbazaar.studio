# Deployment Steps to Production

## 🚀 Pre-Deployment Checklist

### 1. Database Setup (CRITICAL - Do First!)

Run these SQL scripts in your **Production Supabase** dashboard:

#### A. Profile Trigger (if not already done)
```sql
-- File: add-profile-trigger.sql
-- This creates profiles automatically when users sign up
```

#### B. Address Fields
```sql
-- File: add-address-to-profiles.sql
-- This adds address management to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS default_address_id TEXT;

CREATE INDEX IF NOT EXISTS profiles_addresses_idx ON profiles USING GIN (addresses);
```

### 2. Environment Variables

Verify your `.env` file has production values:
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 3. Build the Project

```bash
cd db
npm run build
```

### 4. Test Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` and test:
- [ ] Profile dropdown works
- [ ] Sign in/Sign out works
- [ ] Profile page loads
- [ ] Address management works
- [ ] Orders page loads
- [ ] Mobile responsive works

## 📦 Deployment Options

### Option 1: Vercel (Recommended)

#### First Time Setup:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd db
vercel
```

#### Subsequent Deployments:
```bash
cd db
vercel --prod
```

#### Configure Environment Variables in Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd db
netlify deploy --prod
```

### Option 3: GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/your-repo",

# Build
npm run build

# Deploy using gh-pages
npm install -g gh-pages
gh-pages -d dist
```

### Option 4: Manual Deployment

1. Build the project:
```bash
cd db
npm run build
```

2. Upload the `dist` folder to your hosting provider:
   - AWS S3 + CloudFront
   - DigitalOcean Spaces
   - Any static hosting service

## 🔧 Post-Deployment Steps

### 1. Verify Database Migrations

In Production Supabase SQL Editor:

```sql
-- Check if profiles table has address columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('addresses', 'default_address_id');

-- Check if trigger exists
SELECT tgname 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

### 2. Test Production Site

Visit your production URL and test:

#### Authentication:
- [ ] Sign up new user
- [ ] Check if profile created in database
- [ ] Sign in with existing user
- [ ] Sign out

#### Profile Features:
- [ ] Profile dropdown appears
- [ ] Navigate to Profile page
- [ ] Add new address
- [ ] Edit address
- [ ] Delete address
- [ ] Set default address

#### Orders:
- [ ] Navigate to Orders page
- [ ] Place a test order
- [ ] Verify order appears in Orders page

#### Mobile:
- [ ] Test on mobile device
- [ ] Profile menu works
- [ ] Address form is responsive
- [ ] Orders page is responsive

### 3. Monitor for Errors

Check browser console and Supabase logs for any errors.

## 🐛 Troubleshooting

### Profile not created on signup
- Check if trigger exists in production database
- Run `add-profile-trigger.sql` again
- Check Supabase logs for errors

### Addresses not saving
- Verify `addresses` column exists
- Check RLS policies on profiles table
- Verify user is authenticated

### Orders not showing
- Check if orders table has user_id
- Verify RLS policies allow users to read their orders
- Check browser console for errors

### Environment variables not working
- Rebuild after changing .env
- Verify variables are set in hosting platform
- Check variable names start with `VITE_`

## 📊 Monitoring

After deployment, monitor:

1. **Supabase Dashboard:**
   - Database usage
   - API requests
   - Error logs

2. **Hosting Platform:**
   - Build logs
   - Deployment status
   - Traffic analytics

3. **Browser Console:**
   - JavaScript errors
   - Network requests
   - Performance metrics

## 🔄 Rollback Plan

If something goes wrong:

### Vercel:
```bash
vercel rollback
```

### Netlify:
Go to Deploys → Click on previous deployment → Publish

### Manual:
Keep a backup of the previous `dist` folder and re-upload it.

## 📝 Git Workflow

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add profile management, address management, and orders page

- Added profile dropdown with sign in/out
- Implemented address management in profile
- Created orders page to display user orders
- Added JWT session persistence
- Made all features mobile responsive"

# Push to main branch
git push origin main
```

## ✅ Deployment Complete!

Once deployed, your production site will have:
- ✅ Profile dropdown with authentication
- ✅ Address management
- ✅ Orders tracking
- ✅ JWT session persistence
- ✅ Fully responsive mobile design
- ✅ DRIP RIWAAZ section optimized

## 🎉 Next Steps

1. Share the production URL with your team
2. Test with real users
3. Monitor analytics and user feedback
4. Plan next features

---

**Need Help?**
- Check Supabase logs for database errors
- Check browser console for frontend errors
- Review deployment logs in your hosting platform
