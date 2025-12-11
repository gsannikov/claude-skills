import sys
import os
from pathlib import Path

# Add all package roots to sys.path to allow imports during collection
root = Path(__file__).parent
packages_dir = root / "packages"

if packages_dir.exists():
    for package in packages_dir.iterdir():
        if package.is_dir():
            if str(package) not in sys.path:
                sys.path.insert(0, str(package))
