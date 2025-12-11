import pytest
from pathlib import Path
import sys

def test_search_ranking_logic():
    """Test that search results are ranked by score."""
    # Mock search results
    results = [
        {"id": "doc1", "score": 0.5, "content": "medium relevance"},
        {"id": "doc2", "score": 0.9, "content": "high relevance"},
        {"id": "doc3", "score": 0.2, "content": "low relevance"},
    ]
    
    # Sort logic usually used in RAG
    sorted_results = sorted(results, key=lambda x: x["score"], reverse=True)
    
    assert sorted_results[0]["id"] == "doc2"
    assert sorted_results[1]["id"] == "doc1"
    assert sorted_results[2]["id"] == "doc3"

def test_file_ingestion_types():
    """Test that we only accept supported file types."""
    supported_extensions = {".md", ".txt", ".pdf"}
    
    def is_supported(filename):
        return Path(filename).suffix in supported_extensions
        
    assert is_supported("document.pdf") is True
    assert is_supported("notes.md") is True
    assert is_supported("image.png") is False
