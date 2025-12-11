import pytest
import sys
from pathlib import Path

# Add package root to path so we can import modules
# This assumes tests run from repo root or package root
@pytest.fixture(autouse=True)
def add_path():
    pkg_root = Path(__file__).parent.parent
    if str(pkg_root) not in sys.path:
        sys.path.insert(0, str(pkg_root))
