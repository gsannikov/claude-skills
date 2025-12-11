# Voice Memos Workflow

## Step 1: Read Apple Notes Inbox

Read "Voice Memos Inbox" note via Apple Notes MCP:

```python
note_content = Apple_Notes:get_note_content(note_name="Voice Memos Inbox")
```

Parse each line for audio file references. Supported formats: m4a, mp3, wav, aac, opus, flac.

Split by "PROCESSED" marker to get only pending memos.

## Step 2: Transcribe Audio

Use Claude's native audio transcription capabilities.

Parameters:
- **language**: auto-detect or specify (EN, HE, etc.)
- **speaker_labels**: Identify up to 10 speakers
- **timestamps**: paragraph or word-level
- **include_metadata**: duration, word count

Output:
- Raw transcript text
- Speaker-labeled formatted version
- Metadata (duration, language, speaker count)

## Step 3: Analyze Content

AI extracts from transcript:

**Action Items** (with priority):
- Owner (if mentioned)
- Deadline (if mentioned)
- Priority: HIGH (blockers, urgent) / MEDIUM (this week) / LOW (someday)

**Summary**: Brief (50 words), Standard (150 words), or Detailed (300 words)

**Key Points**: Up to 7 main takeaways

**Entities**:
- People mentioned
- Dates mentioned
- Locations
- Organizations

**Category**: Auto-classify (meeting, journal, brainstorm, etc.)

**Tags**: Up to 10 relevant keywords

## Step 4: Save Results

### Transcript File (transcripts/{date}-{slug}.md)

```markdown
# Transcript: {filename}

**Date**: {date}
**Duration**: {duration}
**Language**: {detected_language}
**Speakers**: {speaker_count}

---

[Speaker 1]: Opening remarks...
[Speaker 2]: Response...
```

### Analysis File (analyzed/{date}-{slug}.md)

```markdown
# {filename}

**Date**: {date}
**Category**: {category}
**Tags**: {tags}

## Summary
{AI-generated summary}

## Key Points
- Point 1
- Point 2

## Action Items
- [HIGH] Fix auth API (@Dan) - Due: Nov 25
- [MEDIUM] Prepare onboarding (@Sarah)
- [LOW] Update sprint board (@Gur)

## People Mentioned
Dan, Sarah, Mike

## Dates Mentioned
Monday, Nov 25
```

### Index Entry (index.yaml)

```yaml
- filename: team-standup-2024-11-24.m4a
  date: 2024-11-24
  category: meeting
  duration: "5:32"
  speaker_count: 3
  action_items_count: 3
  tags: [standup, engineering, sprint]
  transcript_path: transcripts/2024-11-24-team-standup.md
  analysis_path: analyzed/2024-11-24-team-standup.md
```

## Categories

| Category | Use For |
|----------|---------|
| meeting | Team meetings, standups, 1:1s |
| journal | Personal thoughts, reflections |
| task-list | Quick task capture |
| brainstorm | Ideas, planning |
| interview | Job interviews, user research |
| lecture | Learning content, courses |
| call | Phone/video calls |
| reminder | Quick reminders |
| other | Uncategorized |

## MCP Tools Used

| Tool | Purpose |
|------|---------|
| `Apple_Notes:get_note_content` | Read inbox |
| `Apple_Notes:update_note_content` | Mark processed |
| Claude native audio | Transcribe audio files |
| `Filesystem:write_file` | Save transcripts/analysis |
| `Filesystem:read_text_file` | Load index |
