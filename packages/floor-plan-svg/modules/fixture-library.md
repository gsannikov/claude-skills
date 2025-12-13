# Fixture Library Module

## Overview

Standard architectural fixture symbols and their SVG representations for floor plans.

## Fixture Types

| Category | Fixtures |
|----------|----------|
| Bathroom | toilet, bidet, bathtub, shower, vanity, sink |
| Kitchen | sink, dishwasher, stove, refrigerator, counter |
| Laundry | washer, dryer |
| General | door, window, stairs |

## Standard Dimensions (mm)

### Bathroom Fixtures

| Fixture | Width | Depth | Notes |
|---------|-------|-------|-------|
| Standard toilet | 380 | 700 | Floor-mounted |
| Wall-hung toilet | 360 | 550 | Projects from wall |
| Bidet | 360 | 550 | Similar to toilet |
| Standard bathtub | 700 | 1700 | Long axis |
| Corner bathtub | 1400 | 1400 | 45° entry |
| Shower (small) | 800 | 800 | Minimum |
| Shower (standard) | 900 | 900 | Comfortable |
| Shower (large) | 1200 | 1200 | Accessible |
| Single vanity | 600-900 | 450-550 | With basin |
| Double vanity | 1200-1500 | 550 | Two basins |
| Wall-mounted sink | 450-600 | 350-450 | No vanity |

### Kitchen Fixtures

| Fixture | Width | Depth | Notes |
|---------|-------|-------|-------|
| Single sink | 450 | 450 | Bowl size |
| Double sink | 800 | 450 | Two bowls |
| Dishwasher | 600 | 600 | Standard |
| Range/Stove (4 burner) | 600 | 600 | Standard |
| Range (6 burner) | 900 | 600 | Professional |
| Refrigerator | 900 | 700 | Standard |
| Counter | variable | 600 | Standard depth |

## Fixture Symbol Definitions

### Toilet (Wall-Hung)

```python
def toilet_symbol(x, y, rotation=0, wall_hung=True):
    """
    Generate toilet SVG symbol.
    Origin at centerline on wall.
    """
    width = 360
    depth = 550 if wall_hung else 700
    
    return f'''
    <g id="toilet" transform="translate({x},{y}) rotate({rotation})">
      <!-- Cistern/tank -->
      <rect x="{-width/2}" y="0" width="{width}" height="{depth*0.25}"
            fill="#f5f5f5" stroke="#333" stroke-width="1"/>
      
      <!-- Bowl -->
      <ellipse cx="0" cy="{depth*0.6}" rx="{width/2-5}" ry="{depth*0.35}"
               fill="#f5f5f5" stroke="#333" stroke-width="1"/>
      
      <!-- Seat outline -->
      <ellipse cx="0" cy="{depth*0.6}" rx="{width/2-15}" ry="{depth*0.28}"
               fill="none" stroke="#666" stroke-width="0.5"/>
      
      <!-- Centerline (for dimensions) -->
      <line x1="0" y1="-10" x2="0" y2="{depth+10}"
            stroke="#999" stroke-width="0.5" stroke-dasharray="4,2"/>
    </g>
    '''
```

### Vanity with Sink

```python
def vanity_symbol(x, y, width, depth, sinks=1, rotation=0):
    """
    Generate vanity/counter with sink(s).
    Origin at top-left corner against wall.
    """
    sink_radius_x = width * 0.2 if sinks == 1 else width * 0.12
    sink_radius_y = depth * 0.35
    
    sinks_svg = ""
    if sinks == 1:
        # Single centered sink
        sinks_svg = f'''
        <ellipse cx="{width/2}" cy="{depth/2}" rx="{sink_radius_x}" ry="{sink_radius_y}"
                 fill="#f5f5f5" stroke="#333" stroke-width="1"/>
        <circle cx="{width/2}" cy="{depth/2}" r="3" fill="#333"/>
        '''
    else:
        # Double sinks
        offset = width * 0.25
        sinks_svg = f'''
        <ellipse cx="{offset}" cy="{depth/2}" rx="{sink_radius_x}" ry="{sink_radius_y}"
                 fill="#f5f5f5" stroke="#333" stroke-width="1"/>
        <circle cx="{offset}" cy="{depth/2}" r="3" fill="#333"/>
        <ellipse cx="{width-offset}" cy="{depth/2}" rx="{sink_radius_x}" ry="{sink_radius_y}"
                 fill="#f5f5f5" stroke="#333" stroke-width="1"/>
        <circle cx="{width-offset}" cy="{depth/2}" r="3" fill="#333"/>
        '''
    
    return f'''
    <g id="vanity" transform="translate({x},{y}) rotate({rotation})">
      <!-- Counter/cabinet -->
      <rect x="0" y="0" width="{width}" height="{depth}"
            fill="#e0d5c5" stroke="#333" stroke-width="1"/>
      
      <!-- Sink basin(s) -->
      {sinks_svg}
      
      <!-- Counter edge detail -->
      <line x1="0" y1="{depth}" x2="{width}" y2="{depth}"
            stroke="#333" stroke-width="1.5"/>
    </g>
    '''
```

### Shower Enclosure

```python
def shower_symbol(x, y, width, depth, features=None, rotation=0):
    """
    Generate shower enclosure symbol.
    Features: glass-partition, linear-drain, corner-drain, bench
    """
    features = features or []
    
    elements = []
    
    # Base/floor
    elements.append(f'''
    <rect x="0" y="0" width="{width}" height="{depth}"
          fill="#e8f4f8" stroke="#333" stroke-width="1"/>
    ''')
    
    # Tile pattern (subtle)
    elements.append(f'''
    <pattern id="shower-tiles" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#e8f4f8"/>
      <path d="M0,0 L20,0 M0,20 L20,20" stroke="#d0e8f0" stroke-width="0.5"/>
    </pattern>
    <rect x="1" y="1" width="{width-2}" height="{depth-2}" fill="url(#shower-tiles)"/>
    ''')
    
    # Glass partition
    if 'glass-partition' in features:
        elements.append(f'''
        <line x1="0" y1="0" x2="0" y2="{depth}"
              stroke="#0066cc" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="{depth*0.7}" r="4" fill="none" stroke="#0066cc" stroke-width="1"/>
        ''')
    
    # Linear drain
    if 'linear-drain' in features:
        elements.append(f'''
        <rect x="{width*0.1}" y="{depth-10}" width="{width*0.8}" height="6"
              fill="#999" stroke="#666" stroke-width="0.5" rx="1"/>
        <line x1="{width*0.15}" y1="{depth-7}" x2="{width*0.85}" y2="{depth-7}"
              stroke="#777" stroke-width="2" stroke-dasharray="3,3"/>
        ''')
    
    # Corner drain
    if 'corner-drain' in features:
        elements.append(f'''
        <circle cx="{width-15}" cy="{depth-15}" r="8"
                fill="#999" stroke="#666" stroke-width="0.5"/>
        <circle cx="{width-15}" cy="{depth-15}" r="3" fill="#666"/>
        ''')
    
    # Bench
    if 'bench' in features:
        elements.append(f'''
        <rect x="{width-80}" y="0" width="75" height="{depth*0.4}"
              fill="#d4c4a8" stroke="#333" stroke-width="1"/>
        ''')
    
    # Shower head indicator
    elements.append(f'''
    <circle cx="{width/2}" cy="20" r="6" fill="none" stroke="#666" stroke-width="1"/>
    <circle cx="{width/2}" cy="20" r="2" fill="#666"/>
    ''')
    
    return f'''
    <g id="shower" transform="translate({x},{y}) rotate({rotation})">
      {''.join(elements)}
    </g>
    '''
```

### Bathtub

```python
def bathtub_symbol(x, y, width, depth, style='standard', rotation=0):
    """
    Generate bathtub symbol.
    Styles: standard, corner, freestanding
    """
    if style == 'corner':
        return f'''
        <g id="bathtub-corner" transform="translate({x},{y}) rotate({rotation})">
          <path d="M0,0 L{width},0 L{width},{depth} L{depth},depth Q0,{depth} 0,0 Z"
                fill="#e0f0ff" stroke="#333" stroke-width="1"/>
          <ellipse cx="{width*0.7}" cy="{depth*0.3}" rx="15" ry="10"
                   fill="#ccc" stroke="#333" stroke-width="0.5"/>
        </g>
        '''
    
    # Standard rectangular
    return f'''
    <g id="bathtub" transform="translate({x},{y}) rotate({rotation})">
      <!-- Outer edge -->
      <rect x="0" y="0" width="{width}" height="{depth}"
            fill="#e0f0ff" stroke="#333" stroke-width="1.5" rx="10"/>
      
      <!-- Inner basin -->
      <rect x="8" y="8" width="{width-16}" height="{depth-16}"
            fill="#f0f8ff" stroke="#666" stroke-width="0.5" rx="5"/>
      
      <!-- Drain -->
      <circle cx="{width*0.8}" cy="{depth/2}" r="8"
              fill="#ccc" stroke="#333" stroke-width="0.5"/>
      <circle cx="{width*0.8}" cy="{depth/2}" r="3" fill="#666"/>
      
      <!-- Faucet area -->
      <rect x="{width*0.75}" y="3" width="{width*0.2}" height="20"
            fill="#d0d0d0" stroke="#333" stroke-width="0.5" rx="2"/>
    </g>
    '''
```

### Door

```python
def door_symbol(x, y, width, swing='inward-left', rotation=0):
    """
    Generate door symbol with swing arc.
    Swing options: inward-left, inward-right, outward-left, outward-right
    """
    arc_radius = width
    
    # Determine arc direction
    if 'inward' in swing:
        if 'left' in swing:
            arc_path = f"M{width},0 A{arc_radius},{arc_radius} 0 0 0 0,{arc_radius}"
            panel_end = (0, arc_radius)
        else:
            arc_path = f"M0,0 A{arc_radius},{arc_radius} 0 0 1 {width},{arc_radius}"
            panel_end = (width, arc_radius)
    else:  # outward
        if 'left' in swing:
            arc_path = f"M{width},0 A{arc_radius},{arc_radius} 0 0 1 0,{-arc_radius}"
            panel_end = (0, -arc_radius)
        else:
            arc_path = f"M0,0 A{arc_radius},{arc_radius} 0 0 0 {width},{-arc_radius}"
            panel_end = (width, -arc_radius)
    
    return f'''
    <g id="door" transform="translate({x},{y}) rotate({rotation})">
      <!-- Opening (gap in wall) -->
      <rect x="-2" y="-4" width="{width+4}" height="8"
            fill="white" stroke="none"/>
      
      <!-- Door frame -->
      <line x1="0" y1="-4" x2="0" y2="4" stroke="#333" stroke-width="2"/>
      <line x1="{width}" y1="-4" x2="{width}" y2="4" stroke="#333" stroke-width="2"/>
      
      <!-- Swing arc -->
      <path d="{arc_path}"
            fill="none" stroke="#666" stroke-width="0.5" stroke-dasharray="3,2"/>
      
      <!-- Door panel -->
      <line x1="{'0' if 'left' in swing else width}" y1="0"
            x2="{panel_end[0]}" y2="{panel_end[1]}"
            stroke="#333" stroke-width="2"/>
    </g>
    '''
```

### Window

```python
def window_symbol(x, y, width, rotation=0):
    """
    Generate window symbol (double-line with mullion).
    """
    return f'''
    <g id="window" transform="translate({x},{y}) rotate({rotation})">
      <!-- Window opening -->
      <rect x="0" y="-3" width="{width}" height="6"
            fill="white" stroke="none"/>
      
      <!-- Glass lines -->
      <line x1="0" y1="-2" x2="{width}" y2="-2"
            stroke="#333" stroke-width="1"/>
      <line x1="0" y1="2" x2="{width}" y2="2"
            stroke="#333" stroke-width="1"/>
      
      <!-- Center mullion -->
      <line x1="{width/2}" y1="-2" x2="{width/2}" y2="2"
            stroke="#333" stroke-width="0.5"/>
      
      <!-- Frame ends -->
      <line x1="0" y1="-3" x2="0" y2="3" stroke="#333" stroke-width="2"/>
      <line x1="{width}" y1="-3" x2="{width}" y2="3" stroke="#333" stroke-width="2"/>
    </g>
    '''
```

## Fixture Placement Helper

```python
def place_fixture(fixture_type: str, wall: str, offset: float, room_vertices: list, conv) -> dict:
    """
    Calculate fixture position based on wall and offset.
    
    Args:
        fixture_type: Type of fixture
        wall: 'north', 'south', 'east', 'west'
        offset: Distance from wall start (mm)
        room_vertices: Room polygon vertices
        conv: ScaleConverter instance
    
    Returns:
        Position dict with x, y, rotation
    """
    # Find wall endpoints
    wall_map = get_wall_segments(room_vertices)
    wall_segment = wall_map[wall]
    
    # Calculate position along wall
    start, end = wall_segment
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    wall_length = (dx**2 + dy**2)**0.5
    
    ratio = offset / wall_length
    x = start[0] + dx * ratio
    y = start[1] + dy * ratio
    
    # Determine rotation based on wall
    rotation_map = {
        'north': 180,
        'south': 0,
        'east': 270,
        'west': 90
    }
    
    return {
        'x': conv.mm_to_px(x),
        'y': conv.mm_to_px(y),
        'rotation': rotation_map.get(wall, 0)
    }
```

## Usage Example

```python
# Generate bathroom fixtures
fixtures_svg = []

fixtures_svg.append(toilet_symbol(
    x=margin + conv.mm_to_px(400),  # centerline
    y=margin + conv.mm_to_px(100),  # from north wall
    rotation=90  # faces east
))

fixtures_svg.append(vanity_symbol(
    x=margin + conv.mm_to_px(1250),  # against east wall
    y=margin + conv.mm_to_px(500),
    width=conv.mm_to_px(900),
    depth=conv.mm_to_px(450),
    sinks=1,
    rotation=0
))

fixtures_svg.append(shower_symbol(
    x=margin + conv.mm_to_px(600),
    y=margin + conv.mm_to_px(2500),
    width=conv.mm_to_px(1100),
    depth=conv.mm_to_px(1200),
    features=['glass-partition', 'linear-drain']
))
```
