# Local RAG v2.0.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](version.yaml)

**Index local folders and query them using RAG (Retrieval Augmented Generation). Supports PDF, DOCX, PPTX, XLSX, images with OCR, and text files.**

---

## 🎯 What It Does

Semantic search over your local documents - no cloud, fully private:

- **📁 Index Local Folders** - Scan and embed documents from any directory
- **🔍 Multi-Format Support** - PDF, DOCX, PPTX, XLSX, TXT, MD, code files, images
- **🤖 OCR Support** - Extract text from scanned PDFs and images (Tesseract, Surya, DeepSeek)
- **🧠 Semantic Search** - Find relevant content by meaning, not just keywords
- **💾 Persistent Index** - Embeddings stored locally in ChromaDB
- **⚡ Incremental Updates** - Only re-index changed files
- **🎯 Hybrid Search** - Combines vector similarity + BM25 keyword matching
- **🔧 Flexible Chunking** - Multiple strategies (fixed, sentence, semantic, template)

**Search Methods**:
- **Vector** - Semantic similarity using embeddings
- **BM25** - Traditional keyword search with TF-IDF weighting
- **Hybrid** - Best of both worlds with configurable fusion

---

## 💡 Why Use This?

### The Problem
You have hundreds of PDFs, documents, notes, and research papers scattered across folders. Finding specific information requires manual searching or hoping grep finds the right keywords.

### The Old Way (Manual Search)
- Open files one by one
- Use Cmd+F to search exact keywords
- Miss semantically related content
- Forget where you saw that reference
- Waste hours searching

### The New Way (This Tool)
1. **Index Once** - Point at your documents folder
2. **Ask Questions** - Natural language queries
3. **Get Results** - Ranked by relevance with context
4. **Find Related** - Semantic search finds conceptually similar content

**Result**: 10x faster information retrieval. Find what you need, even if you don't remember the exact wording.

### Perfect For
- 📚 **Researchers** - Search through papers and notes
- 💼 **Knowledge Workers** - Find info in documentation
- 📝 **Note Takers** - Search your Markdown/text notes
- 🏢 **Professionals** - Query work documents and PDFs
- 🎓 **Students** - Search lecture notes and textbooks

---

## 🚀 How It Works

### The Indexing Pipeline

**Step 1: Document Extraction**
- Load files from your folder
- Extract text (native or OCR for scanned docs)
- Handle multiple formats automatically

**Step 2: Chunking**
- Split documents into searchable chunks (default: 3000 chars)
- Configurable overlap to preserve context (default: 400 chars)
- Choose chunking strategy based on content type

**Step 3: Embedding**
- Generate vector embeddings using `sentence-transformers/all-MiniLM-L6-v2`
- Build BM25 inverted index for keyword search
- Store in local ChromaDB database

**Step 4: State Tracking**
- Track file hashes to detect changes
- Only re-index modified files on updates
- Persistent state in `ingest_state.json`

### The Search Pipeline

**Step 1: Query Processing**
- Parse natural language query
- Generate query embedding

**Step 2: Retrieval**
- **Vector Search**: Find semantically similar chunks
- **BM25 Search**: Find keyword matches
- **Fusion**: Combine results using RRF (Reciprocal Rank Fusion)

**Step 3: Optional Reranking**
- Use cross-encoder for precision boost
- Slower but more accurate

**Step 4: Return Results**
- Ranked list with relevance scores
- Document metadata and previews
- File paths for easy access

---

## 📋 Commands

### Index Documents
```
update rag from ~/Documents/research
```
Index all files in the specified folder recursively.

**What happens:**
- Scans directory for supported file types
- Extracts text (with OCR if needed)
- Chunks and embeds documents
- Updates vector database and BM25 index
- Tracks file hashes for incremental updates

### Search Documents
```
query rag what are the key findings about climate change?
```
Search indexed documents using natural language.

```
search documents neural network training
```
Alternative search command.

**Returns:**
- Top K relevant chunks (default: 5)
- Relevance scores (0-1)
- File paths and names
- Text previews

---

## 📄 Supported File Types

### Documents
- **PDF** (`.pdf`) - Native text extraction + OCR fallback for scanned docs
- **Word** (`.docx`) - Full document text extraction
- **PowerPoint** (`.pptx`) - Slide text extraction
- **Excel** (`.xlsx`) - Cell content extraction

### Text Files
- **Markdown** (`.md`)
- **Plain Text** (`.txt`)
- **JSON/YAML** (`.json`, `.yaml`, `.yml`)

### Code Files
- **Python** (`.py`)
- **JavaScript/TypeScript** (`.js`, `.ts`)
- **HTML/CSS** (`.html`, `.css`)
- **C/C++** (`.c`, `.cpp`, `.h`)
- **Shell** (`.sh`)

### Images (with OCR)
- **PNG** (`.png`)
- **JPEG** (`.jpg`, `.jpeg`)
- **TIFF** (`.tiff`)
- **WebP** (`.webp`)

---

## ⚙️ Configuration

### User Data Location
```
~/MyDrive/claude-skills-data/local-rag/
├── vectordb/              # ChromaDB persistence directory
│   ├── chroma.sqlite3     # Vector database
│   └── [collection-uuid]/ # Collection data
└── state/
    ├── ingest_state.json  # File tracking state
    └── bm25_index.json    # BM25 keyword index
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OCR_ENABLED` | `true` | Enable OCR for images/scanned PDFs |
| `OCR_ENGINE` | `tesseract` | OCR engine (tesseract, surya, deepseek) |
| `OCR_LANG` | `en,he` | Languages for OCR (comma-separated) |
| `OCR_MAX_PAGES` | `120` | Max pages to OCR per PDF |
| `OCR_PAGE_DPI` | `200` | DPI for PDF-to-image conversion |
| `CHUNK_SIZE` | `3000` | Characters per chunk |
| `CHUNK_OVERLAP` | `400` | Overlap between chunks |
| `CHUNKING_STRATEGY` | `template` | Chunking strategy (fixed/sentence/semantic/template) |
| `SEARCH_METHOD` | `hybrid` | Search method (vector/bm25/hybrid) |
| `VECTOR_WEIGHT` | `0.7` | Weight for vector search in hybrid mode |
| `BM25_WEIGHT` | `0.3` | Weight for BM25 search in hybrid mode |
| `USE_RERANKER` | `false` | Enable cross-encoder reranking |

### Embedding Model
Uses `sentence-transformers/all-MiniLM-L6-v2`:
- **Dimensions**: 384
- **Speed**: Fast CPU inference (~100 chunks/sec)
- **Quality**: Good semantic similarity
- **Size**: ~90MB download on first use

### Chunking Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| `fixed` | Character-based with overlap | Simple documents, code |
| `sentence` | Respects sentence boundaries | Prose, articles, books |
| `semantic` | Groups by embedding similarity | Research papers, technical docs |
| `template` | Document-type aware (headers, code blocks) | Markdown, structured docs |

---

## 📊 Example Workflows

### Index a Research Folder
```
User: update rag from ~/Documents/research-papers

Claude: Scanning ~/Documents/research-papers...
        Found 47 PDF files, 12 markdown files

        Processing documents...
        - Extracting text (OCR where needed)
        - Chunking into searchable segments
        - Generating embeddings
        - Building BM25 index

        Indexing complete. Processed 59 files (1,247 chunks).
        Index location: ~/MyDrive/claude-skills-data/local-rag/vectordb/
```

### Search for Information
```
User: query rag neural network training techniques

Claude: Found 5 relevant results:

        1. deep-learning-survey.pdf (score: 0.89)
           Path: ~/Documents/research-papers/dl/deep-learning-survey.pdf

           "...backpropagation remains the primary training algorithm
           for neural networks. Modern variants include Adam, RMSprop,
           and AdaGrad optimizers that adapt learning rates..."

        2. optimization-methods.md (score: 0.84)
           Path: ~/Documents/research-papers/notes/optimization-methods.md

           "...Adam optimizer combines momentum with adaptive learning
           rates, making it particularly effective for training deep
           neural networks with millions of parameters..."

        3. transformer-architecture.pdf (score: 0.78)
           Path: ~/Documents/research-papers/nlp/transformer-architecture.pdf

           "...attention mechanisms enable parallel training of
           sequence models, significantly reducing training time
           compared to recurrent approaches..."
```

### Incremental Update
```
User: update rag from ~/Documents/research-papers

Claude: Scanning for changes...

        Modified files detected:
        - new-paper.pdf (added)
        - updated-notes.md (modified)
        - old-draft.pdf (deleted)

        Indexing 2 changed files...
        Removing 1 deleted file from index...

        Update complete. Processed 2 files (45 new chunks).
        Total index: 60 files, 1,292 chunks.
```

---

## 🔧 Requirements

### Python Dependencies
```
chromadb>=0.4.0
sentence-transformers>=2.2.0
rapidfuzz>=3.0.0
python-dotenv>=1.0.0
pydantic-settings>=2.0.0
pypdf>=3.0.0
pdf2image>=1.16.0
Pillow>=9.0.0
python-docx>=0.8.11
python-pptx>=0.6.21
openpyxl>=3.0.0
ocrmypdf>=15.0.0
pytesseract>=0.3.10
```

### System Dependencies (for OCR)
- **poppler-utils**: PDF to image conversion
- **tesseract**: OCR engine
- **tesseract-lang**: Language packs (e.g., Hebrew)
- **qpdf**: Required by OCRmyPDF
- **ghostscript**: Required by OCRmyPDF
- **antiword**: Legacy .doc extraction (optional)

**Install on macOS:**
```bash
brew install poppler tesseract tesseract-lang antiword qpdf ghostscript
```

**Install on Ubuntu:**
```bash
sudo apt install poppler-utils tesseract-ocr tesseract-ocr-heb antiword qpdf ghostscript
```

---

## 🚨 Limitations

- Files larger than 10MB are skipped (configurable)
- OCR quality depends on document scan quality
- Initial indexing of large directories may take several minutes
- Embedding model download required on first run (~90MB)
- ChromaDB requires ~1MB per 1000 chunks

---

## 🎯 Use Cases

### Research
Index your papers and notes, then ask:
- "What papers discuss reinforcement learning?"
- "Find references about transformer attention mechanisms"
- "What did I write about Python optimization?"

### Documentation
Index your team's docs:
- "How do we handle authentication?"
- "What's the deployment process?"
- "Find examples of error handling"

### Personal Knowledge Base
Index your notes and journals:
- "What were my thoughts on project management?"
- "Find notes from the Q3 planning meeting"
- "What did I learn about React hooks?"

### Learning
Index textbooks and courses:
- "Explain the concept of dynamic programming"
- "Find examples of binary search algorithms"
- "What chapters cover machine learning?"

---

## 📚 Advanced Features

### Hybrid Search
Combines vector similarity (semantic) with BM25 (keyword):
- Vector search finds conceptually related content
- BM25 finds exact keyword matches
- Fusion merges results for best recall and precision

### Cross-Encoder Reranking
Optional second-stage reranking for higher precision:
- Slower but more accurate
- Useful for top-K results
- Enable with `USE_RERANKER=true`

### Incremental Indexing
Smart file tracking:
- Computes file hashes to detect changes
- Only re-indexes modified files
- Removes deleted files from index
- Saves time on large document collections

### Multi-Language OCR
Supports multiple languages:
- English, Hebrew, Spanish, French, German, etc.
- Configure with `OCR_LANG=en,he`
- Automatically maps language codes

---

## 💾 Data Storage

All data stored locally in:
```
~/MyDrive/claude-skills-data/local-rag/
```

**Never commits to git** - this folder is in `.gitignore`

---

## 🤝 Integration

### MCP (Model Context Protocol)
Expose RAG tools to Claude Desktop via MCP server.

**Available MCP tools:**
- `local_rag_index` - Index a directory
- `local_rag_query` - Search the index
- `local_rag_stats` - Get index statistics
- `local_rag_health` - Quick health check

### CLI
Direct command-line usage:
```bash
# Index documents
local-rag index ~/Documents --user-data-dir ~/MyDrive/claude-skills-data/local-rag

# Search
local-rag query "search query" --user-data-dir ~/MyDrive/claude-skills-data/local-rag -k 5

# Visualize chunking
local-rag visualize document.md --strategy template

# Check health
local-rag health --user-data-dir ~/MyDrive/claude-skills-data/local-rag
```

---

## 🔐 Privacy

**100% Local**:
- All processing happens on your machine
- No data sent to cloud services
- No API keys required (after model download)
- Documents never leave your computer
- Perfect for sensitive/confidential information

---

## 📖 Documentation

- **[SKILL.md](SKILL.md)** - Complete skill reference
- **[AI_GUIDE.md](docs/AI_GUIDE.md)** - Guide for AI assistants
- **[Architecture](docs/architecture.md)** - System architecture
- **[Installation](docs/user-guides/installation.md)** - Setup instructions
- **[Usage Guide](docs/user-guides/usage.md)** - Detailed usage

---

## 🎉 Quick Start

1. **Install system dependencies**:
   ```bash
   brew install poppler tesseract tesseract-lang
   ```

2. **Install Python package**:
   ```bash
   cd packages/local-rag
   python3.11 -m pip install --user .
   ```

3. **Index your documents**:
   ```
   update rag from ~/Documents/my-docs
   ```

4. **Search**:
   ```
   query rag how do I configure the API?
   ```

---

**Version**: 2.0.0
**Status**: Stable
**Last Updated**: 2025-11-28
