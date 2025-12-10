"""
Shared test fixtures for skill validation tests.
"""

import pytest
from pathlib import Path


@pytest.fixture
def repo_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).parent.parent.parent


@pytest.fixture
def packages_dir(repo_root: Path) -> Path:
    """Return the packages directory."""
    return repo_root / "packages"


@pytest.fixture
def all_skill_dirs(packages_dir: Path) -> list[Path]:
    """Return all skill directories in packages/."""
    return [
        d for d in packages_dir.iterdir()
        if d.is_dir() and not d.name.startswith(".")
    ]


@pytest.fixture
def shared_dir(repo_root: Path) -> Path:
    """Return the shared directory."""
    return repo_root / "shared"
