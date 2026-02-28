# Supabase CLI Installation Script for Windows
# Run this script as Administrator

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Supabase CLI Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script needs to run as Administrator" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

try {
    # Download latest release
    Write-Host "📥 Downloading Supabase CLI..." -ForegroundColor Green
    $url = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.zip"
    $output = "$env:TEMP\supabase.zip"
    $extractPath = "$env:TEMP\supabase"

    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    Write-Host "✅ Downloaded successfully" -ForegroundColor Green
    Write-Host ""

    # Extract
    Write-Host "📦 Extracting files..." -ForegroundColor Green
    if (Test-Path $extractPath) {
        Remove-Item $extractPath -Recurse -Force
    }
    Expand-Archive -Path $output -DestinationPath $extractPath -Force
    Write-Host "✅ Extracted successfully" -ForegroundColor Green
    Write-Host ""

    # Install
    Write-Host "💾 Installing to C:\Program Files\Supabase..." -ForegroundColor Green
    $installPath = "C:\Program Files\Supabase"
    if (-not (Test-Path $installPath)) {
        New-Item -ItemType Directory -Force -Path $installPath | Out-Null
    }
    Copy-Item "$extractPath\supabase.exe" -Destination $installPath -Force
    Write-Host "✅ Installed successfully" -ForegroundColor Green
    Write-Host ""

    # Add to PATH
    Write-Host "🔧 Adding to system PATH..." -ForegroundColor Green
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$installPath*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installPath", "Machine")
        Write-Host "✅ Added to PATH" -ForegroundColor Green
    } else {
        Write-Host "✅ Already in PATH" -ForegroundColor Green
    }
    Write-Host ""

    # Cleanup
    Write-Host "🧹 Cleaning up temporary files..." -ForegroundColor Green
    Remove-Item $output -Force -ErrorAction SilentlyContinue
    Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
    Write-Host ""

    # Success message
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Close this window" -ForegroundColor White
    Write-Host "2. Open a NEW PowerShell window" -ForegroundColor White
    Write-Host "3. Run: supabase --version" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then follow the deployment steps in README_ADMIN.md" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "❌ Installation failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try manual installation:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://github.com/supabase/cli/releases/latest" -ForegroundColor White
    Write-Host "2. Extract supabase.exe" -ForegroundColor White
    Write-Host "3. Move to C:\Program Files\Supabase\" -ForegroundColor White
    Write-Host "4. Add to PATH manually" -ForegroundColor White
    Write-Host ""
}

pause
