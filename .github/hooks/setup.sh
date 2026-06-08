#!/bin/bash
# Quick setup script for Git hooks
# Run this once to install commit hooks

echo "🔧 Setting up Git hooks..."

# Copy the pre-commit hook
cp .github/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks installed successfully!"
echo ""
echo "📝 Usage:"
echo "  1. Stage your changes: git add ."
echo "  2. Run: git commit"
echo "  3. The hook will show your staged changes"
echo "  4. Open Copilot Chat and run: /commit-message-writer"
echo "  5. Leave input blank to auto-analyze your changes"
echo ""
echo "ℹ️  For more info, see .github/hooks/README.md"
