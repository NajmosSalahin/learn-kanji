# Git Hooks Setup Guide

This directory contains Git hooks to enhance your commit workflow with the **commit-message-writer** agent.

## Available Hooks

### `pre-commit`
- **Platform**: Git Bash (Linux/Mac/Windows with Git Bash)
- **Purpose**: Displays staged changes before commit and reminds you to use the commit-message-writer agent
- **Action**: Informational only—does not block commits

### `pre-commit.ps1`
- **Platform**: Windows PowerShell
- **Purpose**: Same as above, PowerShell version
- **Action**: Informational only—does not block commits

## Installation

### Option 1: Git Bash (Recommended)

1. Copy the `pre-commit` hook to your local Git hooks directory:
   ```bash
   cp .github/hooks/pre-commit .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

2. Test it by staging changes:
   ```bash
   git add .
   git commit -m "test"
   ```

### Option 2: Windows PowerShell

1. Open PowerShell in the repository root

2. Set up Git to use PowerShell for hooks:
   ```powershell
   git config core.hooksPath .github\hooks
   ```

3. Rename the hook to match Git's default:
   ```powershell
   Copy-Item .github\hooks\pre-commit.ps1 .git\hooks\pre-commit
   ```

4. Configure Git to recognize .ps1 hooks (if needed):
   ```powershell
   git config --global core.preloadext
   ```

## Workflow

1. **Make changes** to your code
2. **Stage changes**: `git add .` or use VS Code's Source Control UI
3. **Commit**: `git commit` or use VS Code's Source Control UI
4. **Hook runs**: Displays your staged changes
5. **Generate message**: 
   - Open Copilot Chat
   - Type: `/commit-message-writer`
   - Leave input blank (auto-analyzes staged changes)
6. **Copy and paste** the generated message into your commit

## Auto-Analysis Feature

The **commit-message-writer** agent can now automatically analyze your staged Git changes:

- If you invoke it **without input**, it will:
  - Run `git diff --staged` to get staged changes
  - Run `git status` to see modified files
  - Read affected files
  - Generate a commit message directly

- If you invoke it **with file paths or description**, it will use your input

## Disabling Hooks

If you want to skip the hook for a commit:
```bash
git commit --no-verify
```

## Troubleshooting

**Hook not running?**
- Verify the file is executable: `chmod +x .git/hooks/pre-commit`
- Check Git version: `git --version` (should be 2.9+)
- Confirm hook path: `git config core.hooksPath`

**Permission denied error?**
- Make the hook executable: `chmod +x .git/hooks/pre-commit`

**Using Windows and hook won't run?**
- Try the PowerShell version (pre-commit.ps1)
- Or install Git Bash and use the bash version
