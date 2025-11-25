# 🧠 Local RAG

Index and semantically search your local documents using embeddings and ChromaDB.

## Features

- **Index Local Folders**: Scan and embed documents from any directory
- **Multi-Format Support**: PDF, DOCX, PPTX, XLSX, TXT, MD, code files, images
- **OCR Support**: Extract text from scanned PDFs and images
- **Semantic Search**: Find relevant content by meaning, not just keywords
- **Persistent Storage**: ChromaDB vector database stored locally
- **Incremental Updates**: Only re-index changed files

## Usage

### Index a folder
```
update rag from ~/Documents/research
```

### Query the database
```
query rag what are the key findings about climate change?
```

### Alternative search
```
search documents neural network training
```

## Supported File Types

### Documents
- **PDF** (`.pdf`) - Native text extraction + OCR fallback
- **Word** (`.docx`) - Full document text extraction
- **PowerPoint** (`.pptx`) - Slide text extraction
- **Excel** (`.xlsx`) - Cell content extraction

### Text Files
- **Markdown** (`.md`)
- **Plain Text** (`.txt`)
- **JSON/YAML** (`.json`, `.yaml`, `.yml`)

### Code Files
- Python, JavaScript, TypeScript, HTML, CSS, C/C++, Shell

### Images (with OCR)
- PNG, JPEG, TIFF, WebP

## Configuration

### Storage Location
```
~/MyDrive/claude-skills-data/local-rag/
├── chromadb/              # Vector database
└── state/
    └── ingest_state.json  # File tracking
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `OCR_ENABLED` | `true` | Enable OCR for images/scanned PDFs |
| `OCR_MAX_PAGES` | `120` | Max pages to OCR per PDF |
| `OCR_PAGE_DPI` | `200` | DPI for PDF-to-image conversion |

### Embedding Model
Uses `sentence-transformers/all-MiniLM-L6-v2`:
- Fast embedding generation
- Good semantic similarity
- Small memory footprint (~90MB)

## Requirements

### Python Dependencies
```
chromadb>=0.4.0
sentence-transformers>=2.2.0
rapidfuzz>=3.0.0
pypdf>=3.0.0
python-docx>=0.8.11
openpyxl>=3.0.0
```

### System Dependencies (for OCR)
```bash
# macOS
brew install poppler tesseract

# Ubuntu
sudo apt install poppler-utils tesseract-ocr
```

## Limitations

- Files larger than 10MB are skipped
- OCR quality depends on document scan quality
- Initial indexing of large directories may take several minutes
- Embedding model download required on first run (~90MB)

## Documentation

- [SKILL.md](SKILL.md) - Full skill documentation
- [docs/architecture.md](docs/architecture.md) - Technical architecture
- [docs/agent-guide.md](docs/agent-guide.md) - AI assistant guide
