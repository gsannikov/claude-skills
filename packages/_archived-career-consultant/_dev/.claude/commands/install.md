# Install Career Consultant Skill

Set up the Israeli Tech Career Consultant skill for automated job analysis.

## Setup Steps

1. **Create user data directory**:
   ```bash
   mkdir -p ~/MyDrive/claude-skills-data/career-consultant/{profile,companies,jobs/analyzed,interviews,reports}
   mkdir -p ~/MyDrive/claude-skills-data/career-consultant/profile/cvs
   ```

2. **Create initial configuration** at `~/MyDrive/claude-skills-data/career-consultant/profile/settings.yaml`:
   ```yaml
   cv_variants:
     variants:
       - id: "default"
         filename: "cv-default.md"
         focus: "General"
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
     bonuses: {}

   preferences:
     min_salary_annual: 400000
     target_salary_annual: 500000
     preferred_locations: ["Tel Aviv", "Remote"]

   scraping_tools:
     company_research: ["firecrawl", "web_fetch"]
     linkedin: ["mcp_docker", "bright_data", "web_fetch"]
     job_scraping: ["firecrawl", "bright_data", "web_fetch"]
   ```

3. **Create job tracking files**:
   ```bash
   echo "jobs: []" > ~/MyDrive/claude-skills-data/career-consultant/jobs/backlog.yaml
   echo "items: []" > ~/MyDrive/claude-skills-data/career-consultant/jobs/inbox.yaml
   ```

4. **Add your CV** to `~/MyDrive/claude-skills-data/career-consultant/profile/cvs/cv-default.md`

5. **Configure MCP Filesystem** (required) - Add to your Claude config:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/MyDrive/claude-skills-data/career-consultant"]
       }
     }
   }
   ```

## Verification

After setup, test with:
- "Show my job backlog"
- "Add to backlog: [job URL]"

## Commands

| Command | Action |
|---------|--------|
| `process inbox` | Process jobs from backlog |
| `add to backlog: [URL]` | Quick capture job |
| `analyze job [id]` | Full job analysis |
| `show backlog` | View pending jobs |

Installation complete! Start with "process inbox" to begin.
