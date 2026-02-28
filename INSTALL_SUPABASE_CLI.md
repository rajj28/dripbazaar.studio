# Install Supabase CLI on Windows

## ⚠️ Important: npm install -g supabase does NOT work!

Supabase CLI cannot be installed via npm. Use one of these methods:

---

## ✅ Method 1: Direct Download (Easiest - 2 minutes)

### Step 1: Download
1. Go to: https://github.com/supabase/cli/releases/latest
2. Download: `supabase_windows_amd64.zip`
3. Extract the zip file

### Step 2: Install
1. Create folder: `C:\Program Files\Supabase`
2. Move `supabase.exe` to that folder
3. Add to PATH:
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit" → "New"
   - Add: `C:\Program Files\Supabase`
   - Click OK on all windows

### Step 3: Verify
Open NEW PowerShell window and run:
```powershell
supabase --version
```

---

## ✅ Method 2: Using Scoop (Recommended)

### Step 1: Install Scoop (if not installed)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

### Step 2: Install Supabase CLI
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 3: Verify
```powershell
supabase --version
```

---

## ✅ Method 3: Using Chocolatey

If you have Chocolatey installed:
```powershell
choco install supabase
```

---

## After Installation

Once installed, run these commands:

```powershell
# Login to Supabase
supabase login

# Link your project
cd C:\Users\Acer\db
supabase link --project-ref fdobfognqagtloyxmosg

# Set Resend API key (get from https://resend.com)
supabase secrets set RESEND_API_KEY=re_your_key_here

# Deploy email function
supabase functions deploy send-email
```

---

## Quick Install Script (Method 1)

Save this as `install-supabase.ps1` and run:

```powershell
# Download latest release
$url = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.zip"
$output = "$env:TEMP\supabase.zip"
$extractPath = "$env:TEMP\supabase"

Write-Host "Downloading Supabase CLI..."
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Extracting..."
Expand-Archive -Path $output -DestinationPath $extractPath -Force

Write-Host "Installing to C:\Program Files\Supabase..."
$installPath = "C:\Program Files\Supabase"
New-Item -ItemType Directory -Force -Path $installPath
Copy-Item "$extractPath\supabase.exe" -Destination $installPath -Force

Write-Host "Adding to PATH..."
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($currentPath -notlike "*$installPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installPath", "Machine")
}

Write-Host "Cleaning up..."
Remove-Item $output -Force
Remove-Item $extractPath -Recurse -Force

Write-Host ""
Write-Host "✅ Installation complete!"
Write-Host "Please restart your terminal and run: supabase --version"
```

---

## Troubleshooting

### "supabase is not recognized"
- Make sure you opened a NEW terminal after installation
- Verify PATH was added correctly
- Try running: `$env:Path` to see if Supabase folder is listed

### Permission denied
- Run PowerShell as Administrator
- Or use Method 1 and manually add to PATH

### Still not working?
Use the Supabase Dashboard instead:
1. Go to: https://supabase.com/dashboard/project/fdobfognqagtloyxmosg
2. Click "Edge Functions" in sidebar
3. Click "Deploy new function"
4. Upload the `send-email` folder
5. Set secrets in "Settings" → "Edge Functions" → "Secrets"

---

## Need Help?

Check official docs: https://supabase.com/docs/guides/cli/getting-started
