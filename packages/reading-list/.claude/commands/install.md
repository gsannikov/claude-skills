# Install Reading List Skill

Set up the Reading List automation skill for article capture and summarization.

## Setup Steps

1. **Create user data directory**:
   ```bash
   mkdir -p ~/MyDrive/claude-skills-data/reading-list/summaries
   ```

2. **Create initial database** at `~/MyDrive/claude-skills-data/reading-list/reading-list.yaml`:
   ```yaml
   stats:
     total: 0
     unread: 0
     reading: 0
     done: 0
     archived: 0
     by_category:
       tech: 0
       ai: 0
       business: 0
       career: 0
       finance: 0
       science: 0
       other: 0

   items: []
   ```

3. **Create config** at `~/MyDrive/claude-skills-data/reading-list/config.yaml`:
   ```yaml
   summary:
     max_words: 150
     include_takeaways: true
     max_takeaways: 5

   categories:
     - tech
     - ai
     - business
     - career
     - finance
     - science
     - other
   ```

4. **Create Apple Note** named "Reading List Inbox" for URL capture

5. **Configure MCP Filesystem** - Add to your Claude config:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/MyDrive/claude-skills-data/reading-list"]
       }
     }
   }
   ```

6. **Optional: Configure Firecrawl MCP** for better article scraping

## Verification

After setup, test with:
- "Show reading list"
- "Process reading list"

## Commands

| Command | Action |
|---------|--------|
| `process reading list` | Process URLs from inbox |
| `show unread` | List unread articles |
| `show reading list` | Full list with status |
| `summarize [topic]` | Get summaries by category |
| `mark read: [title]` | Update status |

Installation complete! Paste URLs into your Apple Note and say "process reading list".
