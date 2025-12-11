# Local RAG Setup & Configuration

## Storage Structure

Path: `~/exocortex-data/local-rag/`

```
local-rag/
├── vectordb/           # ChromaDB storage
│   ├── chroma.sqlite3  # Database
│   └── [uuid]/         # Collection data
└── state/
    ├── ingest_state.json  # File tracking
    └── bm25_index.json    # Keyword index
```

## Supported File Types

### Documents
- PDF (`.pdf`) - Native + OCR fallback
- Word (`.docx`)
- PowerPoint (`.pptx`)
- Excel (`.xlsx`)

### Text
- Markdown (`.md`)
- Plain text (`.txt`)
- JSON/YAML (`.json`, `.yaml`)

### Code
- Python, JavaScript, TypeScript
- HTML, CSS, Shell
- C/C++ headers

### Images (OCR)
- PNG, JPEG, TIFF, WebP

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OCR_ENABLED` | `true` | Enable OCR |
| `OCR_MAX_PAGES` | `120` | Max pages per PDF |
| `OCR_PAGE_DPI` | `200` | PDF-to-image DPI |

## Embedding Configuration

**Model**: `sentence-transformers/all-MiniLM-L6-v2`
- ~90MB download on first run
- Good semantic similarity
- Fast embedding generation

**Chunking**:
- Chunk size: 3000 characters
- Overlap: 400 characters

## Python Dependencies

```
chromadb>=0.4.0
sentence-transformers>=2.2.0
rapidfuzz>=3.0.0
pypdf>=3.0.0
pdf2image>=1.16.0
python-docx>=0.8.11
python-pptx>=0.6.21
openpyxl>=3.0.0
ocrmypdf>=15.0.0
pytesseract>=0.3.10
```

## System Dependencies (OCR)

**macOS**:
```bash
brew install poppler tesseract tesseract-lang
```

**Ubuntu**:
```bash
sudo apt install poppler-utils tesseract-ocr tesseract-ocr-heb
```

## Limitations

- Files >10MB skipped
- OCR quality depends on scan quality
- Large directories: initial index may take minutes
- First run downloads embedding model

## Project Structure

```
local-rag/
├── SKILL.md
├── local_rag/
│   ├── cli.py            # CLI entrypoint
│   ├── indexer.py        # Document indexing
│   ├── query.py          # Search
│   ├── vectorstore.py    # Vector DB
│   ├── chunking.py       # Chunking
│   └── ingest/
│       ├── extractor.py  # Content extraction
│       └── ocr.py        # OCR processing
└── tests/
```
