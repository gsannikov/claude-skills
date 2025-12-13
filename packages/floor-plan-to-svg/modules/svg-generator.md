# SVG Generator Module

## Purpose
Generate clean, layered architectural SVG from parsed geometry.

## Libraries

```bash
pip install svgwrite drawsvg cairosvg --break-system-packages
```

| Library | Use Case |
|---------|----------|
| `svgwrite` | Primary SVG generation |
| `drawsvg` | Alternative with better shapes |
| `cairosvg` | SVG to PNG/PDF export |

## Scale Configuration

```python
SCALES = {
    "1:50":  {"px_per_m": 40, "px_per_mm": 0.04},
    "1:100": {"px_per_m": 20, "px_per_mm": 0.02},
    "1:200": {"px_per_m": 10, "px_per_mm": 0.01},
}

def mm_to_px(mm: float, scale: str = "1:50") -> float:
    """Convert millimeters to pixels at given scale."""
    return mm * SCALES[scale]["px_per_mm"]

def m_to_px(m: float, scale: str = "1:50") -> float:
    """Convert meters to pixels at given scale."""
    return m * SCALES[scale]["px_per_m"]
```

## SVG Structure Template

```python
import svgwrite

def create_floorplan_svg(geometry: dict, scale: str = "1:50") -> str:
    """Generate architectural SVG from geometry."""
    
    # Calculate bounds
    bounds = geometry['room']['bounds']
    width = mm_to_px(bounds[2] - bounds[0], scale) + 100  # margin
    height = mm_to_px(bounds[3] - bounds[1], scale) + 100
    
    dwg = svgwrite.Drawing(size=(f"{width}px", f"{height}px"))
    dwg.viewbox(0, 0, width, height)
    
    # Add defs (patterns, markers)
    add_defs(dwg)
    
    # Create layer groups
    g_walls = dwg.g(id="walls")
    g_openings = dwg.g(id="openings")
    g_fixtures = dwg.g(id="fixtures")
    g_dimensions = dwg.g(id="dimensions")
    g_annotations = dwg.g(id="annotations")
    
    # Draw walls
    draw_walls(dwg, g_walls, geometry['walls'], scale)
    
    # Draw openings (doors, windows)
    draw_openings(dwg, g_openings, geometry['openings'], scale)
    
    # Draw fixtures
    draw_fixtures(dwg, g_fixtures, geometry['fixtures'], scale)
    
    # Add dimensions
    add_dimensions(dwg, g_dimensions, geometry, scale)
    
    # Add annotations (scale bar, north arrow, notes)
    add_annotations(dwg, g_annotations, geometry, scale)
    
    # Assemble
    dwg.add(g_walls)
    dwg.add(g_openings)
    dwg.add(g_fixtures)
    dwg.add(g_dimensions)
    dwg.add(g_annotations)
    
    return dwg.tostring()
```

## Wall Drawing

```python
def draw_walls(dwg, group, walls: list, scale: str):
    """Draw walls as filled polygons or thick lines."""
    
    for wall in walls:
        x1, y1 = mm_to_px(wall['start'][0], scale), mm_to_px(wall['start'][1], scale)
        x2, y2 = mm_to_px(wall['end'][0], scale), mm_to_px(wall['end'][1], scale)
        thickness = mm_to_px(wall.get('thickness', 100), scale)
        
        # Draw as thick line
        line = dwg.line(
            start=(x1, y1), end=(x2, y2),
            stroke='black',
            stroke_width=thickness,
            stroke_linecap='square'
        )
        group.add(line)
```

## Room Polygon Method (Preferred)

```python
def draw_room_polygon(dwg, group, vertices: list, scale: str):
    """Draw room as polygon with stroke for walls."""
    
    points = [(mm_to_px(v[0], scale), mm_to_px(v[1], scale)) 
              for v in vertices]
    
    polygon = dwg.polygon(
        points=points,
        fill='white',
        stroke='black',
        stroke_width=3  # 75mm at 1:50
    )
    group.add(polygon)
```

## Opening Symbols

```python
def draw_door(dwg, group, opening: dict, scale: str):
    """Draw door with swing arc."""
    x, y = mm_to_px(opening['position'][0], scale), mm_to_px(opening['position'][1], scale)
    width = mm_to_px(opening['width'], scale)
    
    # Door leaf (line)
    leaf = dwg.line(start=(x, y), end=(x + width, y), stroke='black', stroke_width=2)
    
    # Swing arc
    if opening.get('swing') == 'inward':
        arc = dwg.path(d=f"M {x} {y} A {width} {width} 0 0 1 {x + width} {y + width}")
        arc.stroke('black').stroke_width(1).fill('none')
        group.add(arc)
    
    group.add(leaf)

def draw_window(dwg, group, opening: dict, scale: str):
    """Draw window symbol (double line)."""
    x, y = mm_to_px(opening['position'][0], scale), mm_to_px(opening['position'][1], scale)
    width = mm_to_px(opening['width'], scale)
    
    # Window symbol: three parallel lines
    for offset in [-2, 0, 2]:
        line = dwg.line(start=(x, y + offset), end=(x + width, y + offset),
                       stroke='black', stroke_width=1)
        group.add(line)
```

## Fixture Rendering

```python
FIXTURE_TEMPLATES = {
    'toilet': """<g transform="translate({x},{y}) rotate({rot})">
        <ellipse cx="0" cy="0" rx="{w}" ry="{d}" fill="white" stroke="black" stroke-width="1"/>
        <ellipse cx="0" cy="-{d2}" rx="{w2}" ry="{d3}" fill="white" stroke="black" stroke-width="1"/>
    </g>""",
    
    'sink': """<g transform="translate({x},{y}) rotate({rot})">
        <rect x="-{hw}" y="-{hd}" width="{w}" height="{d}" fill="white" stroke="black"/>
        <ellipse cx="0" cy="0" rx="{sr}" ry="{sr}" fill="none" stroke="black"/>
    </g>""",
    
    'shower': """<g transform="translate({x},{y}) rotate({rot})">
        <rect x="0" y="0" width="{w}" height="{d}" fill="none" stroke="black" stroke-width="1"/>
        <line x1="0" y1="0" x2="{w}" y2="{d}" stroke="black" stroke-dasharray="4,2"/>
        <line x1="{w}" y1="0" x2="0" y2="{d}" stroke="black" stroke-dasharray="4,2"/>
        <circle cx="{cx}" cy="{cy}" r="3" fill="black"/>
    </g>""",
    
    'vanity': """<g transform="translate({x},{y}) rotate({rot})">
        <rect x="0" y="0" width="{w}" height="{d}" fill="white" stroke="black"/>
        <ellipse cx="{cx}" cy="{cy}" rx="{sr}" ry="{sr}" fill="none" stroke="black"/>
    </g>"""
}
```

## Dimension Lines

```python
def add_dimension_line(dwg, group, start: tuple, end: tuple, label: str, offset: int = 15):
    """Add dimension line with arrows and label."""
    x1, y1 = start
    x2, y2 = end
    
    # Extension lines
    group.add(dwg.line(start=(x1, y1), end=(x1, y1 - offset), stroke='black', stroke_width=0.5))
    group.add(dwg.line(start=(x2, y2), end=(x2, y2 - offset), stroke='black', stroke_width=0.5))
    
    # Dimension line with arrows
    mid_y = y1 - offset + 5
    group.add(dwg.line(start=(x1, mid_y), end=(x2, mid_y), stroke='black', stroke_width=0.5,
                       marker_start='url(#arrow-start)', marker_end='url(#arrow-end)'))
    
    # Label
    mid_x = (x1 + x2) / 2
    text = dwg.text(label, insert=(mid_x, mid_y - 3), text_anchor='middle',
                    font_size='8px', font_family='Arial')
    group.add(text)
```

## Complete Example

```python
def generate_bathroom_svg(geometry: dict) -> str:
    """Generate bathroom floor plan SVG."""
    
    dwg = svgwrite.Drawing(size=("300px", "400px"))
    dwg.viewbox(0, 0, 300, 400)
    
    # Room polygon (L-shape bathroom)
    vertices = [
        (0, 0), (68, 0), (68, 148), 
        (24, 148), (24, 100), (0, 100)
    ]
    
    walls = dwg.g(id="walls")
    walls.add(dwg.polygon(points=vertices, fill="white", stroke="black", stroke_width=3))
    
    # Fixtures
    fixtures = dwg.g(id="fixtures")
    # ... add toilet, vanity, shower
    
    dwg.add(walls)
    dwg.add(fixtures)
    
    return dwg.tostring()
```

## Output Options

| Format | Method |
|--------|--------|
| SVG string | `dwg.tostring()` |
| SVG file | `dwg.saveas(path)` |
| PNG | `cairosvg.svg2png(svg_string)` |
| React artifact | Embed in JSX template |
