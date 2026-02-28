@echo off
REM Deployment Script for DRIP RIWAAZ (Windows)
REM This script builds and deploys the application

echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the db directory.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Run build
echo 🔨 Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors and try again.
    exit /b 1
)

echo ✅ Build successful!

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% equ 0 (
    echo 🌐 Deploying to Vercel...
    set /p deploy="Deploy to production? (y/n): "
    if /i "%deploy%"=="y" (
        call vercel --prod
        echo ✅ Deployment complete!
    ) else (
        echo 📝 Running preview deployment...
        call vercel
    )
) else (
    echo ⚠️  Vercel CLI not found.
    echo 📁 Build files are in the 'dist' folder.
    echo.
    echo To deploy:
    echo 1. Install Vercel CLI: npm install -g vercel
    echo 2. Run: vercel --prod
    echo.
    echo Or upload the 'dist' folder to your hosting provider.
)

echo.
echo 🎉 Done!
pause
