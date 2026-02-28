@echo off
REM DRIP BAZAAR - Email Function Deployment Script (Windows)
REM This script deploys the Resend email function to Supabase

echo.
echo ========================================
echo DRIP BAZAAR Email Function Deployment
echo ========================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Supabase CLI not found!
    echo Install it with: npm install -g supabase
    pause
    exit /b 1
)

echo [OK] Supabase CLI found
echo.

REM Check if logged in
echo Checking Supabase login status...
supabase projects list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Not logged in to Supabase
    echo Run: supabase login
    pause
    exit /b 1
)

echo [OK] Logged in to Supabase
echo.

REM Link project
echo Linking to project...
supabase link --project-ref fdobfognqagtloyxmosg

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to link project
    pause
    exit /b 1
)

echo [OK] Project linked
echo.

REM Ask for Resend API key
set /p RESEND_KEY="Enter your Resend API key (starts with re_): "

if "%RESEND_KEY%"=="" (
    echo [ERROR] API key cannot be empty
    pause
    exit /b 1
)

REM Set secret
echo Setting Resend API key...
supabase secrets set RESEND_API_KEY=%RESEND_KEY%

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to set secret
    pause
    exit /b 1
)

echo [OK] Secret set successfully
echo.

REM Deploy function
echo Deploying send-email function...
supabase functions deploy send-email

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to deploy function
    pause
    exit /b 1
)

echo.
echo ========================================
echo [SUCCESS] Deployment complete!
echo ========================================
echo.
echo Email function is now live at:
echo https://fdobfognqagtloyxmosg.supabase.co/functions/v1/send-email
echo.
echo Next steps:
echo 1. Test the function in Supabase Dashboard
echo 2. Create a test order on your site
echo 3. Check your email for confirmation
echo 4. Go to /admin to verify payments
echo.
echo For more info, see EMAIL_AND_ADMIN_SETUP.md
echo.
pause
