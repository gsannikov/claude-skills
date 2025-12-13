"""
Path Configuration for Floor Plan SVG Skill
"""

import sys
from pathlib import Path

# Add project root to path to import shared config
_project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(_project_root))

try:
    from shared.config.paths import get_skill_data_dir
    USER_DATA_BASE = str(get_skill_data_dir("floor-plan-svg"))
except ImportError:
    # Fallback if shared config not available
    USER_DATA_BASE = str(Path.home() / "exocortex-data" / "floor-plan-svg")

# ============================================
# Derived Paths
# ============================================

# Main directories
PROJECTS_DIR = f"{USER_DATA_BASE}/projects"
EXPORTS_DIR = f"{USER_DATA_BASE}/exports"
FIXTURES_DIR = f"{USER_DATA_BASE}/fixtures"
TEMPLATES_DIR = f"{USER_DATA_BASE}/templates"

# Configuration
CONFIG_PATH = f"{USER_DATA_BASE}/config.yaml"

# Skill package paths
SKILL_BASE = str(Path(__file__).parent.parent)
MODULES_BASE = f"{SKILL_BASE}/modules"
SCRIPTS_BASE = f"{SKILL_BASE}/scripts"
SKILL_TEMPLATES = f"{SKILL_BASE}/templates"

# ============================================
# Scale Configuration
# ============================================

SCALE_PRESETS = {
    "1:20": {"px_per_m": 100, "mm_per_px": 10, "use_case": "Detail drawings"},
    "1:50": {"px_per_m": 40, "mm_per_px": 25, "use_case": "Room plans (default)"},
    "1:100": {"px_per_m": 20, "mm_per_px": 50, "use_case": "Floor plans"},
    "1:200": {"px_per_m": 10, "mm_per_px": 100, "use_case": "Building overview"},
}

DEFAULT_SCALE = "1:50"

# ============================================
# Default Fixture Dimensions (mm)
# ============================================

FIXTURE_DEFAULTS = {
    "toilet": {"width": 360, "depth": 550, "model": "wall-hung"},
    "toilet_floor": {"width": 380, "depth": 700, "model": "floor-mounted"},
    "vanity_single": {"width": 900, "depth": 450},
    "vanity_double": {"width": 1200, "depth": 550},
    "shower_small": {"width": 800, "depth": 800},
    "shower_standard": {"width": 900, "depth": 900},
    "shower_large": {"width": 1200, "depth": 1200},
    "bathtub": {"width": 700, "depth": 1700},
    "sink_wall": {"width": 500, "depth": 400},
    "door_standard": {"width": 700},
    "door_wide": {"width": 800},
    "window_standard": {"width": 1000},
}

# ============================================
# SVG Styling
# ============================================

SVG_STYLES = {
    "wall_color": "#1a1a1a",
    "wall_thickness": 100,  # mm (converted to px at scale)
    "floor_fill": "#fafafa",
    "dimension_color": "#333333",
    "dimension_font": "Arial",
    "dimension_size": 10,
    "fixture_stroke": "#333333",
    "fixture_fill": "#f5f5f5",
    "shower_fill": "#e8f4f8",
    "glass_color": "#0066cc",
    "drain_color": "#999999",
}

# ============================================
# Path Utilities
# ============================================

def ensure_directories():
    """Create required directories if they don't exist."""
    import os
    
    dirs = [
        USER_DATA_BASE,
        PROJECTS_DIR,
        EXPORTS_DIR,
        FIXTURES_DIR,
        TEMPLATES_DIR,
    ]
    
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)
    
    return True


def get_project_path(project_name: str) -> str:
    """Get path for a specific project."""
    return f"{PROJECTS_DIR}/{project_name}"


def get_export_path(filename: str) -> str:
    """Get path for export file."""
    return f"{EXPORTS_DIR}/{filename}"


def get_all_paths() -> dict:
    """Get dictionary of all configured paths."""
    return {
        "user_data_base": USER_DATA_BASE,
        "projects_dir": PROJECTS_DIR,
        "exports_dir": EXPORTS_DIR,
        "fixtures_dir": FIXTURES_DIR,
        "templates_dir": TEMPLATES_DIR,
        "config_path": CONFIG_PATH,
        "skill_base": SKILL_BASE,
        "modules_base": MODULES_BASE,
        "scripts_base": SCRIPTS_BASE,
    }


if __name__ == "__main__":
    print("Floor Plan SVG - Path Configuration\n")
    print("=" * 50)
    
    ensure_directories()
    print("✅ All directories created\n")
    
    print("Configured Paths:")
    print("=" * 50)
    for name, path in get_all_paths().items():
        print(f"{name:.<30} {path}")
