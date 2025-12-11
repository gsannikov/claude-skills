# Reading List Workflow

## Step 1: Read Apple Notes Inbox

Read "Reading List Inbox" note via Apple Notes MCP:

```python
note_content = Apple_Notes:get_note_content(note_name="Reading List Inbox")
```

Extract URLs using regex pattern: `https?://[^\s<>"{}|\\^`\[\]]+`

Split by "PROCESSED" marker if present to get only pending URLs.

## Step 2: Scrape Content

Use Firecrawl for reliable scraping:

```python
result = firecrawl_scrape(
    url=url,
    formats=["markdown"],
    onlyMainContent=True
)
```

Extract: title, markdown content, metadata.

Fallback to web_fetch if Firecrawl unavailable.

## Step 3: Summarize & Categorize

AI generates for each article:
- **Summary**: 150 words max, captures main points
- **Category**: Tech, AI, Business, Career, Finance, Science, Other
- **Key Takeaways**: 3-5 bullet points
- **Read Time**: Estimate based on word count (~200 wpm)
- **Tags**: 3-5 relevant keywords

## Step 4: Save to Database

### Database Entry (reading-list.yaml)

```yaml
stats:
  total: 42
  unread: 12
  reading: 3
  done: 25
  archived: 2
  by_category:
    tech: 15
    ai: 10
    business: 8

items:
  - id: building-llm-applications
    title: "Building LLM Applications in 2024"
    url: https://example.com/llm-apps
    status: unread  # unread → reading → done → archived
    category: ai
    summary: |
      Comprehensive guide to building production LLM apps.
      Covers RAG, fine-tuning, and deployment strategies.
    key_takeaways:
      - Start with RAG before fine-tuning
      - Use structured outputs for reliability
      - Monitor token costs from day one
    read_time_mins: 12
    tags: [llm, ai, development, rag]
    added_at: 2024-11-24T10:30:00Z
    read_at: null
```

### Summary File (summaries/{slug}.md)

Store full scraped content for later reference.

## Output: Unread List

```markdown
# Reading List - 12 Unread

## AI (5)
- Building LLM Applications (12 min)
- RAG Best Practices (8 min)
- Claude 4 Features (6 min)

## Career (3)
- Tech Interview Guide 2024 (15 min)
- Salary Negotiation Tips (10 min)
```

## Output: Article Summary

```markdown
# Building LLM Applications in 2024

Category: AI | Read time: 12 min
Added: Nov 24, 2024

## Summary
Comprehensive guide covering RAG implementation,
fine-tuning decisions, and production deployment...

## Key Takeaways
- Start with RAG before considering fine-tuning
- Use structured outputs for reliability
- Monitor token costs from day one

Tags: llm, ai, development, rag
URL: https://example.com/llm-apps
```

## MCP Tools Used

| Tool | Purpose |
|------|---------|
| `Apple_Notes:get_note_content` | Read inbox |
| `Apple_Notes:update_note_content` | Mark processed |
| `firecrawl_scrape` | Scrape articles |
| `web_fetch` | Fallback scraping |
| `Filesystem:read_text_file` | Load database |
| `Filesystem:write_file` | Save database/summaries |
