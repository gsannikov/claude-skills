# Floor Plan to SVG Configuration

# Default paths (relative to ~/exocortex-data/floor-plan-to-svg/)
STORAGE_ROOT = "~/exocortex-data/floor-plan-to-svg"

PATHS = {
    "projects": f"{STORAGE_ROOT}/projects",
    "fixtures": f"{STORAGE_ROOT}/fixtures",
    "templates": f"{STORAGE_ROOT}/templates",
    "config": f"{STORAGE_ROOT}/config.yaml",
    "output": "/mnt/user-data/outputs"
}

# Scale presets
SCALES = {
    "1:50": {
        "px_per_m": 40,
        "px_per_mm": 0.04,
        "mm_per_px": 25,
        "use_case": "Detailed room plans"
    },
    "1:100": {
        "px_per_m": 20,
        "px_per_mm": 0.02,
        "mm_per_px": 50,
        "use_case": "Apartment layouts"
    },
    "1:200": {
        "px_per_m": 10,
        "px_per_mm": 0.01,
        "mm_per_px": 100,
        "use_case": "Full floor plans"
    }
}

# Default drawing settings
DRAWING_DEFAULTS = {
    "scale": "1:50",
    "wall_thickness_mm": 100,
    "interior_wall_thickness_mm": 75,
    "stroke_width": 3,
    "dimension_offset": 20,
    "font_family": "Arial",
    "font_size_label": 10,
    "font_size_dimension": 8
}

# Fixture dimensions (mm)
FIXTURE_SIZES = {
    "toilet": {"width": 380, "depth": 650},
    "wall_toilet": {"width": 360, "depth": 550},
    "sink": {"width": 450, "depth": 350},
    "vanity_600": {"width": 600, "depth": 450},
    "vanity_900": {"width": 900, "depth": 450},
    "vanity_1200": {"width": 1200, "depth": 450},
    "shower_900": {"width": 900, "depth": 900},
    "shower_1000": {"width": 1000, "depth": 1000},
    "shower_900x1200": {"width": 900, "depth": 1200},
    "bathtub_1500": {"width": 700, "depth": 1500},
    "bathtub_1700": {"width": 700, "depth": 1700},
    "door_700": {"width": 700},
    "door_800": {"width": 800},
    "door_900": {"width": 900}
}
