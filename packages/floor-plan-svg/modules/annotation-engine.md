# Annotation Engine Module

## Overview

Add architectural annotations: dimension lines, labels, symbols, and legends to SVG floor plans.

## Dimension Lines

### Types

| Type | Use |
|------|-----|
| Linear | Wall lengths, fixture sizes |
| Aligned | Angled measurements |
| Chain | Series of dimensions |
| Ordinate | Reference point distances |

### Dimension Line Components

```
    ←──── 1700 ────→
    │               │
    ▼               ▼
    ┌───────────────┐
```

1. **Extension lines** - vertical lines from object to dimension
2. **Dimension line** - horizontal line with arrows
3. **Dimension text** - measurement value
4. **Terminators** - arrows or ticks at ends

### SVG Implementation

```python
def create_dimension_line(dwg, start, end, value_mm, offset=25, style='default'):
    """
    Create a dimension line with arrows and text.
    
    Args:
        dwg: svgwrite Drawing
        start: (x, y) start point on object
        end: (x, y) end point on object
        value_mm: Measurement in mm
        offset: Distance from object
        style: 'default', 'tick', 'dot'
    """
    group = dwg.g(class_='dimension')
    
    # Calculate direction
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    length = (dx**2 + dy**2)**0.5
    
    # Perpendicular direction for offset
    if length > 0:
        perp_x = -dy / length * offset
        perp_y = dx / length * offset
    else:
        perp_x, perp_y = 0, -offset
    
    # Offset points
    dim_start = (start[0] + perp_x, start[1] + perp_y)
    dim_end = (end[0] + perp_x, end[1] + perp_y)
    
    # Extension lines
    group.add(dwg.line(
        start=start, end=dim_start,
        stroke='#666', stroke_width=0.5
    ))
    group.add(dwg.line(
        start=end, end=dim_end,
        stroke='#666', stroke_width=0.5
    ))
    
    # Dimension line
    if style == 'tick':
        # Tick marks instead of arrows
        tick_size = 4
        group.add(dwg.line(
            start=dim_start, end=dim_end,
            stroke='#333', stroke_width=0.5
        ))
        # Start tick
        group.add(dwg.line(
            start=(dim_start[0]-tick_size, dim_start[1]-tick_size),
            end=(dim_start[0]+tick_size, dim_start[1]+tick_size),
            stroke='#333', stroke_width=1
        ))
        # End tick
        group.add(dwg.line(
            start=(dim_end[0]-tick_size, dim_end[1]-tick_size),
            end=(dim_end[0]+tick_size, dim_end[1]+tick_size),
            stroke='#333', stroke_width=1
        ))
    else:
        # Arrow markers
        group.add(dwg.line(
            start=dim_start, end=dim_end,
            stroke='#333', stroke_width=0.5,
            marker_start='url(#arrow-start)',
            marker_end='url(#arrow-end)'
        ))
    
    # Dimension text
    mid_x = (dim_start[0] + dim_end[0]) / 2
    mid_y = (dim_start[1] + dim_end[1]) / 2
    
    # Background for text
    text_bg = dwg.rect(
        insert=(mid_x - 20, mid_y - 8),
        size=(40, 12),
        fill='white', stroke='none'
    )
    group.add(text_bg)
    
    # Dimension value
    text = dwg.text(
        format_dimension(value_mm),
        insert=(mid_x, mid_y + 3),
        font_size='10px',
        font_family='Arial',
        text_anchor='middle',
        fill='#333'
    )
    group.add(text)
    
    return group

def format_dimension(value_mm):
    """Format dimension value for display."""
    if value_mm >= 1000:
        # Show as meters for large values
        return f"{value_mm/1000:.2f}m".rstrip('0').rstrip('.')
    return str(int(value_mm))
```

### Chain Dimensions

```python
def create_chain_dimension(dwg, points, values_mm, offset=25, direction='horizontal'):
    """
    Create chain of connected dimensions.
    
    Args:
        points: List of (x, y) points
        values_mm: List of measurements between points
        offset: Distance from object
        direction: 'horizontal' or 'vertical'
    """
    group = dwg.g(class_='chain-dimension')
    
    for i in range(len(points) - 1):
        dim = create_dimension_line(
            dwg, points[i], points[i+1],
            values_mm[i], offset
        )
        group.add(dim)
    
    # Total dimension (further offset)
    total = sum(values_mm)
    total_dim = create_dimension_line(
        dwg, points[0], points[-1],
        total, offset + 20
    )
    group.add(total_dim)
    
    return group
```

## Room Labels

```python
def add_room_label(dwg, name, center, area_sqm=None):
    """
    Add room name and optional area label.
    """
    group = dwg.g(class_='room-label')
    
    # Room name
    name_text = dwg.text(
        name.upper(),
        insert=center,
        font_size='12px',
        font_family='Arial',
        font_weight='bold',
        text_anchor='middle',
        fill='#1a1a1a'
    )
    group.add(name_text)
    
    # Area (if provided)
    if area_sqm:
        area_text = dwg.text(
            f"{area_sqm:.1f} m²",
            insert=(center[0], center[1] + 14),
            font_size='9px',
            font_family='Arial',
            text_anchor='middle',
            fill='#666'
        )
        group.add(area_text)
    
    return group
```

## Architectural Symbols

### North Arrow / Compass

```python
def add_compass(dwg, group, x, y, size=30):
    """Add north arrow symbol."""
    compass = dwg.g(id='compass', transform=f'translate({x},{y})')
    
    # Circle
    compass.add(dwg.circle(
        center=(0, 0), r=size/2,
        fill='none', stroke='#333', stroke_width=1
    ))
    
    # North arrow
    compass.add(dwg.polygon(
        points=[(0, -size/2+2), (-4, 4), (0, -2), (4, 4)],
        fill='#333'
    ))
    
    # N label
    compass.add(dwg.text(
        'N',
        insert=(0, -size/2 - 5),
        font_size='8px',
        font_family='Arial',
        font_weight='bold',
        text_anchor='middle',
        fill='#333'
    ))
    
    group.add(compass)
```

### Scale Bar

```python
def add_scale_bar(dwg, group, x, y, scale, segments=2):
    """
    Add scale bar with labeled segments.
    """
    conv = ScaleConverter(scale)
    segment_m = 0.5  # 500mm per segment
    segment_px = conv.m_to_px(segment_m)
    
    scale_group = dwg.g(id='scale-bar', transform=f'translate({x},{y})')
    
    for i in range(segments):
        fill = '#333' if i % 2 == 0 else 'white'
        rect = dwg.rect(
            insert=(i * segment_px, 0),
            size=(segment_px, 4),
            fill=fill,
            stroke='#333',
            stroke_width=0.5
        )
        scale_group.add(rect)
    
    # Labels
    for i in range(segments + 1):
        label = dwg.text(
            f"{i * segment_m}m",
            insert=(i * segment_px, 14),
            font_size='7px',
            font_family='Arial',
            text_anchor='middle',
            fill='#333'
        )
        scale_group.add(label)
    
    # Scale ratio text
    ratio_text = dwg.text(
        f"Scale {scale}",
        insert=(segments * segment_px / 2, -5),
        font_size='8px',
        font_family='Arial',
        text_anchor='middle',
        fill='#666'
    )
    scale_group.add(ratio_text)
    
    group.add(scale_group)
```

### Drainage Symbols

```python
def add_floor_drain(dwg, x, y, size=10):
    """Floor drain symbol (circle with cross)."""
    group = dwg.g(class_='floor-drain')
    
    group.add(dwg.circle(
        center=(x, y), r=size,
        fill='#f0f0f0', stroke='#333', stroke_width=1
    ))
    group.add(dwg.line(
        start=(x-size*0.7, y-size*0.7),
        end=(x+size*0.7, y+size*0.7),
        stroke='#666', stroke_width=0.5
    ))
    group.add(dwg.line(
        start=(x-size*0.7, y+size*0.7),
        end=(x+size*0.7, y-size*0.7),
        stroke='#666', stroke_width=0.5
    ))
    
    return group

def add_waste_point(dwg, x, y, size=6):
    """Waste/drain connection point."""
    group = dwg.g(class_='waste-point')
    
    group.add(dwg.circle(
        center=(x, y), r=size,
        fill='#333'
    ))
    
    return group
```

### Electrical Symbols

```python
ELECTRICAL_SYMBOLS = {
    'outlet': '''
        <circle cx="0" cy="0" r="6" fill="none" stroke="#333" stroke-width="1"/>
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#333" stroke-width="1"/>
    ''',
    'switch': '''
        <circle cx="0" cy="0" r="6" fill="none" stroke="#333" stroke-width="1"/>
        <text x="0" y="3" font-size="8" text-anchor="middle" fill="#333">S</text>
    ''',
    'light': '''
        <circle cx="0" cy="0" r="8" fill="none" stroke="#333" stroke-width="1"/>
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="#333" stroke-width="1"/>
        <line x1="-4" y1="4" x2="4" y2="-4" stroke="#333" stroke-width="1"/>
    ''',
}
```

## Title Block

```python
def add_title_block(dwg, x, y, width, project_info):
    """
    Add professional title block.
    
    Args:
        project_info: {
            'title': 'Bathroom Floor Plan',
            'client': 'Client Name',
            'address': 'Project Address',
            'drawn_by': 'Designer',
            'date': '2025-12-12',
            'scale': '1:50',
            'sheet': '1 of 1'
        }
    """
    group = dwg.g(id='title-block')
    
    # Border
    group.add(dwg.rect(
        insert=(x, y),
        size=(width, 60),
        fill='white',
        stroke='#333',
        stroke_width=1
    ))
    
    # Divider lines
    group.add(dwg.line(
        start=(x, y + 20),
        end=(x + width, y + 20),
        stroke='#333', stroke_width=0.5
    ))
    group.add(dwg.line(
        start=(x + width/2, y + 20),
        end=(x + width/2, y + 60),
        stroke='#333', stroke_width=0.5
    ))
    
    # Title
    group.add(dwg.text(
        project_info.get('title', 'Floor Plan'),
        insert=(x + 10, y + 14),
        font_size='12px',
        font_family='Arial',
        font_weight='bold',
        fill='#1a1a1a'
    ))
    
    # Left column
    small_font = {'font_size': '8px', 'font_family': 'Arial', 'fill': '#333'}
    group.add(dwg.text(f"Client: {project_info.get('client', '')}", insert=(x + 10, y + 32), **small_font))
    group.add(dwg.text(f"Address: {project_info.get('address', '')}", insert=(x + 10, y + 44), **small_font))
    group.add(dwg.text(f"Date: {project_info.get('date', '')}", insert=(x + 10, y + 56), **small_font))
    
    # Right column
    group.add(dwg.text(f"Scale: {project_info.get('scale', '1:50')}", insert=(x + width/2 + 10, y + 32), **small_font))
    group.add(dwg.text(f"Drawn: {project_info.get('drawn_by', '')}", insert=(x + width/2 + 10, y + 44), **small_font))
    group.add(dwg.text(f"Sheet: {project_info.get('sheet', '1')}", insert=(x + width/2 + 10, y + 56), **small_font))
    
    return group
```

## Legend

```python
def add_legend(dwg, x, y, items):
    """
    Add legend for symbols used in drawing.
    
    Args:
        items: [
            {'symbol': 'toilet', 'label': 'Wall-hung WC'},
            {'symbol': 'vanity', 'label': 'Vanity with sink'},
            ...
        ]
    """
    group = dwg.g(id='legend')
    
    # Title
    group.add(dwg.text(
        'LEGEND',
        insert=(x, y),
        font_size='10px',
        font_family='Arial',
        font_weight='bold',
        fill='#333'
    ))
    
    # Items
    for i, item in enumerate(items):
        item_y = y + 20 + i * 18
        
        # Symbol (simplified)
        group.add(dwg.rect(
            insert=(x, item_y - 6),
            size=(12, 12),
            fill='#f0f0f0',
            stroke='#333',
            stroke_width=0.5
        ))
        
        # Label
        group.add(dwg.text(
            item['label'],
            insert=(x + 18, item_y + 3),
            font_size='8px',
            font_family='Arial',
            fill='#333'
        ))
    
    return group
```

## Annotation Placement Strategy

```python
def auto_place_dimensions(geometry, conv, margin):
    """
    Automatically place dimensions around floor plan.
    
    Strategy:
    1. Horizontal dims above (north) and below (south)
    2. Vertical dims left (west) and right (east)
    3. Interior fixture dims only if requested
    """
    dimensions = []
    vertices = geometry['room']['vertices']
    
    # Find bounding box
    xs = [v[0] for v in vertices]
    ys = [v[1] for v in vertices]
    
    # Top edge dimensions (north wall)
    north_segments = get_wall_segments(vertices, 'north')
    for seg in north_segments:
        dim = {
            'start': (conv.mm_to_px(seg[0][0]) + margin, margin - 5),
            'end': (conv.mm_to_px(seg[1][0]) + margin, margin - 5),
            'value': seg[1][0] - seg[0][0],
            'offset': -25
        }
        dimensions.append(dim)
    
    # Similar for other sides...
    
    return dimensions
```
