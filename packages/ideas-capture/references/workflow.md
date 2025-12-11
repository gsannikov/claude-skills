# Ideas Capture Workflow

## Step 1: Read Apple Notes Inbox

Read "Ideas Inbox" note via Apple Notes MCP:

```python
note_content = Apple_Notes:get_note_content(note_name="Ideas Inbox")
```

Parse each line for type prefix:
- `[Patent]` or patent emoji → type: patent
- `[Startup]` or rocket emoji → type: startup
- `[Business]` or briefcase emoji → type: business
- `[Project]` or tool emoji → type: project
- No prefix → type: other (auto-classify based on content)

Skip empty lines, separators, and already-processed markers.

## Step 2: AI Expansion

Expand each idea based on type:

**Patent**: Problem solved, technical approach, key innovations, prior art, potential claims

**Startup**: Problem/market need, solution, target customers, business model, competitive advantage, MVP features

**Business**: Pain point, improvement, implementation steps, expected ROI, risks

**Project**: Goal, key features, tech stack, time estimate, first steps

**Other**: Core concept, applications, next steps

## Step 3: Potential Scoring

Score 1-10 on six dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Feasibility | 20% | How realistic to implement |
| Impact | 25% | Potential value/change |
| Effort | 15% | Resources required (inverted) |
| Uniqueness | 15% | How novel/differentiated |
| Timing | 15% | Market/tech readiness |
| Personal Fit | 10% | Alignment with skills/interests |

**Tiers**: Hot (≥7), Warm (5-7), Cold (<5)

## Step 4: Save to Database

### Database Entry (ideas.yaml)

```yaml
- slug: ai-resume-optimizer
  raw: "AI tool that tailors resumes to job descriptions"
  type: startup
  added_date: 2025-11-24T10:30:00
  status: new  # new → exploring → active → parked → done
  scores:
    feasibility: 8
    impact: 9
    effort: 6
    uniqueness: 7
    timing: 8
    personal_fit: 7
  overall_score: 7.6
  tier: Hot
  tags: [ai, career, saas]
  related_ideas: []
```

### Expansion File (expanded/{slug}.md)

```markdown
# [Type Icon] {idea title}

**Type**: {type}
**Added**: {date}
**Status**: {status}
**Score**: {overall}/10 ({tier})

## Scores
| Dimension | Score |
|-----------|-------|
| Feasibility | X/10 |
| Impact | X/10 |
| Effort (low=good) | X/10 |
| Uniqueness | X/10 |
| Timing | X/10 |
| Personal Fit | X/10 |

## Expansion
{AI-generated expansion}

## Next Steps
- [ ] Research competitors/prior art
- [ ] Validate problem with potential users
- [ ] Create rough prototype/mockup
- [ ] Estimate resources needed

## Notes
_User notes here..._
```

## Output: Ideas Dashboard

```markdown
# Ideas Dashboard

## Hot Ideas (Score ≥7)
| Idea | Type | Score | Status |
|------|------|-------|--------|
| AI resume optimizer | Startup | 8.2 | exploring |

## Warm Ideas (Score 5-7)
...

## Cold Ideas (Score <5)
...

## By Type
- Patents: 3
- Startups: 8
- Business: 5
- Projects: 12
- Other: 4
```

## MCP Tools Used

| Tool | Purpose |
|------|---------|
| `Apple_Notes:get_note_content` | Read inbox |
| `Apple_Notes:update_note_content` | Mark processed |
| `Filesystem:read_text_file` | Load database |
| `Filesystem:write_file` | Save database/expansions |
| `Filesystem:list_directory` | List expanded files |
