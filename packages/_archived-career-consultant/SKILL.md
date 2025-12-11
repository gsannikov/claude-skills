---
name: israeli-tech-career-consultant
description: Automated Israeli tech job analysis system. Analyzes job opportunities with 6-component customizable scoring (Match, Income, Growth, LowPrep, Stress, Location). Uses local filesystem storage, automated company research, and multi-CV matching. Outputs markdown analyses and Excel tracking. Best for tech professionals in Israel's tech market. Triggers - "analyze job", "add to backlog", "process inbox", "show backlog", "job analysis", "career consultant", "score this job", "research company".
---

# Israeli Tech Career Consultant

AI-powered job analysis for the Israeli tech market with personalized 6-point scoring.

## Capabilities

| Feature | Description |
|---------|-------------|
| **Job Analysis** | 6-component scoring (Match, Income, Growth, LowPrep, Stress, Location) |
| **Backlog Mode** | Quick capture with "Add to backlog: [URL]" |
| **Company Research** | Automated via Firecrawl/Bright Data |
| **Multi-CV Matching** | Auto-selects best CV variant |
| **Excel Tracking** | Synced database with rankings |

## Quick Reference

### Commands

| Command | Action |
|---------|--------|
| `Analyze: [URL]` | Full job analysis |
| `Add to backlog: [URL]` | Quick save for later |
| `Process inbox` | Process Apple Notes inbox |
| `Show backlog` | List pending jobs |
| `Analyze job [id]` | Analyze from backlog |

### Scoring Components

| Component | Weight | Description |
|-----------|--------|-------------|
| Match | 35 | Skills alignment |
| Income | 25 | Salary vs requirements |
| Growth | 20 | Career advancement |
| LowPrep | 15 | Interview prep time |
| Stress | 10 | Work-life balance |
| Location | 5 | Commute + remote |

**Priority Thresholds**: First ≥70, Second ≥50, Third <50

## Workflow

### On First Load
1. Read `references/setup-guide.md` for configuration
2. Ask user for `user-data` path
3. Detect MCP servers (Filesystem required)
4. Run setup wizard if needed

### For Job Analysis
1. Read `references/analysis-workflow.md` for detailed steps
2. Follow 8-step process: Parse → Cache → Research → Match → Score → Save → Sync → Present

### Module Loading

Load modules on-demand from `modules/`:

| Module | When | Tokens |
|--------|------|--------|
| `job-backlog-manager.md` | Backlog commands | ~2K |
| `company-research.md` | New company | ~2K |
| `skills-matching.md` | Every analysis | ~3K |
| `scoring-formulas.md` | Every analysis | ~3K |
| `output-yaml-templates.md` | Saving results | ~2K |
| `database-operations-hybrid.md` | Excel sync | ~2K |
| `setup-wizard.md` | First-time setup | ~2K |

## Critical Rules

### Storage
- **Local filesystem ONLY** - Never use Notion/Google Drive
- User data via Filesystem MCP tools
- Skill modules via `file_read()`

### Token Budget
- Research new company: 15-20K → STOP, validate, restart
- Full analysis: 25-35K tokens
- Stop at 80% usage

### File Access
- Skill modules: `file_read("modules/...")`
- User data: `filesystem:read_text_file(path)`
- Never mix these methods

## References

| File | Content |
|------|---------|
| `references/setup-guide.md` | Storage, MCP setup, configuration |
| `references/analysis-workflow.md` | Detailed workflow steps |
| `references/star-*` | STAR interview framework |
| `references/database-operations-examples.md` | Excel sync examples |

## Helper Scripts

Located in `scripts/`:
- `config_loader.py` - Load settings.yaml
- `cv_matcher.py` - CV loading
- `yaml_utils.py` - YAML frontmatter
- `slug_utils.py` - ID normalization
- `token_estimator.py` - Usage tracking

---

**Version**: 1.1.0 | **Status**: Stable ✅
