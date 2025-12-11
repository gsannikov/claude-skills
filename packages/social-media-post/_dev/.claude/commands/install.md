# Install Social Media Post Skill

Set up the Social Media Post skill for generating platform-optimized content.

## Setup Steps

1. **Create user data directory**:
   ```bash
   mkdir -p ~/MyDrive/claude-skills-data/social-media-post/{posts,templates,analytics}
   ```

2. **Create config** at `~/MyDrive/claude-skills-data/social-media-post/config.yaml`:
   ```yaml
   defaults:
     platform: threads
     style: short
     include_metadata: true

   platforms:
     threads:
       max_chars: 500
       use_hashtags: false
       emoji_style: moderate

     x:
       max_chars: 280
       use_hashtags: true
       max_hashtags: 2

     linkedin:
       max_chars: 3000
       use_hashtags: true
       max_hashtags: 5
       professional_tone: true

   brand:
     voice: "technical-casual"
     topics: []
     avoid: []
   ```

3. **Create analytics tracker** at `~/MyDrive/claude-skills-data/social-media-post/analytics/metrics.yaml`:
   ```yaml
   posts_generated: 0
   by_platform:
     threads: 0
     x: 0
     linkedin: 0
   last_generated: null
   ```

4. **Configure MCP Filesystem** - Add to your Claude config:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/MyDrive/claude-skills-data/social-media-post"]
       }
     }
   }
   ```

## Supported Platforms

| Platform | Character Limit | Hashtags |
|----------|----------------|----------|
| Threads | 500 (10K with attachment) | No |
| X (Twitter) | 280 (25K for Premium) | 1-2 max |
| LinkedIn | 3,000 | 3-5 max |

## Verification

After setup, test with:
- "Create a Threads post about [topic]"
- "Generate LinkedIn announcement for [release]"

## Commands

| Command | Action |
|---------|--------|
| `create threads post about [topic]` | Generate Threads post |
| `create x post for [feature]` | Generate X/Twitter post |
| `create linkedin post about [topic]` | Generate LinkedIn post |
| `generate social posts for [topic]` | All platforms |

## Post Styles

- **short**: Under 280 chars, punchy
- **medium**: 300-500 chars, more context
- **long**: 800-1500 chars, full story

Installation complete! Create posts with "create [platform] post about [topic]".
