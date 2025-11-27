"""
Compatibility shims for runtime dependencies.

Older libraries expect ``pydantic.BaseSettings`` which was moved to
``pydantic_settings`` in pydantic v2. We patch it back in so that
those imports keep working without downgrading Python.
"""

try:
    import pydantic
    from pydantic_settings import BaseSettings

    # Pydantic 2 raises on hasattr for removed attributes, so assign directly.
    pydantic.BaseSettings = BaseSettings  # type: ignore[attr-defined]
except Exception:
    # If anything fails, we fall back silently; the calling code will raise.
    pass
