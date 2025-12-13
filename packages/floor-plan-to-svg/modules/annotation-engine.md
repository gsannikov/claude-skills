# Annotation Engine Module

## Purpose
Add dimensions, labels, scale bars, and notes to architectural SVG.

## Annotation Types

| Type | Purpose |
|------|---------|
| Dimension lines | Show measurements |
| Leader lines | Connect labels to elements |
| Scale bar | Visual scale reference |
| North arrow | Orientation |
| Room labels | Identify spaces |
| Notes | Additional information |
| Title block | Drawing metadata |

## Dimension Lines

```python
def dimension_line(start: tuple, end: tuple, label: str, 
                   offset: float = 20, position: str = 'above') -> str:
    """Create dimension line with arrows and label."""
    x1, y1 = start
    x2, y2 = end
    
    # Calculate dimension line position
    if position == 'above':
        dy = -offset
    elif position == 'below':
        dy = offset
    elif position == 'left':
        dx = -offset
        dy = 0
    else:  # right
        dx = offset
        dy = 0
    
    # Extension lines
    ext_length = offset - 5
    
    if position in ('above', 'below'):
        ext1 = f'<line x1="{x1}" y1="{y1}" x2="{x1}" y2="{y1 + dy}" stroke="black" stroke-width="0.5"/>'
        ext2 = f'<line x1="{x2}" y1="{y2}" x2="{x2}" y2="{y2 + dy}" stroke="black" stroke-width="0.5"/>'
        dim_y = y1 + dy
        dim_line = f'<line x1="{x1}" y1="{dim_y}" x2="{x2}" y2="{dim_y}" stroke="black" stroke-width="0.5" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>'
        mid_x = (x1 + x2) / 2
        text = f'<text x="{mid_x}" y="{dim_y - 3}" text-anchor="middle" font-size="8" font-family="Arial">{label}</text>'
    else:
        ext1 = f'<line x1="{x1}" y1="{y1}" x2="{x1 + dx}" y2="{y1}" stroke="black" stroke-width="0.5"/>'
        ext2 = f'<line x1="{x2}" y1="{y2}" x2="{x2 + dx}" y2="{y2}" stroke="black" stroke-width="0.5"/>'
        dim_x = x1 + dx
        dim_line = f'<line x1="{dim_x}" y1="{y1}" x2="{dim_x}" y2="{y2}" stroke="black" stroke-width="0.5" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>'
        mid_y = (y1 + y2) / 2
        text = f'<text x="{dim_x + 3}" y="{mid_y}" text-anchor="start" font-size="8" font-family="Arial" transform="rotate(-90 {dim_x + 3} {mid_y})">{label}</text>'
    
    return f'''<g class="dimension">
    {ext1}
    {ext2}
    {dim_line}
    {text}
</g>'''
```

## Arrow Markers (SVG Defs)

```python
def arrow_defs() -> str:
    """SVG defs for dimension arrows."""
    return '''<defs>
    <marker id="arrow-start" markerWidth="6" markerHeight="6" 
            refX="6" refY="3" orient="auto-start-reverse">
        <path d="M 6 0 L 0 3 L 6 6 Z" fill="black"/>
    </marker>
    <marker id="arrow-end" markerWidth="6" markerHeight="6" 
            refX="0" refY="3" orient="auto">
        <path d="M 0 0 L 6 3 L 0 6 Z" fill="black"/>
    </marker>
    <marker id="tick" markerWidth="8" markerHeight="8" 
            refX="4" refY="4" orient="auto">
        <line x1="0" y1="8" x2="8" y2="0" stroke="black" stroke-width="1"/>
    </marker>
</defs>'''
```

## Scale Bar

```python
def scale_bar(scale: str, x: float, y: float, units: str = 'mm') -> str:
    """Create scale bar for drawing."""
    
    scales = {
        '1:50': {'segment_mm': 500, 'segments': 4, 'px_per_mm': 0.04},
        '1:100': {'segment_mm': 1000, 'segments': 3, 'px_per_mm': 0.02},
        '1:200': {'segment_mm': 2000, 'segments': 2, 'px_per_mm': 0.01},
    }
    
    cfg = scales.get(scale, scales['1:50'])
    segment_px = cfg['segment_mm'] * cfg['px_per_mm']
    
    svg = f'<g class="scale-bar" transform="translate({x},{y})">'
    
    # Draw alternating black/white segments
    for i in range(cfg['segments']):
        fill = 'black' if i % 2 == 0 else 'white'
        svg += f'<rect x="{i * segment_px}" y="0" width="{segment_px}" height="5" fill="{fill}" stroke="black" stroke-width="0.5"/>'
    
    # Labels
    for i in range(cfg['segments'] + 1):
        value = i * cfg['segment_mm']
        if units == 'm':
            label = f'{value/1000:.1f}m'
        else:
            label = f'{value}'
        svg += f'<text x="{i * segment_px}" y="15" text-anchor="middle" font-size="6" font-family="Arial">{label}</text>'
    
    # Scale text
    svg += f'<text x="{cfg["segments"] * segment_px / 2}" y="-5" text-anchor="middle" font-size="7" font-family="Arial">Scale {scale}</text>'
    
    svg += '</g>'
    return svg
```

## North Arrow

```python
def north_arrow(x: float, y: float, size: float = 30) -> str:
    """Create north arrow symbol."""
    return f'''<g class="north-arrow" transform="translate({x},{y})">
    <polygon points="0,-{size} -{size/4},{size/2} 0,{size/3} {size/4},{size/2}" 
             fill="black" stroke="black" stroke-width="1"/>
    <polygon points="0,-{size} {size/4},{size/2} 0,{size/3}" 
             fill="white" stroke="black" stroke-width="1"/>
    <text x="0" y="-{size+5}" text-anchor="middle" font-size="10" font-family="Arial" font-weight="bold">N</text>
</g>'''
```

## Room Label

```python
def room_label(x: float, y: float, name: str, area_sqm: float = None) -> str:
    """Create room label with optional area."""
    label = f'''<g class="room-label" transform="translate({x},{y})">
    <text x="0" y="0" text-anchor="middle" font-size="10" font-family="Arial" font-weight="bold">{name}</text>'''
    
    if area_sqm:
        label += f'''
    <text x="0" y="12" text-anchor="middle" font-size="8" font-family="Arial">{area_sqm:.1f} m²</text>'''
    
    label += '\n</g>'
    return label
```

## Title Block

```python
def title_block(width: float, project: str, drawing: str, 
                scale: str, date: str, drawn_by: str = '') -> str:
    """Create title block for drawing."""
    block_width = 200
    block_height = 60
    x = width - block_width - 10
    y = 10
    
    return f'''<g class="title-block" transform="translate({x},{y})">
    <rect x="0" y="0" width="{block_width}" height="{block_height}" 
          fill="white" stroke="black" stroke-width="1"/>
    
    <!-- Dividers -->
    <line x1="0" y1="20" x2="{block_width}" y2="20" stroke="black" stroke-width="0.5"/>
    <line x1="0" y1="40" x2="{block_width}" y2="40" stroke="black" stroke-width="0.5"/>
    <line x1="100" y1="40" x2="100" y2="{block_height}" stroke="black" stroke-width="0.5"/>
    
    <!-- Project name -->
    <text x="5" y="14" font-size="10" font-family="Arial" font-weight="bold">{project}</text>
    
    <!-- Drawing title -->
    <text x="5" y="34" font-size="9" font-family="Arial">{drawing}</text>
    
    <!-- Scale -->
    <text x="5" y="54" font-size="8" font-family="Arial">Scale: {scale}</text>
    
    <!-- Date -->
    <text x="105" y="54" font-size="8" font-family="Arial">{date}</text>
</g>'''
```

## Notes Block

```python
def notes_block(x: float, y: float, notes: list) -> str:
    """Create notes section."""
    svg = f'''<g class="notes" transform="translate({x},{y})">
    <text x="0" y="0" font-size="9" font-family="Arial" font-weight="bold">NOTES:</text>'''
    
    for i, note in enumerate(notes):
        svg += f'''
    <text x="0" y="{15 + i * 12}" font-size="8" font-family="Arial">{i+1}. {note}</text>'''
    
    svg += '\n</g>'
    return svg
```

## Auto-Annotation Pipeline

```python
def auto_annotate(svg_content: str, geometry: dict, scale: str) -> str:
    """Automatically add annotations to SVG."""
    
    annotations = []
    
    # Add dimension lines for all walls
    for i, wall in enumerate(geometry['walls']):
        length_mm = calculate_length(wall['start'], wall['end'])
        label = f'{int(length_mm)}' if length_mm < 10000 else f'{length_mm/1000:.1f}m'
        
        # Convert to pixels
        start_px = mm_to_px(wall['start'], scale)
        end_px = mm_to_px(wall['end'], scale)
        
        # Determine position (outside room)
        position = 'above' if is_horizontal(wall) else 'left'
        
        annotations.append(dimension_line(start_px, end_px, label, position=position))
    
    # Add room label
    center = calculate_center(geometry['room']['bounds'])
    center_px = mm_to_px(center, scale)
    annotations.append(room_label(
        center_px[0], center_px[1],
        geometry['room'].get('name', 'Room'),
        geometry['room'].get('area_sqm')
    ))
    
    # Add scale bar
    annotations.append(scale_bar(scale, 20, svg_height - 30))
    
    # Add north arrow
    annotations.append(north_arrow(svg_width - 40, 40))
    
    # Wrap in annotation group
    annotation_svg = f'<g id="annotations">\n{"".join(annotations)}\n</g>'
    
    # Insert before closing </svg> tag
    return svg_content.replace('</svg>', f'{annotation_svg}\n</svg>')
```

## Centerline Annotations

```python
def centerline(start: tuple, end: tuple) -> str:
    """Create centerline symbol (CL marker)."""
    mid_x = (start[0] + end[0]) / 2
    mid_y = (start[1] + end[1]) / 2
    
    return f'''<g class="centerline">
    <line x1="{start[0]}" y1="{start[1]}" x2="{end[0]}" y2="{end[1]}" 
          stroke="black" stroke-width="0.5" stroke-dasharray="10,3,2,3"/>
    <text x="{mid_x}" y="{mid_y - 5}" text-anchor="middle" font-size="6" font-family="Arial">CL</text>
</g>'''
```
