---
name: local-rag
description: Index local folders and semantically search documents using RAG (Retrieval Augmented Generation). Supports PDF, DOCX, PPTX, XLSX, images with OCR, and text files. Uses ChromaDB for persistent vector storage. Triggers - "update rag", "index folder", "query rag", "search documents", "find in documents", "semantic search", "index my files", "rag search".
---

# Local RAG

Index and semantically search local documents using embeddings and ChromaDB.

## Storage

Path: `~/exocortex-data/local-rag/`

## Commands

| Command | Action |
|---------|--------|
| `update rag from [path]` | Index folder |
| `query rag [question]` | Search documents |
| `search documents [query]` | Alternative search |

## Supported Formats

| Type | Formats |
|------|---------|
| Documents | PDF, DOCX, PPTX, XLSX |
| Text | MD, TXT, JSON, YAML |
| Code | PY, JS, TS, HTML, CSS, SH |
| Images (OCR) | PNG, JPEG, TIFF, WebP |

## Features

- **Semantic search**: Find by meaning, not keywords
- **Multi-format**: Documents, code, images
- **OCR support**: Scanned PDFs and images
- **Incremental updates**: Only re-index changed files
- **Persistent storage**: ChromaDB vector database

## Example Usage

```
User: update rag from ~/Documents/research
Claude: Found 47 PDF files, 12 markdown files
        Processed 59 files (1,247 chunks)

User: query rag neural network training
Claude: Found 5 relevant results:
        1. deep-learning-survey.pdf (0.89)
        2. optimization-methods.md (0.84)
```

## Technical Details

- **Embedding model**: all-MiniLM-L6-v2 (~90MB)
- **Chunk size**: 3000 chars, 400 overlap
- **File limit**: 10MB max per file

For setup, dependencies, and configuration, see `references/setup.md`.
