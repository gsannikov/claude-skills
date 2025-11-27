# Install Local RAG Skill

Set up the Local RAG skill for document indexing and semantic search.

## Setup Steps

1. **Create user data directory**:
   ```bash
   mkdir -p ~/MyDrive/claude-skills-data/local-rag/{chromadb,state}
   ```

2. **Create state file** at `~/MyDrive/claude-skills-data/local-rag/state/ingest_state.json`:
   ```json
   {
     "indexed_files": {},
     "last_update": null,
     "total_chunks": 0
   }
   ```

3. **Install Python dependencies**:
   ```bash
   pip install chromadb sentence-transformers rapidfuzz python-dotenv pypdf pdf2image Pillow python-docx python-pptx openpyxl
   ```

4. **Install system dependencies for OCR** (optional):

   macOS:
   ```bash
   brew install poppler tesseract
   ```

   Ubuntu:
   ```bash
   sudo apt install poppler-utils tesseract-ocr
   ```

5. **Configure MCP Filesystem** - Add to your Claude config:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/MyDrive/claude-skills-data/local-rag", "~/Documents"]
       }
     }
   }
   ```

   Note: Include directories you want to index in the filesystem paths.

## Environment Variables (Optional)

Create `~/MyDrive/claude-skills-data/local-rag/.env`:
```
OCR_ENABLED=true
OCR_MAX_PAGES=120
OCR_PAGE_DPI=200
```

## Supported File Types

**Documents**: PDF, DOCX, PPTX, XLSX
**Text**: MD, TXT, JSON, YAML
**Code**: PY, JS, TS, HTML, CSS, C, CPP, H, SH
**Images (OCR)**: PNG, JPG, JPEG, TIFF, WebP

## Verification

After setup, test with:
- "update rag from ~/Documents/some-folder"
- "query rag [your question]"

## Commands

| Command | Action |
|---------|--------|
| `update rag from [path]` | Index a directory |
| `query rag [question]` | Search indexed docs |
| `search documents [query]` | Alternative search |

Installation complete! Index a folder with "update rag from [path]".
