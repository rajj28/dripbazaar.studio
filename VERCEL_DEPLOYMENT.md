# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)

## Step 1: Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: E-commerce website with 3D features"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration
5. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
6. Click "Deploy"

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## Build Configuration

The project is configured with:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Framework: Vite

## Asset Handling

All assets in `/public` folder are automatically served by Vercel:
- 3D models in `/public/models/`
- Images in `/public/images/`
- Videos and other media files

## Troubleshooting

### Build fails with TypeScript errors
- Check `tsconfig.json` settings
- Run `npm run build` locally first

### Assets not loading
- Ensure assets are in `/public` folder
- Use relative paths: `/images/file.jpg` not `./images/file.jpg`

### Environment variables not working
- Prefix all variables with `VITE_`
- Redeploy after adding variables

## Post-Deployment

1. Test all pages and features
2. Verify 3D models load correctly
3. Test payment integration
4. Check mobile responsiveness
5. Update Supabase allowed domains with your Vercel URL
