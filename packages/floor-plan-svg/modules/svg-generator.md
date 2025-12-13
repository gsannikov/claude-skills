# SVG Generator Module

## Overview

Generate architectural SVG diagrams from normalized geometry data using svgwrite library.

## Scale System

| Scale | px/m | 1px = | Use Case |
|-------|------|-------|----------|
| 1:50 | 40 | 25mm | Detailed rooms |
| 1:100 | 20 | 50mm | Single rooms |
| 1:200 | 10 | 100mm | Apartments |

### Conversion Functions

```python
class ScaleConverter:
    """Convert between mm and pixels at given scale."""
    
    def __init__(self, scale: str = "1:50"):
        self.ratio = int(scale.split(':')[1])
        self.px_per_m = 2000 / self.ratio  # 1m = 2000/ratio px
        self.mm_per_px = self.ratio / 2    # 1px = ratio/2 mm
    
    def mm_to_px(self, mm: float) -> float:
        return mm / 1000 * self.px_per_m
    
    def px_to_mm(self, px: float) -> float:
        return px * self.mm_per_px
    
    def m_to_px(self, m: float) -> float:
        return m * self.px_per_m

# Scale 1:50 example:
# converter = ScaleConverter("1:50")
# converter.mm_to_px(1000) → 40px
# converter.px_to_mm(40) → 1000mm
```

## SVG Structure

### Layer Organization

```svg
<svg viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Patterns, markers, gradients -->
  </defs>
  
  <g id="background">
    <!-- White fill, grid optional -->
  </g>
  
  <g id="room-outline">
    <!-- Floor polygon -->
  </g>
  
  <g id="walls">
    <!-- Wall strokes on polygon -->
  </g>
  
  <g id="openings">
    <!-- Doors, windows -->
  </g>
  
  <g id="fixtures">
    <!-- Toilet, vanity, shower, etc. -->
  </g>
  
  <g id="dimensions">
    <!-- Dimension lines and labels -->
  </g>
  
  <g id="annotations">
    <!-- Room name, scale bar, notes -->
  </g>
</svg>
```

## Core Generation with svgwrite

```python
import svgwrite
from svgwrite import cm, mm

def generate_svg(geometry: dict, output_path: str, scale: str = "1:50") -> str:
    """
    Generate architectural SVG from normalized geometry.
    """
    conv = ScaleConverter(scale)
    
    # Calculate bounds
    vertices = geometry['room']['vertices']
    max_x = max(v[0] for v in vertices)
    max_y = max(v[1] for v in vertices)
    
    # Add margin for dimensions (60px each side)
    margin = 60
    width = conv.mm_to_px(max_x) + margin * 2
    height = conv.mm_to_px(max_y) + margin * 2
    
    # Create SVG
    dwg = svgwrite.Drawing(
        output_path,
        size=(f"{width}px", f"{height}px"),
        viewBox=f"0 0 {width} {height}"
    )
    
    # Add definitions
    add_definitions(dwg)
    
    # Add layers
    add_background(dwg, width, height)
    add_room_outline(dwg, geometry, conv, margin)
    add_walls(dwg, geometry, conv, margin)
    add_openings(dwg, geometry, conv, margin)
    add_fixtures(dwg, geometry, conv, margin)
    add_dimensions(dwg, geometry, conv, margin)
    add_annotations(dwg, geometry, scale, width, height)
    
    dwg.save()
    return output_path
```

## Layer Implementations

### Room Outline

```python
def add_room_outline(dwg, geometry, conv, margin):
    """Draw floor polygon."""
    group = dwg.g(id='room-outline')
    
    # Convert vertices to pixel coordinates
    vertices = geometry['room']['vertices']
    points = [
        (conv.mm_to_px(x) + margin, conv.mm_to_px(y) + margin)
        for x, y in vertices
    ]
    
    # Floor fill
    polygon = dwg.polygon(
        points,
        fill='#fafafa',
        stroke='none'
    )
    group.add(polygon)
    dwg.add(group)
```

### Walls

```python
def add_walls(dwg, geometry, conv, margin):
    """Draw walls as strokes on room outline."""
    group = dwg.g(id='walls')
    
    vertices = geometry['room']['vertices']
    wall_thickness = geometry['walls'].get('thickness', 100)  # mm
    stroke_width = conv.mm_to_px(wall_thickness)
    
    points = [
        (conv.mm_to_px(x) + margin, conv.mm_to_px(y) + margin)
        for x, y in vertices
    ]
    
    # Wall outline
    polygon = dwg.polygon(
        points,
        fill='none',
        stroke='#1a1a1a',
        stroke_width=stroke_width,
        stroke_linejoin='miter'
    )
    group.add(polygon)
    dwg.add(group)
```

### Openings (Doors & Windows)

```python
def add_openings(dwg, geometry, conv, margin):
    """Draw doors and windows."""
    group = dwg.g(id='openings')
    
    for opening in geometry.get('openings', []):
        if opening['type'] == 'door':
            add_door(dwg, group, opening, conv, margin)
        elif opening['type'] == 'window':
            add_window(dwg, group, opening, conv, margin)
    
    dwg.add(group)

def add_door(dwg, group, door, conv, margin):
    """
    Draw door with swing arc.
    Door clears wall and shows 90° swing arc.
    """
    pos = door['position']
    width = conv.mm_to_px(door['width'])
    x = conv.mm_to_px(pos[0]) + margin
    y = conv.mm_to_px(pos[1]) + margin
    swing = door.get('swing', 'inward')
    
    # Door opening (gap in wall) - white rectangle
    opening = dwg.rect(
        insert=(x, y - 2),
        size=(width, 8),
        fill='white',
        stroke='none'
    )
    group.add(opening)
    
    # Door panel
    panel = dwg.line(
        start=(x, y),
        end=(x + width, y),
        stroke='#333',
        stroke_width=2
    )
    group.add(panel)
    
    # Swing arc (90 degrees)
    arc_radius = width
    if 'inward' in swing:
        # Arc curves into room
        arc = dwg.path(
            d=f"M {x},{y} A {arc_radius},{arc_radius} 0 0 1 {x},{y + arc_radius}",
            fill='none',
            stroke='#666',
            stroke_width=0.5,
            stroke_dasharray='2,2'
        )
    group.add(arc)
```

### Fixtures

```python
def add_fixtures(dwg, geometry, conv, margin):
    """Draw bathroom/kitchen fixtures."""
    group = dwg.g(id='fixtures')
    
    for fixture in geometry.get('fixtures', []):
        ftype = fixture['type']
        
        if ftype == 'toilet':
            add_toilet(dwg, group, fixture, conv, margin)
        elif ftype == 'vanity':
            add_vanity(dwg, group, fixture, conv, margin)
        elif ftype == 'shower':
            add_shower(dwg, group, fixture, conv, margin)
        elif ftype == 'bathtub':
            add_bathtub(dwg, group, fixture, conv, margin)
        elif ftype == 'sink':
            add_sink(dwg, group, fixture, conv, margin)
    
    dwg.add(group)

def add_toilet(dwg, group, fixture, conv, margin):
    """Draw wall-hung toilet symbol."""
    pos = fixture['position']
    x = conv.mm_to_px(pos[0]) + margin
    y = conv.mm_to_px(pos[1]) + margin
    
    # Typical wall-hung toilet: 550mm projection, 360mm width
    w = conv.mm_to_px(fixture.get('width', 360))
    h = conv.mm_to_px(fixture.get('depth', 550))
    
    # Tank/cistern rectangle
    tank = dwg.rect(
        insert=(x - w/2, y),
        size=(w, h * 0.3),
        fill='#f5f5f5',
        stroke='#333',
        stroke_width=1
    )
    group.add(tank)
    
    # Bowl (rounded rectangle or ellipse)
    bowl = dwg.ellipse(
        center=(x, y + h * 0.6),
        r=(w/2 - 2, h * 0.35),
        fill='#f5f5f5',
        stroke='#333',
        stroke_width=1
    )
    group.add(bowl)

def add_shower(dwg, group, fixture, conv, margin):
    """Draw shower enclosure with drain."""
    pos = fixture['position']
    dims = fixture['dimensions']
    
    x = conv.mm_to_px(pos[0]) + margin
    y = conv.mm_to_px(pos[1]) + margin
    w = conv.mm_to_px(dims[0])
    h = conv.mm_to_px(dims[1])
    
    # Shower base
    base = dwg.rect(
        insert=(x, y),
        size=(w, h),
        fill='#e8f4f8',
        stroke='#333',
        stroke_width=1
    )
    group.add(base)
    
    # Glass partition (if specified)
    if 'glass-partition' in fixture.get('features', []):
        glass = dwg.line(
            start=(x, y),
            end=(x, y + h),
            stroke='#0066cc',
            stroke_width=2
        )
        group.add(glass)
    
    # Linear drain
    if 'linear-drain' in fixture.get('features', []):
        drain = dwg.rect(
            insert=(x + w * 0.1, y + h - 8),
            size=(w * 0.8, 4),
            fill='#999',
            stroke='#666',
            stroke_width=0.5
        )
        group.add(drain)

def add_vanity(dwg, group, fixture, conv, margin):
    """Draw vanity with sink."""
    pos = fixture['position']
    w = conv.mm_to_px(fixture.get('width', 900))
    d = conv.mm_to_px(fixture.get('depth', 450))
    
    x = conv.mm_to_px(pos[0]) + margin
    y = conv.mm_to_px(pos[1]) + margin
    
    # Cabinet
    cabinet = dwg.rect(
        insert=(x, y),
        size=(w, d),
        fill='#e0d5c5',
        stroke='#333',
        stroke_width=1
    )
    group.add(cabinet)
    
    # Sink basin
    sink = dwg.ellipse(
        center=(x + w/2, y + d/2),
        r=(w * 0.25, d * 0.35),
        fill='#f5f5f5',
        stroke='#333',
        stroke_width=1
    )
    group.add(sink)
    
    # Drain point
    drain = dwg.circle(
        center=(x + w/2, y + d/2),
        r=3,
        fill='#333'
    )
    group.add(drain)
```

## Dimension Lines

```python
def add_dimensions(dwg, geometry, conv, margin):
    """Add dimension lines with measurements."""
    group = dwg.g(id='dimensions')
    
    vertices = geometry['room']['vertices']
    
    # Horizontal dimensions (top/bottom)
    add_horizontal_dims(dwg, group, vertices, conv, margin)
    
    # Vertical dimensions (left/right)
    add_vertical_dims(dwg, group, vertices, conv, margin)
    
    # Fixture dimensions (optional)
    for fixture in geometry.get('fixtures', []):
        if fixture.get('show_dimensions'):
            add_fixture_dims(dwg, group, fixture, conv, margin)
    
    dwg.add(group)

def add_dimension_line(dwg, group, start, end, value_mm, offset=25, vertical=False):
    """
    Draw dimension line with arrows and text.
    """
    x1, y1 = start
    x2, y2 = end
    
    # Offset dimension line from wall
    if vertical:
        x1 -= offset
        x2 -= offset
    else:
        y1 -= offset
        y2 -= offset
    
    # Extension lines
    ext1 = dwg.line(
        start=start,
        end=(x1, y1),
        stroke='#666',
        stroke_width=0.5
    )
    ext2 = dwg.line(
        start=end,
        end=(x2, y2),
        stroke='#666',
        stroke_width=0.5
    )
    group.add(ext1)
    group.add(ext2)
    
    # Dimension line with arrows
    dim_line = dwg.line(
        start=(x1, y1),
        end=(x2, y2),
        stroke='#333',
        stroke_width=0.5,
        marker_start='url(#arrow-start)',
        marker_end='url(#arrow-end)'
    )
    group.add(dim_line)
    
    # Dimension text
    mid_x = (x1 + x2) / 2
    mid_y = (y1 + y2) / 2
    text = dwg.text(
        str(int(value_mm)),
        insert=(mid_x, mid_y - 3),
        font_size='10px',
        font_family='Arial',
        text_anchor='middle',
        fill='#333'
    )
    group.add(text)
```

## Annotations

```python
def add_annotations(dwg, geometry, scale, width, height):
    """Add title, scale bar, north arrow, notes."""
    group = dwg.g(id='annotations')
    
    # Title block (bottom right)
    title = geometry.get('room', {}).get('name', 'Floor Plan')
    title_text = dwg.text(
        title,
        insert=(width - 20, height - 30),
        font_size='14px',
        font_family='Arial',
        font_weight='bold',
        text_anchor='end',
        fill='#1a1a1a'
    )
    group.add(title_text)
    
    # Scale indicator
    scale_text = dwg.text(
        f"Scale {scale}",
        insert=(width - 20, height - 15),
        font_size='10px',
        font_family='Arial',
        text_anchor='end',
        fill='#666'
    )
    group.add(scale_text)
    
    # Scale bar (1 meter reference)
    conv = ScaleConverter(scale)
    bar_width = conv.m_to_px(1)
    bar_y = height - 50
    
    scale_bar = dwg.rect(
        insert=(20, bar_y),
        size=(bar_width, 4),
        fill='#333'
    )
    group.add(scale_bar)
    
    bar_label = dwg.text(
        "1m",
        insert=(20 + bar_width/2, bar_y - 5),
        font_size='8px',
        font_family='Arial',
        text_anchor='middle',
        fill='#333'
    )
    group.add(bar_label)
    
    # North arrow (compass rose)
    add_compass(dwg, group, 40, 40)
    
    dwg.add(group)
```

## Definitions (Markers, Patterns)

```python
def add_definitions(dwg):
    """Add reusable SVG definitions."""
    
    # Arrow markers for dimensions
    arrow_start = dwg.marker(
        id='arrow-start',
        insert=(0, 3),
        size=(6, 6),
        orient='auto'
    )
    arrow_start.add(dwg.path(d='M6,0 L0,3 L6,6 Z', fill='#333'))
    dwg.defs.add(arrow_start)
    
    arrow_end = dwg.marker(
        id='arrow-end',
        insert=(6, 3),
        size=(6, 6),
        orient='auto'
    )
    arrow_end.add(dwg.path(d='M0,0 L6,3 L0,6 Z', fill='#333'))
    dwg.defs.add(arrow_end)
    
    # Tile pattern (optional floor texture)
    tile = dwg.pattern(
        id='tiles',
        size=(20, 20),
        patternUnits='userSpaceOnUse'
    )
    tile.add(dwg.rect((0, 0), (20, 20), fill='#fafafa'))
    tile.add(dwg.line((0, 0), (0, 20), stroke='#eee', stroke_width=0.5))
    tile.add(dwg.line((0, 0), (20, 0), stroke='#eee', stroke_width=0.5))
    dwg.defs.add(tile)
```

## Complete Generation Pipeline

```python
def generate_floor_plan_svg(input_data: dict, output_path: str, options: dict = None) -> str:
    """
    Full pipeline: input → normalize → generate → save
    """
    options = options or {}
    scale = options.get('scale', '1:50')
    
    # Generate SVG
    output = generate_svg(input_data, output_path, scale)
    
    # Optionally generate React artifact
    if options.get('artifact'):
        jsx_output = output_path.replace('.svg', '.jsx')
        generate_react_artifact(input_data, jsx_output, scale)
    
    return output
```
