"""Storage abstractions for Local RAG."""

from .repository import VectorStoreRepository, create_repository

__all__ = ["VectorStoreRepository", "create_repository"]
