---
name: social-media-post
description: Generate optimized social media posts for Threads, X (Twitter), and LinkedIn. Applies platform algorithms, character limits, and engagement best practices. Triggers - "create post", "write social media", "Threads post", "X post", "Twitter post", "LinkedIn post", "generate announcement", "social media for [topic]".
---

# Social Media Post Generator

Generate platform-optimized posts using algorithm insights and best practices.

## Capabilities

| Feature | Description |
|---------|-------------|
| **Platform Rules** | Character limits, formatting, hashtag strategies |
| **Algorithm Optimization** | Engagement tactics per platform |
| **Multiple Variants** | Short, medium, long-form options |
| **Engagement Scoring** | Rate posts 1-10 |

## Platforms

| Platform | Char Limit | Hashtags | Key Factor |
|----------|------------|----------|------------|
| Threads | 500 (10K w/media) | ❌ None | Conversation |
| X | 280 (25K premium) | 1-2 max | Front-load value |
| LinkedIn | 3,000 | 3-5 | Hook in 2 lines |

## Commands

| Command | Action |
|---------|--------|
| `Create Threads post for [topic]` | Generate Threads-optimized post |
| `Write X post for [feature]` | Generate Twitter post |
| `LinkedIn announcement for [release]` | Professional post |
| `Generate variants for [content]` | All 3 platforms |

## Workflow

### 1. Analyze Content
Extract: key points, value proposition, target audience, tone

### 2. Apply Platform Rules
Read `references/platform-specs.md` for:
- Character limits
- Formatting allowed
- Algorithm priorities
- Best posting times

### 3. Generate Variants
Read `references/templates.md` for:
- Short & Punchy (under 280)
- Medium (300-500)
- Long-form (800-1500)

### 4. Add Metadata
```
Platform: [name]
Character Count: [used]/[limit]
Engagement Score: [1-10]
Media Suggestion: [screenshot/video/none]
Best Time: [day] [time] ET
```

## Output Format

```markdown
**Platform**: Threads
**Style**: Short & Punchy
**Character Count**: 287/500

---

[Generated post content]

---

**Metadata**:
- Engagement Score: 8.5/10
- Visual: Terminal screenshot recommended
- Best Time: Tuesday 10 AM ET
- Follow-up: Reply with details after 2 hours
```

## Quick Tips

### Threads
- Be conversational, not corporate
- Ask questions → drive engagement
- No hashtags (they don't work)
- Respond fast to comments

### X
- First 100 chars = most important
- Use threads for complex topics
- Images boost 150% engagement

### LinkedIn
- First 2 lines show in feed
- Data/statistics boost credibility
- Professional but authentic

## References

| File | Content |
|------|---------|
| `references/platform-specs.md` | Limits, algorithms, best practices |
| `references/templates.md` | Post templates, variants, scoring |

---

**Version**: 1.0.0
