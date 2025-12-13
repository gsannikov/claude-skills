# Input Parser Module

## Overview

Parse floor plan inputs from various formats into normalized geometry data.

## Input Detection

```python
def detect_input_type(file_path: str) -> str:
    """Detect input format from file extension or content."""
    ext = Path(file_path).suffix.lower()
    
    type_map = {
        '.pdf': 'pdf',
        '.dxf': 'cad',
        '.dwg': 'cad',
        '.jpg': 'image',
        '.jpeg': 'image',
        '.png': 'image',
        '.json': 'spec',
        '.yaml': 'spec',
    }
    return type_map.get(ext, 'unknown')
```

## PDF Parsing

### Using PyMuPDF (fitz)

```python
import fitz  # PyMuPDF

def extract_from_pdf(pdf_path: str) -> dict:
    """
    Extract floor plan geometry from PDF.
    Returns structured geometry data.
    """
    doc = fitz.open(pdf_path)
    page = doc[0]  # First page
    
    # Extract vector paths (lines, rectangles)
    paths = page.get_drawings()
    
    # Extract text annotations
    text_blocks = page.get_text("dict")["blocks"]
    
    # Extract images if embedded
    images = page.get_images()
    
    geometry = {
        'paths': parse_paths(paths),
        'text': parse_text_blocks(text_blocks),
        'bounds': page.rect,
        'source': 'pdf'
    }
    
    return geometry
```

### Path Analysis

```python
def parse_paths(paths: list) -> dict:
    """
    Analyze PDF paths to identify walls, openings, fixtures.
    """
    walls = []
    openings = []
    
    for path in paths:
        # Walls: thick lines or filled rectangles
        if path['width'] >= 2 or path['fill']:
            walls.append({
                'type': 'wall',
                'points': path['items'],
                'thickness': path['width']
            })
        # Openings: arcs (doors) or gaps
        elif 'c' in str(path['items']):  # Curves
            openings.append({
                'type': 'door_swing',
                'path': path['items']
            })
    
    return {'walls': walls, 'openings': openings}
```

## CAD (DXF) Parsing

### Using ezdxf

```python
import ezdxf

def extract_from_dxf(dxf_path: str) -> dict:
    """
    Extract geometry from DXF file.
    """
    doc = ezdxf.readfile(dxf_path)
    msp = doc.modelspace()
    
    geometry = {
        'walls': [],
        'openings': [],
        'fixtures': [],
        'dimensions': [],
        'source': 'dxf'
    }
    
    # Extract by layer
    for entity in msp:
        layer = entity.dxf.layer.upper()
        
        if entity.dxftype() == 'LINE':
            line = {
                'start': (entity.dxf.start.x, entity.dxf.start.y),
                'end': (entity.dxf.end.x, entity.dxf.end.y)
            }
            if 'WALL' in layer:
                geometry['walls'].append(line)
            elif 'DOOR' in layer or 'WINDOW' in layer:
                geometry['openings'].append(line)
                
        elif entity.dxftype() == 'LWPOLYLINE':
            points = [(p[0], p[1]) for p in entity.get_points()]
            geometry['walls'].append({'type': 'polyline', 'points': points})
            
        elif entity.dxftype() == 'CIRCLE':
            geometry['fixtures'].append({
                'type': 'circle',
                'center': (entity.dxf.center.x, entity.dxf.center.y),
                'radius': entity.dxf.radius
            })
    
    return geometry
```

### Layer Mapping

| DXF Layer | Interpretation |
|-----------|----------------|
| A-WALL-* | Walls |
| A-DOOR-* | Doors |
| A-GLAZ-* | Windows |
| A-FLOR-* | Floor outline |
| A-PLMB-* | Plumbing fixtures |
| A-FURN-* | Furniture |

## Image/Photo Parsing

### Vision-Based Extraction

For photos of floor plans, use Claude's vision capabilities:

```python
def extract_from_image(image_path: str) -> dict:
    """
    Use vision model to extract floor plan geometry from photo.
    Returns structured prompt for Claude vision analysis.
    """
    prompt = """
    Analyze this floor plan image and extract:
    
    1. **Room Outline**: List all vertices as coordinates (estimate in mm)
    2. **Walls**: Thickness and positions
    3. **Openings**: Doors (with swing direction), windows
    4. **Fixtures**: Toilets, sinks, showers, bathtubs with positions
    5. **Dimensions**: Any visible measurements
    
    Output as structured JSON:
    {
        "room": {
            "vertices": [[x1,y1], [x2,y2], ...],
            "unit": "mm"
        },
        "walls": [{"from": [x,y], "to": [x,y], "thickness": mm}],
        "openings": [{"type": "door|window", "position": [x,y], "width": mm}],
        "fixtures": [{"type": "toilet|sink|shower", "position": [x,y], "dimensions": [w,h]}]
    }
    """
    return {'prompt': prompt, 'image': image_path, 'source': 'vision'}
```

### OCR for Dimensions

```python
def extract_dimensions_ocr(image_path: str) -> list:
    """
    Extract dimension text from floor plan image.
    Look for patterns like: 1700, 2.5m, 1'6", etc.
    """
    import re
    
    # Dimension patterns
    patterns = [
        r'(\d{3,4})\s*(?:mm)?',      # 1700, 1700mm
        r'(\d+\.?\d*)\s*m',           # 2.5m, 3m
        r'(\d+)\s*cm',                # 170cm
        r"(\d+)'(\d+)\"?",            # 5'6"
    ]
    
    # Use vision/OCR to get text, then match patterns
    # Returns list of dimension values normalized to mm
```

## JSON/YAML Spec Parsing

### Direct Specification Format

```yaml
# floor-plan-spec.yaml
room:
  name: "Bathroom"
  scale: "1:50"
  vertices:
    - [0, 0]       # NW corner
    - [1700, 0]    # NE
    - [1700, 3700] # SE
    - [600, 3700]  # Step
    - [600, 2500]
    - [0, 2500]    # SW

walls:
  thickness: 100  # mm

openings:
  - type: door
    wall: west
    offset: 100   # from north
    width: 700
    swing: inward-north

fixtures:
  - type: toilet
    position: [400, 800]  # centerline from walls
    model: wall-hung
    
  - type: vanity
    wall: east
    width: 900
    depth: 450
    
  - type: shower
    corner: SE
    dimensions: [1100, 1200]
    features: [glass-partition, linear-drain]
```

### Parser

```python
import yaml

def parse_spec(spec_path: str) -> dict:
    """
    Parse JSON/YAML floor plan specification.
    """
    with open(spec_path) as f:
        if spec_path.endswith('.yaml'):
            spec = yaml.safe_load(f)
        else:
            spec = json.load(f)
    
    # Normalize to internal geometry format
    geometry = {
        'room': {
            'vertices': spec['room']['vertices'],
            'scale': parse_scale(spec['room'].get('scale', '1:50'))
        },
        'walls': {'thickness': spec['walls']['thickness']},
        'openings': spec.get('openings', []),
        'fixtures': spec.get('fixtures', []),
        'source': 'spec'
    }
    
    return geometry
```

## Output: Normalized Geometry

All parsers output this standardized format:

```python
NormalizedGeometry = {
    'room': {
        'vertices': list[tuple[float, float]],  # mm coordinates
        'bounds': {'width': float, 'height': float},
    },
    'walls': {
        'thickness': float,  # mm
        'segments': list[dict]  # individual wall segments
    },
    'openings': list[{
        'type': str,  # 'door' | 'window'
        'position': tuple[float, float],
        'width': float,
        'properties': dict  # swing direction, etc.
    }],
    'fixtures': list[{
        'type': str,  # 'toilet' | 'sink' | 'shower' | etc.
        'position': tuple[float, float],
        'dimensions': tuple[float, float],
        'rotation': float,
        'properties': dict
    }],
    'dimensions': list[{
        'value': float,
        'unit': str,
        'position': tuple  # for display
    }],
    'source': str,  # 'pdf' | 'dxf' | 'vision' | 'spec'
    'scale': {
        'ratio': str,  # '1:50'
        'px_per_m': float  # 40
    }
}
```
