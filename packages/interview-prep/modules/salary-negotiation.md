# Salary Negotiation Prep

Prepare for compensation discussions and offer negotiations.

## Negotiation Framework

### 1. Know Your Numbers

```yaml
compensation_targets:
  minimum_acceptable: 450000  # Walk-away number (private)
  target: 520000              # Realistic goal
  stretch: 580000             # Best case
  
  current_comp:
    base: 420000
    bonus: 50000
    stock: 80000
    total: 550000
```

### 2. Research Market Data

| Source | Use For |
|--------|---------|
| Glassdoor | Base salary ranges |
| Levels.fyi | Tech company specifics |
| LinkedIn Salary | Israel market data |
| Blind | Real offer data points |
| Network | Verified insider info |

### 3. Understand Total Comp

| Component | Notes |
|-----------|-------|
| Base Salary | Negotiate first, hardest to change later |
| Signing Bonus | Often flexible, one-time |
| Annual Bonus | Target % and realistic % |
| Equity/RSU | Vesting schedule, refresh grants |
| Benefits | Sometimes worth $20-50K |

## Negotiation Scripts

### When Asked for Salary Expectations
```
"I'm focused on finding the right role and am confident we can 
reach a fair number. Based on my research and experience level,
I'm looking at [range] for total compensation. What range did
you have budgeted for this role?"
```

### When Given a Low Offer
```
"Thank you for the offer. I'm excited about this role and [company].
Based on my [X years] experience in [domain], comparable offers I've
seen, and the scope of this role, I was expecting something closer
to [target]. Is there flexibility on the base salary?"
```

### Asking for Time
```
"I appreciate this offer. I'd like to take a few days to review
everything carefully. Can I get back to you by [date]?"
```

## Leverage Points

### Strong Leverage
- Competing offers (strongest)
- Rare/in-demand skills
- Referral from senior employee
- Strong interview performance
- Company urgency to fill role

### Weak Leverage
- Long job search
- Gaps in requirements
- Only one offer
- Desperate to leave current job

## Offer Comparison Matrix

```markdown
| Factor | Company A | Company B | Weight |
|--------|-----------|-----------|--------|
| Base | 480K | 450K | 30% |
| Bonus | 15% | 20% | 15% |
| Equity | 200K/4yr | 150K/4yr | 20% |
| Role fit | 9/10 | 7/10 | 15% |
| Growth | 8/10 | 9/10 | 10% |
| WLB | 7/10 | 8/10 | 10% |
| **Score** | **8.2** | **7.6** | |
```

## Commands

| Command | Action |
|---------|--------|
| `Prep negotiation for [company]` | Full prep package |
| `Compare offers` | Side-by-side matrix |
| `Draft counter for [company]` | Counter-offer script |
| `Calculate total comp: [details]` | Comp breakdown |

## Data Schema

```yaml
# In career/negotiations/[company].yaml
negotiation:
  company: "NVIDIA"
  role: "Engineering Manager"
  
  offer_received: "2025-12-10"
  deadline: "2025-12-17"
  
  initial_offer:
    base: 480000
    bonus_target: 15%
    signing: 50000
    equity: 200000  # Over 4 years
    
  counter_offer:
    base: 520000
    signing: 75000
    # Keep equity same
    
  final_offer: null
  
  competing_offers:
    - company: "AWS"
      base: 500000
      total_comp: 620000
      
  notes: |
    Recruiter mentioned budget flexibility.
    Team is understaffed, urgency to hire.
    
  status: "negotiating"  # pending | negotiating | accepted | declined
```

## Integration Points

### From Job Analyzer
- Pull salary data from initial analysis
- Company financials inform flexibility

### From Company Deep Dive
- Funding stage affects comp budget
- Recent layoffs = less flexibility
- Hyper-growth = more flexibility

### With Recruiter Contacts
- Track negotiation conversations
- Document verbal agreements
