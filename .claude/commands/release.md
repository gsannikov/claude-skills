# Release Command

Triggers the **Cloud Release Workflow** via GitHub Actions.

## Arguments

- `skill`: The name of the skill to release (e.g. `career-consultant`, `reading-list`) or `all`.
- `bump`: The version bump type (`patch`, `minor`, `major`). Default: `patch`.

## Step 1: Confirm Status

Ensure we are on the main branch and up to date, as the workflow runs from `main`.

```bash
git checkout main
git pull
```

## Step 2: Trigger Release

Run the workflow using GitHub CLI.

```bash
# Verify gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) could not be found. Please install it."
    exit 1
fi

# Parse arguments or prompt
SKILL="${1:-}"
if [ -z "$SKILL" ]; then
    echo "⚠️  No skill specified."
    echo "Available skills: career-consultant, reading-list, ideas-capture, voice-memos, local-rag, all"
    read -p "Enter skill to release: " SKILL
fi

BUMP="${2:-patch}"

echo "🚀 Triggering release for $SKILL ($BUMP)..."

gh workflow run release.yml -f skill="$SKILL" -f bump="$BUMP"

if [ $? -eq 0 ]; then
    echo "✅ Workflow triggered successfully!"
    echo "Monitor progress here:"
    gh run list --workflow=release.yml --limit 1
else
    echo "❌ Failed to trigger workflow."
fi
```
