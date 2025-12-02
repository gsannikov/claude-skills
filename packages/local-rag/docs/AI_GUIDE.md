# AI Guide: Local RAG

## Overview
This skill allows you to index local files and perform semantic searches over them.

## Architecture
- **Storage**: ChromaDB (vector database) stored in `~/MyDrive/claude-skills-data/local-rag/vectordb/`.
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2`.
- **Scripts**: `indexer.py` (ingest) and `query.py` (search).

## User Data Location
**IMPORTANT**: Always use the correct user data directory when indexing or querying:

```
~/MyDrive/claude-skills-data/local-rag/
├── vectordb/              # ChromaDB persistence directory
│   ├── chroma.sqlite3     # Vector database
│   └── [collection-uuid]/ # Vector collection
└── state/
    ├── ingest_state.json  # File tracking state
    └── bm25_index.json    # Keyword search index
```

## Workflow

### 1. Indexing
When the user provides a folder path, use the CLI with the correct `--user-data-dir`:

```bash
local-rag index /path/to/documents \
  --user-data-dir ~/MyDrive/claude-skills-data/local-rag
```

Or when using MCP tools, always pass `user_data_dir` parameter:
```json
{
  "path": "/path/to/documents",
  "user_data_dir": "~/Documents/claude-skills-data/local-rag"  # or as configured in shared/config/paths.py
}
```

### 2. Querying
When the user asks a question, use the same user data directory:

```bash
local-rag query "search query" \
  --user-data-dir ~/MyDrive/claude-skills-data/local-rag
```

Or via MCP:
```json
{
  "query": "search query",
  "user_data_dir": "~/Documents/claude-skills-data/local-rag"  # or as configured in shared/config/paths.py
}
```

## Tips
- **Always specify `--user-data-dir`** to ensure the index goes to the correct location
- If the user asks "what's in my documents?", use `query_rag` with a broad term or ask for a summary
- If the user updates files, suggest running `update_rag` again with `--force` flag
- The default path (without `--user-data-dir`) is `~/Library/Application Support/local-rag/` on macOS - avoid using this for claude-skills
