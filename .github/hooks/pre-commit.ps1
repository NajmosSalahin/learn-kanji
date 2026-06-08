# Pre-commit hook: Auto-generate commit message suggestion using commit-message-writer agent
# PowerShell version for Windows
# 
# This hook runs before commit and displays staged changes so you can generate
# a commit message using the commit-message-writer agent

Write-Host "=================================================="
Write-Host "📝 Staged Changes (for commit-message-writer)" -ForegroundColor Cyan
Write-Host "=================================================="

# Show staged files
Write-Host ""
Write-Host "📁 Modified Files:" -ForegroundColor Yellow
$stagedFiles = git diff --staged --name-only
if ($stagedFiles) {
    $stagedFiles | ForEach-Object { Write-Host "  - $_" }
}

Write-Host ""
Write-Host "📊 Diff Summary:" -ForegroundColor Yellow
git diff --staged --stat

Write-Host ""
Write-Host "🤖 To generate a commit message:" -ForegroundColor Green
Write-Host "   1. Open Copilot Chat in VS Code"
Write-Host "   2. Type: /commit-message-writer"
Write-Host "   3. Leave the input blank (it will auto-analyze staged changes)"
Write-Host ""
Write-Host "=================================================="

# Exit with 0 to allow commit to proceed
exit 0
