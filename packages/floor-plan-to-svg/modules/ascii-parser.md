# ASCII Parser Module

## Purpose
Parse text-based floor plan representations into geometry.

## Input Formats

### Format 1: Box Drawing Characters

```
┌────────┬────────┐
│        │        │
│  Room1 │  Room2 │
│        │        │
├────────┼────────┤
│        │        │
│  Room3 │  Room4 │
│        │        │
└────────┴────────┘
```

### Format 2: Simple ASCII

```
+--------+--------+
|        |        |
|  BR    |  BATH  |
|        D        |
+---D----+--------+
|                 |
|     LIVING      |
|                 |
+-----------------+
```

### Format 3: Coordinate List

```
Room: Bathroom
Vertices (m):
  A: 0, 0
  B: 1.7, 0
  C: 1.7, 3.7
  D: 0.6, 3.7
  E: 0.6, 2.5
  F: 0, 2.5

Fixtures:
  - toilet: west wall, 0.4m from north
  - vanity: east wall, center, 0.9m wide
  - door: west wall, 0.1m from north, 0.7m wide
```

## Box Drawing Parser

```python
# Box drawing characters
WALL_CHARS = '─│┌┐└┘├┤┬┴┼━║╔╗╚╝╠╣╦╩╬'
DOOR_CHARS = 'Dd'
WINDOW_CHARS = 'Ww='

def parse_box_drawing(text: str, scale_mm_per_char: float = 100) -> dict:
    """Parse box drawing ASCII into geometry."""
    lines = text.strip().split('\n')
    height = len(lines)
    width = max(len(line) for line in lines)
    
    walls = []
    openings = []
    labels = []
    
    for y, line in enumerate(lines):
        for x, char in enumerate(line):
            if char in '─━':
                # Horizontal wall segment
                walls.append({
                    'start': [x * scale_mm_per_char, y * scale_mm_per_char],
                    'end': [(x + 1) * scale_mm_per_char, y * scale_mm_per_char],
                    'type': 'horizontal'
                })
            elif char in '│║':
                # Vertical wall segment
                walls.append({
                    'start': [x * scale_mm_per_char, y * scale_mm_per_char],
                    'end': [x * scale_mm_per_char, (y + 1) * scale_mm_per_char],
                    'type': 'vertical'
                })
            elif char in DOOR_CHARS:
                openings.append({
                    'type': 'door',
                    'position': [x * scale_mm_per_char, y * scale_mm_per_char],
                    'direction': 'detect'
                })
            elif char in WINDOW_CHARS:
                openings.append({
                    'type': 'window',
                    'position': [x * scale_mm_per_char, y * scale_mm_per_char]
                })
    
    # Merge continuous wall segments
    walls = merge_wall_segments(walls)
    
    # Extract room labels
    labels = extract_text_labels(lines)
    
    return {
        'walls': walls,
        'openings': openings,
        'labels': labels,
        'bounds': [0, 0, width * scale_mm_per_char, height * scale_mm_per_char]
    }
```

## Coordinate List Parser

```python
import re

def parse_coordinate_list(text: str) -> dict:
    """Parse coordinate-based floor plan description."""
    
    geometry = {
        'vertices': [],
        'fixtures': [],
        'openings': [],
        'room': {}
    }
    
    # Extract room name
    room_match = re.search(r'Room:\s*(\w+)', text)
    if room_match:
        geometry['room']['name'] = room_match.group(1)
    
    # Extract vertices
    vertex_pattern = r'([A-Z]):\s*([\d.]+)\s*,\s*([\d.]+)'
    for match in re.finditer(vertex_pattern, text):
        label, x, y = match.groups()
        geometry['vertices'].append({
            'label': label,
            'x': float(x) * 1000,  # Convert m to mm
            'y': float(y) * 1000
        })
    
    # Extract fixtures
    fixture_pattern = r'-\s*(toilet|sink|vanity|shower|bath|bidet):\s*(.+)'
    for match in re.finditer(fixture_pattern, text, re.IGNORECASE):
        fixture_type, description = match.groups()
        geometry['fixtures'].append({
            'type': fixture_type.lower(),
            'description': description.strip()
        })
    
    # Extract door
    door_pattern = r'-\s*door:\s*(.+)'
    door_match = re.search(door_pattern, text, re.IGNORECASE)
    if door_match:
        geometry['openings'].append({
            'type': 'door',
            'description': door_match.group(1).strip()
        })
    
    # Convert vertices to walls
    geometry['walls'] = vertices_to_walls(geometry['vertices'])
    
    return geometry

def vertices_to_walls(vertices: list) -> list:
    """Convert vertex list to wall segments."""
    walls = []
    n = len(vertices)
    
    for i in range(n):
        v1 = vertices[i]
        v2 = vertices[(i + 1) % n]
        
        walls.append({
            'start': [v1['x'], v1['y']],
            'end': [v2['x'], v2['y']],
            'thickness': 100
        })
    
    return walls
```

## Natural Language Parser

```python
def parse_natural_description(text: str) -> dict:
    """Parse natural language floor plan description using Claude."""
    
    # This is processed by Claude directly
    # Returns structured geometry from descriptions like:
    # "L-shaped bathroom, 1.7m x 3.7m with a step at 2.5m.
    #  Toilet on west wall, vanity on east wall, shower in SE corner."
    
    prompt = f"""
    Parse this floor plan description into structured geometry:
    
    {text}
    
    Return YAML with:
    - room shape (rectangle, L-shape, etc.)
    - dimensions in mm
    - vertices as coordinates
    - fixtures with positions
    - openings (doors/windows)
    """
    
    # Claude returns structured YAML
    return parse_yaml_response(response)
```

## Position Parser

```python
def parse_position_description(description: str, room_bounds: list) -> tuple:
    """Parse position descriptions like 'west wall, 0.4m from north'."""
    
    x_min, y_min, x_max, y_max = room_bounds
    width = x_max - x_min
    height = y_max - y_min
    
    # Parse wall reference
    wall = None
    if 'west' in description.lower():
        wall = 'west'
        x = x_min
    elif 'east' in description.lower():
        wall = 'east'
        x = x_max
    elif 'north' in description.lower():
        wall = 'north'
        y = y_min
    elif 'south' in description.lower():
        wall = 'south'
        y = y_max
    
    # Parse offset
    offset_match = re.search(r'([\d.]+)\s*m?\s*from\s*(north|south|east|west)', description.lower())
    if offset_match:
        offset_m = float(offset_match.group(1))
        offset_mm = offset_m * 1000
        direction = offset_match.group(2)
        
        if wall in ('west', 'east'):
            if direction == 'north':
                y = y_min + offset_mm
            elif direction == 'south':
                y = y_max - offset_mm
        else:
            if direction == 'west':
                x = x_min + offset_mm
            elif direction == 'east':
                x = x_max - offset_mm
    
    # Parse 'center'
    if 'center' in description.lower():
        if wall in ('west', 'east'):
            y = y_min + height / 2
        else:
            x = x_min + width / 2
    
    return (x, y)
```

## Full Pipeline

```python
def parse_ascii(input_text: str) -> dict:
    """Auto-detect format and parse ASCII floor plan."""
    
    # Detect format
    if any(char in input_text for char in WALL_CHARS):
        return parse_box_drawing(input_text)
    elif re.search(r'[A-Z]:\s*[\d.]+\s*,\s*[\d.]+', input_text):
        return parse_coordinate_list(input_text)
    else:
        return parse_natural_description(input_text)
```

## Example Usage

```python
# Box drawing input
ascii_plan = """
┌────────────────────┐
│                    │
│      BATHROOM      │
│                    │
│    ┌──────────────┤
│    │              │
│    │   SHOWER     │
│    │              │
└────┴──────────────┘
"""

geometry = parse_ascii(ascii_plan)

# Coordinate list input
coord_plan = """
Room: Bathroom
Vertices (m):
  A: 0, 0
  B: 1.7, 0
  C: 1.7, 3.7
  D: 0.6, 3.7
  E: 0.6, 2.5
  F: 0, 2.5
"""

geometry = parse_ascii(coord_plan)
```
