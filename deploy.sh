#!/bin/bash

# Deployment Script for DRIP RIWAAZ
# This script builds and deploys the application

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the db directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    read -p "Deploy to production? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel --prod
        echo "✅ Deployment complete!"
    else
        echo "📝 Running preview deployment..."
        vercel
    fi
else
    echo "⚠️  Vercel CLI not found."
    echo "📁 Build files are in the 'dist' folder."
    echo ""
    echo "To deploy:"
    echo "1. Install Vercel CLI: npm install -g vercel"
    echo "2. Run: vercel --prod"
    echo ""
    echo "Or upload the 'dist' folder to your hosting provider."
fi

echo ""
echo "🎉 Done!"
