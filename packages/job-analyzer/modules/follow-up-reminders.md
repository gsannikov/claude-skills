# Follow-up Reminder System

Automated reminders for job search follow-ups.

## Reminder Types

| Type | Trigger | Default Delay |
|------|---------|---------------|
| application_stale | No status change | 7 days |
| post_interview | After interview | 2 days |
| recruiter_followup | No response | 5 days |
| offer_deadline | Offer received | Based on deadline |
| network_touchpoint | Warm contact idle | 14 days |

## Data Schema

```yaml
# reminders.yaml
reminders:
  - id: "rem-001"
    type: "application_stale"
    job_id: "nvidia-engineering-manager"
    contact_id: "sarah-cohen-nvidia"
    
    created_at: "2025-12-10"
    due_date: "2025-12-17"
    status: "pending"  # pending | snoozed | completed | dismissed
    
    # Context
    title: "Follow up on NVIDIA EM application"
    action: "Send follow-up email to Sarah"
    template: "application-followup"
    
    # Snooze tracking
    snooze_count: 0
    snoozed_until: null
```

## Commands

| Command | Action |
|---------|--------|
| `Show reminders` | List pending reminders |
| `Show reminders today` | Due today |
| `Snooze [reminder] [days]` | Delay reminder |
| `Complete [reminder]` | Mark done |
| `Create reminder: [text] in [days]` | Manual reminder |

## Auto-Generation Rules

### Application Tracking
```
IF application.status == "applied" 
   AND days_since(applied_date) > 7
   AND no_existing_reminder
THEN create_reminder(type="application_stale")
```

### Post-Interview
```
IF interview.completed == true
   AND days_since(interview_date) >= 2
   AND interview.thank_you_sent == false
THEN create_reminder(type="post_interview", action="Send thank you")
```

### Recruiter Follow-up
```
IF contact.last_contact > 5 days ago
   AND contact.awaiting_response == true
THEN create_reminder(type="recruiter_followup")
```

## Message Templates

### application-followup
```
Subject: Following up on [Job Title] application

Hi [Contact Name],

I wanted to follow up on my application for the [Job Title] position 
submitted on [Date]. I remain very interested in this opportunity...
```

### post-interview
```
Subject: Thank you - [Job Title] interview

Hi [Interviewer Name],

Thank you for taking the time to speak with me about the [Job Title] 
role. I enjoyed learning about [specific topic discussed]...
```

## Integration Points

### With LinkedIn Tracking
- Auto-create reminders for stale applications

### With Recruiter Contacts
- Track last interaction, trigger touchpoint reminders

### With Interview Prep
- Create post-interview follow-up reminders

## Daily Digest

On `Show reminders` or daily prompt:
```
📬 Job Search Reminders - Dec 11

🔴 Overdue (2)
• Follow up on NVIDIA application (3 days overdue)
• Thank you note to AWS interviewer (1 day overdue)

🟡 Due Today (1)
• Check Intel application status

🟢 Upcoming (3)
• [Dec 14] Touch base with referral at Google
• [Dec 17] Follow up on Annapurna application
```
