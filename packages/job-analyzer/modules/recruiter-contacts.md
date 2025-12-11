# Recruiter & Contact Management

Track recruiters, hiring managers, and professional contacts for job search.

## Data Schema

```yaml
# contacts.yaml
contacts:
  - id: "sarah-cohen-nvidia"
    name: "Sarah Cohen"
    company: "NVIDIA"
    role: "Technical Recruiter"
    type: "recruiter"  # recruiter | hiring-manager | referral | network
    
    # Contact info
    email: "sarah.cohen@nvidia.com"
    linkedin: "linkedin.com/in/sarahcohen"
    phone: "+972-50-1234567"
    
    # Relationship
    source: "LinkedIn outreach"  # LinkedIn | event | referral | inbound
    first_contact: "2025-12-01"
    last_contact: "2025-12-10"
    relationship_strength: "warm"  # cold | warm | strong
    
    # Context
    jobs_discussed: ["nvidia-engineering-manager", "nvidia-ai-lead"]
    notes: |
      Met at tech meetup. Interested in EM roles.
      Prefers WhatsApp communication.
    
    # Activity log
    interactions:
      - date: "2025-12-01"
        type: "intro"
        channel: "LinkedIn"
        summary: "Initial connection, discussed EM role"
      - date: "2025-12-10"
        type: "follow-up"
        channel: "email"
        summary: "Sent resume, scheduled call"
```

## Contact Types

| Type | Description |
|------|-------------|
| recruiter | External or internal recruiter |
| hiring-manager | Direct hiring authority |
| referral | Can refer you internally |
| network | General professional contact |

## Commands

| Command | Action |
|---------|--------|
| `Add contact: [name] at [company]` | Create new contact |
| `Show contacts` | List all contacts |
| `Show contacts at [company]` | Filter by company |
| `Log interaction: [contact]` | Add interaction note |
| `Find referral for [company]` | Search network for connections |

## Integration Points

### With Job Analyzer
- Link contacts to analyzed jobs
- Show relevant contacts when analyzing a company

### With Interview Prep
- Pull contact info for "who will I meet" prep
- Include relationship context in prep notes

### With Follow-up Reminders
- Remind if no interaction for 14+ days with warm contacts
- Prompt follow-up after interviews

## Relationship Scoring

```
cold: No response or single interaction
warm: 2+ interactions, positive signals
strong: Active dialogue, referral offered, interview scheduled
```
