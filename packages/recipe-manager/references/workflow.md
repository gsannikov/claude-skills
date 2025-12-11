# Recipe Manager Workflow

## Storage Structure

Path: `~/exocortex-data/recipe-manager/`

```
recipe-manager/
├── config/
│   └── settings.yaml       # User preferences
├── recipes/
│   ├── to-try/            # Status-based
│   ├── tried/
│   └── perfected/
└── exports/
```

## Recipe Data Schema

```yaml
id: "arais-tortilla"              # Auto-generated slug
name: "Arais Tortilla"
icon: "🌮"

# Classification
type: "Ninja"                     # Oven | Ninja | School Breakfast | Stovetop
status: "To try"                  # To try | Try next | Tried | Perfected
rating: 5                         # 1-5 (null if not tried)

# Family preferences
relevant: ["Jonathan", "Noga", "Eitan"]

# Source
source:
  url: "https://instagram.com/..."
  type: "video"                   # text | image | video
  platform: "Instagram"           # Instagram | YouTube | Website | Manual
  author: "Name"
  date_added: "2025-09-27"

# Content
prep_time: "15 min"
cook_time: "20 min"
servings: 4
difficulty: "Easy"                # Easy | Medium | Hard

ingredients:
  - "½ קילו בשר טחון"
  - "1 בצל קצוץ"

instructions:
  - "Step 1..."
  - "Step 2..."

notes: []                         # Tweaks and experiments
tags: ["meat", "quick"]

# Metadata
created_at: "2025-09-27T09:35:00Z"
updated_at: "2025-09-27T09:35:00Z"
notion_page_id: "..."             # For sync
```

## Recipe Extraction Process

```
Input Source
    │
    ├── Instagram Reel/Post
    │   └── Bright Data or Firecrawl
    │       └── Extract caption + description
    │
    ├── YouTube Video
    │   └── Fetch video description
    │       └── Parse ingredients/instructions
    │
    ├── Website
    │   └── Firecrawl scrape
    │       └── Parse structured recipe data
    │
    ├── Image
    │   └── Claude vision
    │       └── Extract text and structure
    │
    └── Apple Notes
        └── Read note content
            ├── URL found → Extract from source
            └── Raw text → Parse directly
```

## Apple Notes Import

1. Read "Recipe Inbox" note
2. Parse URLs and raw recipe text
3. For each URL: extract via Firecrawl/Bright Data
4. For raw text: parse directly
5. Create YAML file
6. Mark as processed in note

## Notion Sync

- **Database ID**: `2461eaaa56f680c4a8d7f1df05616964`
- **Data Source ID**: `2461eaaa-56f6-81cd-8003-000bfe08e51f`
- Sync is manual via explicit commands
- Bi-directional: push local changes, pull Notion updates

## Configuration (settings.yaml)

```yaml
family_members:
  - id: "jonathan"
    name: "Jonathan"
  - id: "noga"
    name: "Noga"
  - id: "eitan"
    name: "Eitan"

types:
  - "Oven"
  - "Ninja"
  - "School Breakfast"
  - "Stovetop"
  - "Grill"

statuses:
  - "To try"
  - "Try next"
  - "Tried"
  - "Perfected"

notion:
  enabled: true
  database_id: "2461eaaa56f680c4a8d7f1df05616964"
  auto_sync: false

default_language: "he"
```

## MCP Tools Used

| Tool | Purpose |
|------|---------|
| `Filesystem:*` | Local YAML storage |
| `firecrawl_scrape` | Web scraping |
| `Bright Data:scrape_as_markdown` | Instagram/social |
| `Notion:*` | Database sync |
| `Apple_Notes:*` | Import from notes |
| Claude vision | Image extraction |
