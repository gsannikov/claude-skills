# Input Router Module

## Purpose
Detect input file type and route to appropriate parser module.

## Detection Logic

```python
def detect_input_type(file_path: str) -> str:
    """Detect input type from file extension or content."""
    ext = Path(file_path).suffix.lower()
    
    routing = {
        '.pdf': 'pdf',
        '.dxf': 'cad',
        '.dwg': 'cad',
        '.png': 'image',
        '.jpg': 'image',
        '.jpeg': 'image',
        '.webp': 'image',
    }
    
    if ext in routing:
        return routing[ext]
    
    # Check if ASCII text block
    if is_ascii_floorplan(file_path):
        return 'ascii'
    
    raise ValueError(f"Unsupported input: {ext}")
```

## Router Flow

```
Input File
    │
    ├── .pdf ──────→ modules/pdf-parser.md
    │
    ├── .dxf/.dwg ─→ modules/cad-parser.md
    │
    ├── .png/.jpg ─→ modules/image-parser.md
    │
    └── ASCII ─────→ modules/ascii-parser.md
    
    ↓
Geometry Object (standardized)
    ↓
modules/svg-generator.md
```

## Standardized Geometry Output

All parsers output this structure:

```yaml
geometry:
  walls:
    - start: [x1, y1]
      end: [x2, y2]
      thickness: 100  # mm
      type: exterior|interior
      
  openings:
    - type: door|window
      wall_ref: 0  # wall index
      position: 500  # mm from wall start
      width: 800
      swing: inward|outward|none
      
  fixtures:
    - type: toilet|sink|shower|vanity|...
      center: [x, y]
      rotation: 0  # degrees
      dimensions: [width, depth]
      
  room:
    name: "Bathroom"
    area_sqm: 6.3
    bounds: [x_min, y_min, x_max, y_max]
```

## Usage

```python
# Route and parse
input_type = detect_input_type(file_path)
geometry = parse_by_type(file_path, input_type)

# Generate SVG
svg = generate_svg(geometry, scale="1:50")
```
