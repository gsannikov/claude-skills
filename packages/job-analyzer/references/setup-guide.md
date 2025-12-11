# Setup Guide

## Storage Configuration

**DO NOT USE NOTION** - This skill uses **LOCAL FILESYSTEM ONLY**.

### User Data Location
- Configured in `skill-package/config/paths.py`
- Default: `/Users/<username>/Documents/career-consultant/user-data/`
- Database Files: YAML files in `user-data/companies/` and `user-data/jobs/`
- Configuration: `user-data/profile/settings.yaml`

### MCP Tools Required
- ✅ `filesystem:read_text_file` - Read user files
- ✅ `filesystem:write_file` - Write user files
- ✅ `filesystem:list_directory` - List directories
- ✅ `filesystem:create_directory` - Create directories
- ✅ `filesystem:edit_file` - Edit files
- ✅ `filesystem:search_files` - Search files

### File Path Rules

**Skill Modules** (embedded with skill):
- Location: `/mnt/skills/user/israeli-tech-career-consultant/`
- Access: `file_read("modules/module-name.md")`
- Never use filesystem tools for skill modules

**User Data** (user's filesystem):
- Location: User's filesystem (e.g., `~/Documents/career-consultant`)
- Access: `filesystem:read_text_file` with absolute paths from `paths.py`

## First-Time Setup

When user first loads skill, respond with capabilities intro and ask for user-data path:

1. Show capabilities (6-component scoring, backlog mode, etc.)
2. Ask: existing user-data path OR create new?
3. Verify path with `filesystem:list_directory`
4. Check for required subdirectories
5. Run setup wizard if needed

### MCP Server Detection

Check required servers before proceeding:

| Server | Required | Purpose |
|--------|----------|---------|
| Filesystem MCP | ✅ Yes | Local file access |
| Firecrawl MCP | No | Web scraping |
| Bright Data MCP | No | LinkedIn scraping |
| Docker MCP | No | LinkedIn fallback |

If Filesystem MCP missing → STOP and show installation guide.

### Token Budget Protection

**FORBIDDEN:**
- ❌ `directory_tree` on allowed directory roots
- ❌ Recursive operations on large directories
- ❌ Search entire filesystem for skill files

**REQUIRED:**
1. Use `list_allowed_directories` first
2. Navigate incrementally with `list_directory`
3. Budget check after each major step

**Checkpoints:**
- After init: >10% used → Warning
- After research: >50% used → Stop, recommend new conversation
- Before continuing: >80% used → STOP

## Directory Structure

```
user-data/
├── profile/
│   ├── settings.yaml         # Main configuration
│   ├── cvs/                   # CV variants
│   ├── candidate.md           # Candidate profile
│   └── salary-requirements.md
├── companies/                 # Company profiles
├── jobs/
│   ├── backlog.yaml           # Master job list
│   ├── inbox.yaml             # Quick capture
│   ├── config.yaml
│   └── analyzed/              # Full analyses
├── interviews/
└── reports/
    ├── companies-db.html
    └── companies-db.xlsx
```

## Configuration via settings.yaml

```yaml
cv_variants:
  variants:
    - id: "em"
      filename: "cv-engineering-manager.md"
      focus: "Engineering Management"
      weight: 1.0

scoring:
  weights:
    match: 35
    income: 25
    growth: 20
    lowprep: 15
    stress: 10
    location: 5
  thresholds:
    first_priority: 70
    second_priority: 50
  bonuses:
    intel_experience: 3

preferences:
  min_salary_annual: 450000
  target_salary_annual: 550000
  preferred_locations: ["Haifa", "Remote"]
```
