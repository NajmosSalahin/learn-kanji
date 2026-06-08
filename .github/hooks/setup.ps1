# Quick setup script for Git hooks (PowerShell version)
# Run this once to install commit hooks

Write-Host "🔧 Setting up Git hooks..." -ForegroundColor Cyan

# Copy the pre-commit hook
$hookSource = ".github\hooks\pre-commit.ps1"
$hookDest = ".git\hooks\pre-commit"

if (Test-Path $hookSource) {
    Copy-Item $hookSource $hookDest -Force
    Write-Host "✅ Git hooks installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Usage:" -ForegroundColor Yellow
    Write-Host "  1. Stage your changes: git add ."
    Write-Host "  2. Run: git commit"
    Write-Host "  3. The hook will show your staged changes"
    Write-Host "  4. Open Copilot Chat and run: /commit-message-writer"
    Write-Host "  5. Leave input blank to auto-analyze your changes"
    Write-Host ""
    Write-Host "ℹ️  For more info, see .github\hooks\README.md" -ForegroundColor Cyan
} else {
    Write-Host "❌ Hook file not found: $hookSource" -ForegroundColor Red
}
