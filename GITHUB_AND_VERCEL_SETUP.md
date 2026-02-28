# GitHub & Vercel Deployment - Quick Start

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ Initial commit created
- ✅ Build tested successfully (npm run build works!)
- ✅ .gitignore configured (excludes .env, node_modules, etc.)
- ✅ vercel.json created with proper configuration
- ✅ All assets in /public folder ready for deployment

## 🚀 Next Steps

### 1. Create GitHub Repository

Go to https://github.com/new and create a new repository, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the Vite configuration
5. Add these environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```
6. Click "Deploy"

#### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🔧 Build Configuration

Your project is configured with:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite (auto-detected)

## 📦 Assets

All your assets are properly configured:
- 3D models in `/public/models/`
- Images in `/public/images/`
- Video files in `/public/`
- Frame sequences in `/public/frames/`

Vercel will automatically serve these from the CDN.

## ⚠️ Important Notes

1. **Environment Variables**: Make sure to add all VITE_ prefixed variables in Vercel dashboard
2. **Supabase URLs**: After deployment, add your Vercel domain to Supabase allowed domains
3. **Razorpay**: Update Razorpay dashboard with your production domain
4. **Large Files**: Some 3D models are large - Vercel handles them fine, but consider optimizing if needed

## 🧪 Testing After Deployment

1. Test all pages load correctly
2. Verify 3D models render
3. Test payment flow (use Razorpay test mode first)
4. Check mobile responsiveness
5. Test cart and checkout functionality

## 📝 Current Git Status

```
Repository: Initialized ✅
Commits: 2 commits ready to push
Branch: master (will be renamed to main when pushing)
Remote: Not yet configured (add GitHub remote)
```

## 🆘 Troubleshooting

### Build fails on Vercel
- Check environment variables are set
- Verify all dependencies are in package.json
- Check build logs for specific errors

### Assets not loading
- Ensure paths use `/` prefix: `/images/file.jpg`
- Check browser console for 404 errors
- Verify files are in /public folder

### Environment variables not working
- Must be prefixed with `VITE_`
- Redeploy after adding variables
- Check they're set in Vercel dashboard

## 📞 Need Help?

Check these files:
- `VERCEL_DEPLOYMENT.md` - Detailed deployment guide
- `DEPLOYMENT_GUIDE.md` - General deployment info
- `PRE_DEPLOYMENT_CHECKLIST.md` - Pre-launch checklist
