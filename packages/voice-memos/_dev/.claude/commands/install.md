# Install Voice Memos Skill

Set up the Voice Memos skill for transcription and analysis.

## Setup Steps

1. **Create user data directory**:
   ```bash
   mkdir -p ~/MyDrive/claude-skills-data/voice-memos/{transcripts,analyzed}
   ```

2. **Create initial index** at `~/MyDrive/claude-skills-data/voice-memos/index.yaml`:
   ```yaml
   stats:
     total: 0
     by_category:
       meeting: 0
       journal: 0
       task-list: 0
       brainstorm: 0
       interview: 0
       lecture: 0
       call: 0
       reminder: 0
       other: 0

   memos: []
   ```

3. **Create config** at `~/MyDrive/claude-skills-data/voice-memos/config.yaml`:
   ```yaml
   transcription:
     language: auto
     speaker_labels: true
     max_speakers: 5
     include_timestamps: true
     timestamp_granularity: paragraph

   analysis:
     extract_action_items: true
     generate_summary: true
     summary_length: standard
     max_key_points: 7
     max_tags: 10
   ```

4. **Create Apple Note** named "Voice Memos Inbox" for memo references

5. **Configure MCP Filesystem** - Add to your Claude config:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/MyDrive/claude-skills-data/voice-memos"]
       }
     }
   }
   ```

## Supported Audio Formats

- `.m4a` (Voice Memos default)
- `.mp3`
- `.wav`
- `.aac`
- `.opus`
- `.flac`

## Verification

After setup, test with:
- Upload a voice memo and say "transcribe this"
- "Show transcripts"

## Commands

| Command | Action |
|---------|--------|
| `process voice memos` | Process from Apple Notes |
| `transcribe [file]` | Transcribe uploaded file |
| `analyze memo` | Analyze last transcription |
| `show pending memos` | List unprocessed |
| `show transcripts` | List all transcripts |
| `search memos: [query]` | Find by keyword |

Installation complete! Record memos and say "process voice memos".
