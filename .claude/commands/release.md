# Release Command

Triggers the **Cloud Release Workflow** via GitHub Actions.

## Arguments

- `skill`: The name of the skill to release (see list below) or `all`.
- `bump`: The version bump type (`patch`, `minor`, `major`). Default: `patch`.

## Available Skills (9)

| Skill | Package | Description |
|-------|---------|-------------|
| `job-analyzer` | packages/job-analyzer | Job scoring, tracking, contacts |
| `interview-prep` | packages/interview-prep | STAR stories, negotiation |
| `reading-list` | packages/reading-list | Article capture & summaries |
| `ideas-capture` | packages/ideas-capture | Idea expansion & scoring |
| `voice-memos` | packages/voice-memos | Transcription & analysis |
| `local-rag` | packages/local-rag | Semantic document search |
| `social-media-post` | packages/social-media-post | Platform-optimized posts |
| `recipe-manager` | packages/recipe-manager | Recipe extraction |
| `setup-manager` | packages/setup-manager | Environment setup |

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
    echo ""
    echo "Available skills:"
    echo "  job-analyzer, interview-prep, reading-list, ideas-capture,"
    echo "  voice-memos, local-rag, social-media-post, recipe-manager,"
    echo "  setup-manager, all"
    echo ""
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

## Usage Examples

```bash
# Release single skill
/release job-analyzer patch

# Major version bump
/release interview-prep major

# Release all skills
/release all patch
```
