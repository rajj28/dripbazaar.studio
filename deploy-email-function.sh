#!/bin/bash

# DRIP BAZAAR - Email Function Deployment Script
# This script deploys the Resend email function to Supabase

echo "🚀 DRIP BAZAAR Email Function Deployment"
echo "========================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI not found!"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "📝 Checking Supabase login status..."
if ! supabase projects list &> /dev/null
then
    echo "❌ Not logged in to Supabase"
    echo "Run: supabase login"
    exit 1
fi

echo "✅ Logged in to Supabase"
echo ""

# Link project
echo "🔗 Linking to project..."
supabase link --project-ref fdobfognqagtloyxmosg

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Ask for Resend API key
echo "🔑 Enter your Resend API key (starts with re_):"
read -r RESEND_KEY

if [ -z "$RESEND_KEY" ]; then
    echo "❌ API key cannot be empty"
    exit 1
fi

# Set secret
echo "📦 Setting Resend API key..."
supabase secrets set RESEND_API_KEY="$RESEND_KEY"

if [ $? -ne 0 ]; then
    echo "❌ Failed to set secret"
    exit 1
fi

echo "✅ Secret set successfully"
echo ""

# Deploy function
echo "🚀 Deploying send-email function..."
supabase functions deploy send-email

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy function"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📧 Email function is now live at:"
echo "https://fdobfognqagtloyxmosg.supabase.co/functions/v1/send-email"
echo ""
echo "🎯 Next steps:"
echo "1. Test the function in Supabase Dashboard"
echo "2. Create a test order on your site"
echo "3. Check your email for confirmation"
echo "4. Go to /admin to verify payments"
echo ""
echo "📚 For more info, see EMAIL_AND_ADMIN_SETUP.md"
