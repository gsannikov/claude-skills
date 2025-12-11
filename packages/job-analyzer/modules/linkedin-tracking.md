# LinkedIn Application Tracking

Track job applications submitted through LinkedIn.

## Data Schema

```yaml
# In jobs.xlsx or applications.yaml
linkedin_application:
  job_id: "nvidia-engineering-manager"
  linkedin_job_id: "3812345678"
  applied_date: "2025-12-10"
  application_status: "applied"  # applied | viewed | in-review | rejected | interview
  easy_apply: true
  resume_used: "cv-engineering-manager.pdf"
  cover_letter: false
  referral: null
  last_status_change: "2025-12-10"
  notes: ""
```

## Status Flow

```
applied → viewed → in-review → interview → offer
                            ↘ rejected
```

## Commands

| Command | Action |
|---------|--------|
| `Track LinkedIn: [URL]` | Add application from LinkedIn job URL |
| `Update status [job]: [status]` | Change application status |
| `Show LinkedIn applications` | List all tracked applications |
| `Show pending applications` | Filter by status |

## Integration Points

### With Job Analyzer
- After `Analyze: [LinkedIn URL]`, prompt to track application
- Auto-populate job_id from analysis

### With Follow-up Reminders
- Trigger reminder if status unchanged for 7+ days
- Auto-remind for "viewed" status after 3 days

## LinkedIn URL Parsing

Extract job ID from URLs:
- `linkedin.com/jobs/view/3812345678` → `3812345678`
- `linkedin.com/jobs/collections/.../?currentJobId=3812345678` → `3812345678`

## Scraping Application Status

Use LinkedIn profile "Applied Jobs" if accessible, otherwise manual updates.
