# Fixture Library Module

## Purpose
Standard fixture SVG templates for architectural floor plans.

## Fixture Catalog

| Category | Fixtures |
|----------|----------|
| Plumbing | Toilet, Sink, Shower, Bathtub, Bidet |
| Kitchen | Counter, Stove, Fridge, Dishwasher |
| Furniture | Bed, Sofa, Table, Chair, Desk |
| Openings | Door, Window, Sliding Door |
| Utilities | Washer, Dryer, Water Heater |

## Standard Dimensions (mm)

```yaml
fixtures:
  toilet:
    width: 380
    depth: 650
    clearance_front: 600
    centerline_from_wall: 400
    
  wall_toilet:
    width: 360
    depth: 550
    projection: 550
    
  sink:
    width: 450
    depth: 350
    
  vanity:
    widths: [600, 750, 900, 1200]
    depth: 450
    sink_offset: center
    
  shower:
    sizes: [[800, 800], [900, 900], [1000, 1000], [900, 1200], [1200, 1200]]
    door_width: 600
    
  bathtub:
    width: 700
    lengths: [1500, 1700, 1800]
    
  bidet:
    width: 360
    depth: 550
    
  door:
    widths: [700, 800, 900]
    thickness: 40
    
  window:
    heights: [600, 900, 1200]
    sill_height: 900
```

## SVG Templates

### Toilet (Top View)

```python
def toilet_svg(width: float, depth: float, wall_mounted: bool = False) -> str:
    """Generate toilet SVG at 1:1 mm scale."""
    if wall_mounted:
        # Wall-mounted: elliptical bowl only
        return f'''<g class="fixture toilet">
            <ellipse cx="{depth/2}" cy="{width/2}" 
                     rx="{depth/2 - 20}" ry="{width/2 - 20}"
                     fill="white" stroke="black" stroke-width="2"/>
            <ellipse cx="{depth/2 + 50}" cy="{width/2}"
                     rx="{depth/4}" ry="{width/4}"
                     fill="white" stroke="black" stroke-width="1"/>
        </g>'''
    else:
        # Floor-mounted: tank + bowl
        tank_depth = 180
        bowl_depth = depth - tank_depth
        return f'''<g class="fixture toilet">
            <!-- Tank -->
            <rect x="0" y="{(width-300)/2}" width="{tank_depth}" height="300"
                  fill="white" stroke="black" stroke-width="2" rx="10"/>
            <!-- Bowl -->
            <ellipse cx="{tank_depth + bowl_depth/2}" cy="{width/2}"
                     rx="{bowl_depth/2 - 10}" ry="{width/2 - 30}"
                     fill="white" stroke="black" stroke-width="2"/>
            <!-- Seat -->
            <ellipse cx="{tank_depth + bowl_depth/2}" cy="{width/2}"
                     rx="{bowl_depth/2 - 40}" ry="{width/2 - 60}"
                     fill="none" stroke="black" stroke-width="1"/>
        </g>'''
```

### Sink / Basin

```python
def sink_svg(width: float, depth: float, shape: str = 'rect') -> str:
    """Generate sink SVG."""
    if shape == 'oval':
        return f'''<g class="fixture sink">
            <rect x="0" y="0" width="{width}" height="{depth}"
                  fill="white" stroke="black" stroke-width="2"/>
            <ellipse cx="{width/2}" cy="{depth/2}" 
                     rx="{width/2 - 40}" ry="{depth/2 - 40}"
                     fill="white" stroke="black" stroke-width="1"/>
            <circle cx="{width/2}" cy="{depth/2}" r="15" fill="black"/>
        </g>'''
    else:
        return f'''<g class="fixture sink">
            <rect x="0" y="0" width="{width}" height="{depth}"
                  fill="white" stroke="black" stroke-width="2"/>
            <rect x="30" y="30" width="{width-60}" height="{depth-60}"
                  fill="white" stroke="black" stroke-width="1" rx="10"/>
            <circle cx="{width/2}" cy="{depth/2}" r="15" fill="black"/>
        </g>'''
```

### Vanity with Sink

```python
def vanity_svg(width: float, depth: float, sink_count: int = 1) -> str:
    """Generate vanity cabinet with sink(s)."""
    sink_width = 350
    sink_depth = 280
    
    svg = f'''<g class="fixture vanity">
        <!-- Cabinet -->
        <rect x="0" y="0" width="{width}" height="{depth}"
              fill="white" stroke="black" stroke-width="2"/>
        <!-- Countertop edge -->
        <line x1="0" y1="5" x2="{width}" y2="5" 
              stroke="black" stroke-width="1"/>'''
    
    if sink_count == 1:
        # Centered sink
        sx = (width - sink_width) / 2
        sy = (depth - sink_depth) / 2
        svg += f'''
        <ellipse cx="{width/2}" cy="{depth/2}" 
                 rx="{sink_width/2}" ry="{sink_depth/2}"
                 fill="white" stroke="black" stroke-width="1"/>
        <circle cx="{width/2}" cy="{depth/2}" r="12" fill="black"/>'''
    else:
        # Two sinks
        offset = width / 4
        for i in range(2):
            cx = offset + i * width / 2
            svg += f'''
        <ellipse cx="{cx}" cy="{depth/2}" 
                 rx="{sink_width/3}" ry="{sink_depth/2}"
                 fill="white" stroke="black" stroke-width="1"/>
        <circle cx="{cx}" cy="{depth/2}" r="10" fill="black"/>'''
    
    svg += '\n    </g>'
    return svg
```

### Shower

```python
def shower_svg(width: float, depth: float, drain_pos: str = 'center') -> str:
    """Generate shower SVG with drainage."""
    svg = f'''<g class="fixture shower">
        <!-- Shower base -->
        <rect x="0" y="0" width="{width}" height="{depth}"
              fill="none" stroke="black" stroke-width="2"/>
        <!-- Diagonal cross (shower symbol) -->
        <line x1="0" y1="0" x2="{width}" y2="{depth}" 
              stroke="black" stroke-width="1" stroke-dasharray="8,4"/>
        <line x1="{width}" y1="0" x2="0" y2="{depth}" 
              stroke="black" stroke-width="1" stroke-dasharray="8,4"/>'''
    
    # Drain position
    if drain_pos == 'center':
        dx, dy = width/2, depth/2
    elif drain_pos == 'linear':
        # Linear drain along one edge
        svg += f'''
        <rect x="10" y="{depth-30}" width="{width-20}" height="20"
              fill="none" stroke="black" stroke-width="1"/>
        <line x1="20" y1="{depth-20}" x2="{width-20}" y2="{depth-20}"
              stroke="black" stroke-width="1" stroke-dasharray="4,2"/>'''
        return svg + '\n    </g>'
    else:
        dx, dy = width/2, depth/2
    
    svg += f'''
        <!-- Drain -->
        <circle cx="{dx}" cy="{dy}" r="20" fill="none" stroke="black" stroke-width="1"/>
        <circle cx="{dx}" cy="{dy}" r="8" fill="black"/>
    </g>'''
    return svg
```

### Door

```python
def door_svg(width: float, swing: str = 'inward', hinge: str = 'left') -> str:
    """Generate door with swing arc."""
    thickness = 40
    
    # Door leaf
    svg = f'''<g class="fixture door">
        <!-- Door frame gap -->
        <rect x="0" y="0" width="{width}" height="10"
              fill="white" stroke="none"/>'''
    
    # Calculate swing arc
    if swing == 'inward':
        if hinge == 'left':
            arc = f'M 0 0 A {width} {width} 0 0 1 {width} {width}'
            leaf = f'<line x1="0" y1="0" x2="0" y2="{width}" stroke="black" stroke-width="{thickness/10}"/>'
        else:
            arc = f'M {width} 0 A {width} {width} 0 0 0 0 {width}'
            leaf = f'<line x1="{width}" y1="0" x2="{width}" y2="{width}" stroke="black" stroke-width="{thickness/10}"/>'
    else:  # outward
        if hinge == 'left':
            arc = f'M 0 0 A {width} {width} 0 0 0 {width} -{width}'
            leaf = f'<line x1="0" y1="0" x2="0" y2="-{width}" stroke="black" stroke-width="{thickness/10}"/>'
        else:
            arc = f'M {width} 0 A {width} {width} 0 0 1 0 -{width}'
            leaf = f'<line x1="{width}" y1="0" x2="{width}" y2="-{width}" stroke="black" stroke-width="{thickness/10}"/>'
    
    svg += f'''
        <!-- Swing arc -->
        <path d="{arc}" fill="none" stroke="black" stroke-width="1" stroke-dasharray="4,2"/>
        <!-- Door leaf -->
        {leaf}
    </g>'''
    return svg
```

### Window

```python
def window_svg(width: float) -> str:
    """Generate window symbol (three parallel lines)."""
    return f'''<g class="fixture window">
        <line x1="0" y1="0" x2="{width}" y2="0" stroke="black" stroke-width="3"/>
        <line x1="0" y1="5" x2="{width}" y2="5" stroke="black" stroke-width="1"/>
        <line x1="0" y1="10" x2="{width}" y2="10" stroke="black" stroke-width="3"/>
    </g>'''
```

## Fixture Factory

```python
FIXTURE_REGISTRY = {
    'toilet': {'func': toilet_svg, 'default': {'width': 380, 'depth': 650}},
    'wall_toilet': {'func': toilet_svg, 'default': {'width': 360, 'depth': 550, 'wall_mounted': True}},
    'sink': {'func': sink_svg, 'default': {'width': 450, 'depth': 350}},
    'vanity': {'func': vanity_svg, 'default': {'width': 900, 'depth': 450}},
    'shower': {'func': shower_svg, 'default': {'width': 900, 'depth': 900}},
    'door': {'func': door_svg, 'default': {'width': 800}},
    'window': {'func': window_svg, 'default': {'width': 1000}},
}

def create_fixture(fixture_type: str, **kwargs) -> str:
    """Create fixture SVG with custom or default dimensions."""
    if fixture_type not in FIXTURE_REGISTRY:
        raise ValueError(f"Unknown fixture: {fixture_type}")
    
    config = FIXTURE_REGISTRY[fixture_type]
    params = {**config['default'], **kwargs}
    
    return config['func'](**params)
```

## Usage

```python
# Generate fixtures
toilet = create_fixture('toilet', width=380, depth=550, wall_mounted=True)
vanity = create_fixture('vanity', width=900, depth=450, sink_count=1)
shower = create_fixture('shower', width=1100, depth=1200, drain_pos='linear')
door = create_fixture('door', width=700, swing='inward', hinge='left')

# Place in SVG with transform
placed_toilet = f'<g transform="translate({x},{y}) rotate({angle})">{toilet}</g>'
```
