# Analysis Workflow

## Workflow Modes

### Mode 1: Backlog Mode (Quick Capture)
- Scrape basic job info (title, company, location)
- Save to `jobs/backlog.yaml`
- ~5K tokens per job

### Mode 2: Analysis Mode (Full Processing)
Complete 8-step workflow with scoring.

---

## Step-by-Step Workflow

### Step 0: Initialization

```python
# Load paths configuration
from paths import USER_DATA_BASE, COMPANIES_DIR, EXCEL_PATH

# Load user config
from config_loader import load_user_config
user_config = load_user_config(USER_DATA_BASE)

# Verify skill module access
try:
    test_module = file_read("modules/company-research.md")
except:
    print("❌ Skill modules not accessible - re-upload skill")
    STOP

# Token budget check
budget = check_token_budget()
if budget['percentage_used'] > 80:
    print("⚠️ Start NEW conversation")
    STOP
```

### Step 0.5: Intent Detection

Detect user intent from message:

| Pattern | Mode | Action |
|---------|------|--------|
| "add to backlog", "save job" | Backlog | Load `job-backlog-manager.md` |
| "process inbox" | Inbox | Sync and process |
| "show backlog" | View | Display summary |
| "analyze job [id]" | From Backlog | Load job, continue to Step 1 |
| Other URL | Full Analysis | Continue to Step 1 |

### Step 1: Parse Job URL

```python
from slug_utils import extract_company_from_url, normalize_slug

job_url = extract_url(user_message)
company_name = extract_company_from_url(job_url)
company_slug = normalize_slug(company_name)
company_path = f"{COMPANIES_DIR}/{company_slug}.md"
```

### Step 2: Check Company Cache

```python
try:
    content = Filesystem:read_file(path=company_path)
    company_data = parse_yaml_frontmatter(content)
    
    if company_data.get('updated') == True:
        print(f"✅ {company_name} cached (Tier {company_data['tier']})")
        # Continue to Step 4
    else:
        print("⚠️ Company needs validation - set updated: true")
        STOP
except FileNotFoundError:
    # Go to Step 3
```

### Step 3: Company Research (if needed)

**Load**: `modules/company-research.md`

```python
if budget['percentage_used'] > 50:
    print("⚠️ Token budget > 50% - start NEW conversation")
    STOP

research_module = file_read("modules/company-research.md")
# Execute research per module instructions
# Save to companies/{slug}.md
# Set updated: False (requires manual validation)

print("✅ Research complete - validate and rerun")
STOP
```

### Step 4: Skills Matching

**Load**: `modules/skills-matching.md`

```python
from cv_matcher import load_user_cvs

cvs = load_user_cvs(USER_DATA_BASE, cv_variants)
matching_module = file_read("modules/skills-matching.md")

match_results = execute_skills_matching(job_url, cvs, matching_module)
# Returns: score, best_cv, gaps, strengths
```

### Step 5: Calculate Scores

**Load**: `modules/scoring-formulas.md`

```python
scoring_module = file_read("modules/scoring-formulas.md")

scores = execute_all_scoring(
    company_data, job_details, match_results,
    salary_data, user_config, scoring_module
)

# Determine priority
if scores['total'] >= thresholds['first_priority']:
    priority = "First"
elif scores['total'] >= thresholds['second_priority']:
    priority = "Second"
else:
    priority = "Third"
```

### Step 6: Generate Analysis

**Load**: `modules/output-yaml-templates.md`

```python
output_module = file_read("modules/output-yaml-templates.md")

role_id = f"{company_slug}-{job_slug}-{date}"
frontmatter = {
    'role_id': role_id,
    'company_id': company_slug,
    'position_title': job_title,
    # ... all scores and metadata
}

# Save to jobs/analyzed/{role_id}.md
```

### Step 7: Sync to Excel

**Load**: `modules/database-operations-hybrid.md`

```python
db_module = file_read("modules/database-operations-hybrid.md")

rank, total_jobs = sync_role_to_excel(frontmatter, EXCEL_PATH)
print(f"Rank: #{rank} of {total_jobs}")
```

### Step 8: Present Results

Display:
- Company tier and position
- Score breakdown (6 components)
- Rank among all jobs
- File paths saved
- Next steps based on priority

---

## Tool Selection Strategy

All tool priorities from `settings.yaml`:

```yaml
scraping_tools:
  company_research: ["firecrawl", "web_fetch"]
  linkedin: ["mcp_docker", "bright_data", "web_fetch"]
  job_scraping: ["firecrawl", "bright_data", "web_fetch"]
```

Try each tool in order until success.
