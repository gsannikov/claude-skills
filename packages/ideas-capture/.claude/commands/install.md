# Install Ideas Capture Skill

Set up the Ideas Capture skill for brainstorming and idea management.

## Setup Steps

1. **Create user data directory**:
   ```bash
   mkdir -p ~/MyDrive/claude-skills-data/ideas-capture/expanded
   ```

2. **Create initial database** at `~/MyDrive/claude-skills-data/ideas-capture/ideas.yaml`:
   ```yaml
   stats:
     total: 0
     by_type:
       patent: 0
       startup: 0
       business: 0
       project: 0
       other: 0
     by_tier:
       hot: 0
       warm: 0
       cold: 0

   ideas: []
   ```

3. **Create config** at `~/MyDrive/claude-skills-data/ideas-capture/config.yaml`:
   ```yaml
   scoring:
     weights:
       feasibility: 0.20
       impact: 0.25
       effort: 0.15
       uniqueness: 0.15
       timing: 0.15
       personal_fit: 0.10

     thresholds:
       hot: 7
       warm: 5

   expansion:
     auto_expand: true
     auto_score: true
   ```

4. **Create Apple Note** named "Ideas Inbox" for quick capture

5. **Configure MCP Filesystem** - Add to your Claude config:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/MyDrive/claude-skills-data/ideas-capture"]
       }
     }
   }
   ```

## Verification

After setup, test with:
- "Show ideas"
- "Process ideas"

## Idea Type Prefixes

Use these in your Apple Note for categorization:
- `[Patent]` or `[Startup]` or `[Business]` or `[Project]`
- Or just write the idea - AI will auto-classify

## Commands

| Command | Action |
|---------|--------|
| `process ideas` | Process from Apple Notes inbox |
| `show ideas` | List all by type |
| `show [type] ideas` | Filter by type |
| `expand: [idea]` | Generate detailed expansion |
| `evaluate: [idea]` | Score and analyze |
| `link ideas: [A] + [B]` | Connect related |

Installation complete! Jot ideas in Apple Notes and say "process ideas".
