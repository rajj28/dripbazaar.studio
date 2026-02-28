# 📧 Email Setup - Simple Guide

## Step 1: Install Supabase CLI (5 minutes)

### Option A: Automatic (Easiest)
1. Right-click `install-supabase-cli.ps1`
2. Select "Run with PowerShell"
3. If it asks, click "Run anyway"
4. Wait for installation
5. Close and open NEW PowerShell

### Option B: Manual Download
1. Go to: https://github.com/supabase/cli/releases/latest
2. Download: `supabase_windows_amd64.zip`
3. Extract it
4. Move `supabase.exe` to: `C:\Program Files\Supabase\`
5. Add to PATH:
   - Win + X → System → Advanced → Environment Variables
   - Edit "Path" → New → Add: `C:\Program Files\Supabase`
   - OK all windows
6. Open NEW PowerShell

### Verify Installation:
```powershell
supabase --version
```
Should show version number (e.g., 1.x.x)

---

## Step 2: Get Resend API Key (2 minutes)

1. Go to: https://resend.com
2. Click "Sign Up" (it's FREE)
3. Verify your email
4. Go to: https://resend.com/api-keys
5. Click "Create API Key"
6. Name it: "DRIP BAZAAR"
7. Copy the key (starts with `re_`)
8. Save it somewhere safe!

---

## Step 3: Deploy Email Function (3 minutes)

Open PowerShell in your project folder:

```powershell
# Go to project folder
cd C:\Users\Acer\db

# Login to Supabase
supabase login
# Browser will open - login with your Supabase account

# Link to your project
supabase link --project-ref fdobfognqagtloyxmosg

# Set your Resend API key (replace with your actual key)
supabase secrets set RESEND_API_KEY=re_your_actual_key_here

# Deploy the email function
supabase functions deploy send-email
```

---

## Step 4: Test It! (2 minutes)

### Test in Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/fdobfognqagtloyxmosg
2. Click "Edge Functions" in sidebar
3. Click "send-email"
4. Click "Invoke function"
5. Paste this test:
```json
{
  "type": "order_confirmation",
  "orderId": "test-123",
  "userEmail": "your-email@example.com"
}
```
6. Click "Invoke"
7. Check your email!

### Test on Your Site:
1. Go to: http://localhost:5174
2. Click "PRE-BOOK NOW" on any drop
3. Login/signup
4. Fill the form and submit
5. Check your email for confirmation!

---

## ✅ Done!

Now emails will be sent automatically:
- ✉️ When customer pre-books
- ✉️ When customer submits payment
- ✉️ When you verify payment in admin dashboard

---

## 🆘 Troubleshooting

### "supabase is not recognized"
- Did you open a NEW PowerShell after installation?
- Check if `C:\Program Files\Supabase` is in PATH
- Try restarting your computer

### "Failed to link project"
- Make sure you ran `supabase login` first
- Check your internet connection
- Try: `supabase projects list` to see if you're logged in

### "Failed to deploy function"
- Make sure you set the Resend API key first
- Check: `supabase secrets list`
- Try deploying again

### Emails not sending?
- Check Resend dashboard for errors
- Verify API key is correct
- Check Supabase function logs:
  ```powershell
  supabase functions logs send-email
  ```

### Still stuck?
Use Supabase Dashboard instead:
1. Go to your project dashboard
2. Edge Functions → Deploy new function
3. Upload the `supabase/functions/send-email` folder
4. Set secrets in Settings → Edge Functions

---

## 📚 More Help

- Full guide: `EMAIL_AND_ADMIN_SETUP.md`
- CLI installation: `INSTALL_SUPABASE_CLI.md`
- Admin dashboard: `README_ADMIN.md`

---

**That's it! You're ready to send professional emails to your customers! 🎉**
