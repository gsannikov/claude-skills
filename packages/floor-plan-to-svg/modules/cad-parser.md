# CAD Parser Module

## Purpose
Extract floor plan geometry from DXF/DWG CAD files.

## Libraries

```bash
pip install ezdxf --break-system-packages
```

| Library | Format | Notes |
|---------|--------|-------|
| `ezdxf` | DXF | Full read/write support |
| `ezdxf` | DWG | Read-only (recent versions) |

## DXF Structure

```
DXF File
├── HEADER        # Drawing settings, units
├── CLASSES       # Custom object definitions
├── TABLES        # Layers, styles, linetypes
├── BLOCKS        # Block definitions (fixtures)
├── ENTITIES      # Actual geometry (lines, arcs, etc.)
└── OBJECTS       # Non-graphical objects
```

## Basic Extraction

```python
import ezdxf

def parse_dxf(dxf_path: str) -> dict:
    """Extract geometry from DXF file."""
    doc = ezdxf.readfile(dxf_path)
    msp = doc.modelspace()
    
    geometry = {
        'walls': [],
        'openings': [],
        'fixtures': [],
        'annotations': []
    }
    
    # Process all entities
    for entity in msp:
        if entity.dxftype() == 'LINE':
            geometry['walls'].append(parse_line(entity))
        elif entity.dxftype() == 'LWPOLYLINE':
            geometry['walls'].extend(parse_polyline(entity))
        elif entity.dxftype() == 'INSERT':
            geometry['fixtures'].append(parse_block_ref(entity, doc))
        elif entity.dxftype() == 'ARC':
            geometry['openings'].append(parse_arc(entity))
        elif entity.dxftype() in ('TEXT', 'MTEXT'):
            geometry['annotations'].append(parse_text(entity))
    
    return geometry
```

## Entity Parsers

```python
def parse_line(entity) -> dict:
    """Parse LINE entity."""
    return {
        'start': [entity.dxf.start.x, entity.dxf.start.y],
        'end': [entity.dxf.end.x, entity.dxf.end.y],
        'layer': entity.dxf.layer,
        'thickness': get_line_weight(entity)
    }

def parse_polyline(entity) -> list:
    """Parse LWPOLYLINE to wall segments."""
    points = list(entity.get_points('xy'))
    walls = []
    
    for i in range(len(points) - 1):
        walls.append({
            'start': list(points[i]),
            'end': list(points[i + 1]),
            'layer': entity.dxf.layer
        })
    
    # Close polygon if needed
    if entity.closed:
        walls.append({
            'start': list(points[-1]),
            'end': list(points[0]),
            'layer': entity.dxf.layer
        })
    
    return walls

def parse_arc(entity) -> dict:
    """Parse ARC entity (often door swings)."""
    return {
        'type': 'arc',
        'center': [entity.dxf.center.x, entity.dxf.center.y],
        'radius': entity.dxf.radius,
        'start_angle': entity.dxf.start_angle,
        'end_angle': entity.dxf.end_angle,
        'layer': entity.dxf.layer
    }

def parse_block_ref(entity, doc) -> dict:
    """Parse INSERT (block reference) for fixtures."""
    block_name = entity.dxf.name
    
    return {
        'type': classify_block(block_name),
        'name': block_name,
        'position': [entity.dxf.insert.x, entity.dxf.insert.y],
        'rotation': entity.dxf.rotation,
        'scale': [entity.dxf.xscale, entity.dxf.yscale]
    }

def parse_text(entity) -> dict:
    """Parse TEXT/MTEXT for dimensions."""
    if entity.dxftype() == 'MTEXT':
        text = entity.plain_text()
        pos = entity.dxf.insert
    else:
        text = entity.dxf.text
        pos = entity.dxf.insert
    
    return {
        'text': text,
        'position': [pos.x, pos.y],
        'height': entity.dxf.height
    }
```

## Layer-Based Classification

```python
# Common AutoCAD layer naming conventions
LAYER_MAPPING = {
    'A-WALL': 'walls',
    'A-WALL-EXTR': 'walls',
    'A-DOOR': 'openings',
    'A-GLAZ': 'openings',
    'A-FLOR-FIXT': 'fixtures',
    'A-PLMB': 'fixtures',
    'A-DIMS': 'dimensions',
    'A-ANNO': 'annotations'
}

def classify_by_layer(layer_name: str) -> str:
    """Classify entity type by layer name."""
    layer_upper = layer_name.upper()
    
    for pattern, category in LAYER_MAPPING.items():
        if pattern in layer_upper:
            return category
    
    return 'unknown'
```

## Block Classification

```python
FIXTURE_BLOCKS = {
    'toilet': ['WC', 'TOILET', 'CLOSET', 'PAN'],
    'sink': ['SINK', 'BASIN', 'LAVATORY', 'LAV'],
    'shower': ['SHOWER', 'SHWR'],
    'bath': ['BATH', 'TUB', 'BATHTUB'],
    'vanity': ['VANITY', 'COUNTER', 'CABINET'],
    'door': ['DOOR', 'DR', 'ENT'],
    'window': ['WINDOW', 'WIN', 'GLAZ']
}

def classify_block(block_name: str) -> str:
    """Classify block by name patterns."""
    name_upper = block_name.upper()
    
    for fixture_type, patterns in FIXTURE_BLOCKS.items():
        for pattern in patterns:
            if pattern in name_upper:
                return fixture_type
    
    return 'unknown'
```

## Unit Detection

```python
def get_drawing_units(doc) -> dict:
    """Extract drawing units from header."""
    header = doc.header
    
    # INSUNITS: 0=unitless, 1=inches, 2=feet, 4=mm, 5=cm, 6=m
    units_code = header.get('$INSUNITS', 0)
    
    units_map = {
        0: {'name': 'unitless', 'to_mm': 1},
        1: {'name': 'inches', 'to_mm': 25.4},
        2: {'name': 'feet', 'to_mm': 304.8},
        4: {'name': 'mm', 'to_mm': 1},
        5: {'name': 'cm', 'to_mm': 10},
        6: {'name': 'm', 'to_mm': 1000}
    }
    
    return units_map.get(units_code, units_map[0])
```

## Complete Pipeline

```python
def parse_cad_file(file_path: str) -> dict:
    """Complete CAD parsing pipeline."""
    
    doc = ezdxf.readfile(file_path)
    units = get_drawing_units(doc)
    
    # Extract geometry
    raw_geometry = parse_dxf(file_path)
    
    # Convert to mm
    converted = convert_units(raw_geometry, units['to_mm'])
    
    # Calculate bounds
    bounds = calculate_bounds(converted['walls'])
    
    return {
        'walls': converted['walls'],
        'openings': converted['openings'],
        'fixtures': converted['fixtures'],
        'annotations': converted['annotations'],
        'room': {
            'bounds': bounds,
            'area_sqm': calculate_area(converted['walls'])
        },
        'source': file_path,
        'units': units['name']
    }
```

## DWG Support Note

```python
# ezdxf can read some DWG files but not all
# For full DWG support, consider:
# - ODA File Converter (free, command line)
# - LibreDWG (open source)
# - Teigha (commercial)

def convert_dwg_to_dxf(dwg_path: str, output_dir: str) -> str:
    """Convert DWG to DXF using ODA File Converter."""
    import subprocess
    
    # ODA File Converter command
    cmd = [
        'ODAFileConverter',
        os.path.dirname(dwg_path),
        output_dir,
        'ACAD2018', 'DXF', '0', '1',
        os.path.basename(dwg_path)
    ]
    
    subprocess.run(cmd, check=True)
    return os.path.join(output_dir, os.path.basename(dwg_path).replace('.dwg', '.dxf'))
```
