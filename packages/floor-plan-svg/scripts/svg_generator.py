"""
Floor Plan SVG Generator

Generate architectural SVG diagrams from floor plan specifications.
Uses svgwrite library for SVG creation.

Usage:
    from svg_generator import FloorPlanGenerator
    
    generator = FloorPlanGenerator(scale="1:50")
    svg_path = generator.generate(geometry_data, output_path)
"""

import math
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Tuple, Dict, Optional, Any

try:
    import svgwrite
    from svgwrite import cm, mm
except ImportError:
    svgwrite = None
    print("Warning: svgwrite not installed. Run: pip install svgwrite")


@dataclass
class ScaleConverter:
    """Convert between mm and pixels at given scale."""
    
    scale: str = "1:50"
    
    def __post_init__(self):
        self.ratio = int(self.scale.split(':')[1])
        self.px_per_m = 2000 / self.ratio
        self.mm_per_px = self.ratio / 2
    
    def mm_to_px(self, mm_val: float) -> float:
        """Convert millimeters to pixels."""
        return mm_val / 1000 * self.px_per_m
    
    def px_to_mm(self, px_val: float) -> float:
        """Convert pixels to millimeters."""
        return px_val * self.mm_per_px
    
    def m_to_px(self, m_val: float) -> float:
        """Convert meters to pixels."""
        return m_val * self.px_per_m


@dataclass
class Geometry:
    """Normalized floor plan geometry."""
    
    vertices: List[Tuple[float, float]]  # Room outline in mm
    wall_thickness: float = 100  # mm
    openings: List[Dict] = field(default_factory=list)
    fixtures: List[Dict] = field(default_factory=list)
    room_name: str = "Floor Plan"
    
    @property
    def bounds(self) -> Tuple[float, float, float, float]:
        """Get bounding box (min_x, min_y, max_x, max_y) in mm."""
        xs = [v[0] for v in self.vertices]
        ys = [v[1] for v in self.vertices]
        return (min(xs), min(ys), max(xs), max(ys))
    
    @property
    def width_mm(self) -> float:
        bounds = self.bounds
        return bounds[2] - bounds[0]
    
    @property
    def height_mm(self) -> float:
        bounds = self.bounds
        return bounds[3] - bounds[1]


class FloorPlanGenerator:
    """Generate architectural SVG floor plans."""
    
    def __init__(self, scale: str = "1:50", margin: int = 60):
        self.scale = scale
        self.conv = ScaleConverter(scale)
        self.margin = margin
        self.dwg = None
    
    def generate(self, geometry: Geometry, output_path: str) -> str:
        """
        Generate SVG from geometry specification.
        
        Args:
            geometry: Normalized floor plan geometry
            output_path: Path to save SVG file
            
        Returns:
            Path to generated SVG
        """
        if svgwrite is None:
            raise ImportError("svgwrite library required. Install with: pip install svgwrite")
        
        # Calculate canvas size
        width = self.conv.mm_to_px(geometry.width_mm) + self.margin * 2
        height = self.conv.mm_to_px(geometry.height_mm) + self.margin * 2
        
        # Create drawing
        self.dwg = svgwrite.Drawing(
            output_path,
            size=(f"{width}px", f"{height}px"),
            viewBox=f"0 0 {width} {height}"
        )
        
        # Add definitions
        self._add_definitions()
        
        # Add layers in order
        self._add_background(width, height)
        self._add_room_outline(geometry)
        self._add_walls(geometry)
        self._add_openings(geometry)
        self._add_fixtures(geometry)
        self._add_dimensions(geometry)
        self._add_annotations(geometry, width, height)
        
        # Save
        self.dwg.save()
        return output_path
    
    def _add_definitions(self):
        """Add reusable SVG definitions."""
        # Arrow markers for dimensions
        arrow_start = self.dwg.marker(
            id='arrow-start',
            insert=(0, 3),
            size=(6, 6),
            orient='auto'
        )
        arrow_start.add(self.dwg.path(d='M6,0 L0,3 L6,6 Z', fill='#333'))
        self.dwg.defs.add(arrow_start)
        
        arrow_end = self.dwg.marker(
            id='arrow-end',
            insert=(6, 3),
            size=(6, 6),
            orient='auto'
        )
        arrow_end.add(self.dwg.path(d='M0,0 L6,3 L0,6 Z', fill='#333'))
        self.dwg.defs.add(arrow_end)
    
    def _add_background(self, width: float, height: float):
        """Add white background."""
        group = self.dwg.g(id='background')
        group.add(self.dwg.rect(
            insert=(0, 0),
            size=(width, height),
            fill='white'
        ))
        self.dwg.add(group)
    
    def _add_room_outline(self, geometry: Geometry):
        """Draw floor polygon."""
        group = self.dwg.g(id='room-outline')
        
        points = [
            (self.conv.mm_to_px(x) + self.margin, 
             self.conv.mm_to_px(y) + self.margin)
            for x, y in geometry.vertices
        ]
        
        polygon = self.dwg.polygon(
            points,
            fill='#fafafa',
            stroke='none'
        )
        group.add(polygon)
        self.dwg.add(group)
    
    def _add_walls(self, geometry: Geometry):
        """Draw walls as strokes."""
        group = self.dwg.g(id='walls')
        
        stroke_width = self.conv.mm_to_px(geometry.wall_thickness)
        
        points = [
            (self.conv.mm_to_px(x) + self.margin,
             self.conv.mm_to_px(y) + self.margin)
            for x, y in geometry.vertices
        ]
        
        polygon = self.dwg.polygon(
            points,
            fill='none',
            stroke='#1a1a1a',
            stroke_width=stroke_width,
            stroke_linejoin='miter'
        )
        group.add(polygon)
        self.dwg.add(group)
    
    def _add_openings(self, geometry: Geometry):
        """Draw doors and windows."""
        group = self.dwg.g(id='openings')
        
        for opening in geometry.openings:
            if opening.get('type') == 'door':
                self._add_door(group, opening)
            elif opening.get('type') == 'window':
                self._add_window(group, opening)
        
        self.dwg.add(group)
    
    def _add_door(self, group, door: Dict):
        """Add door with swing arc."""
        pos = door.get('position', (0, 0))
        width = self.conv.mm_to_px(door.get('width', 700))
        x = self.conv.mm_to_px(pos[0]) + self.margin
        y = self.conv.mm_to_px(pos[1]) + self.margin
        rotation = door.get('rotation', 0)
        
        door_group = self.dwg.g(
            transform=f"translate({x},{y}) rotate({rotation})"
        )
        
        # Door opening (gap in wall)
        door_group.add(self.dwg.rect(
            insert=(-2, -4),
            size=(width + 4, 8),
            fill='white'
        ))
        
        # Door panel
        door_group.add(self.dwg.line(
            start=(0, 0),
            end=(width, 0),
            stroke='#333',
            stroke_width=2
        ))
        
        # Swing arc
        door_group.add(self.dwg.path(
            d=f"M 0,0 A {width},{width} 0 0 1 0,{width}",
            fill='none',
            stroke='#666',
            stroke_width=0.5,
            stroke_dasharray='3,2'
        ))
        
        group.add(door_group)
    
    def _add_window(self, group, window: Dict):
        """Add window symbol."""
        pos = window.get('position', (0, 0))
        width = self.conv.mm_to_px(window.get('width', 1000))
        x = self.conv.mm_to_px(pos[0]) + self.margin
        y = self.conv.mm_to_px(pos[1]) + self.margin
        
        window_group = self.dwg.g(transform=f"translate({x},{y})")
        
        # Glass lines
        window_group.add(self.dwg.line(
            start=(0, -2), end=(width, -2),
            stroke='#333', stroke_width=1
        ))
        window_group.add(self.dwg.line(
            start=(0, 2), end=(width, 2),
            stroke='#333', stroke_width=1
        ))
        
        group.add(window_group)
    
    def _add_fixtures(self, geometry: Geometry):
        """Draw bathroom/kitchen fixtures."""
        group = self.dwg.g(id='fixtures')
        
        for fixture in geometry.fixtures:
            ftype = fixture.get('type', '')
            
            if ftype == 'toilet':
                self._add_toilet(group, fixture)
            elif ftype == 'vanity':
                self._add_vanity(group, fixture)
            elif ftype == 'shower':
                self._add_shower(group, fixture)
            elif ftype == 'bathtub':
                self._add_bathtub(group, fixture)
        
        self.dwg.add(group)
    
    def _add_toilet(self, group, fixture: Dict):
        """Add toilet symbol."""
        pos = fixture.get('position', (0, 0))
        x = self.conv.mm_to_px(pos[0]) + self.margin
        y = self.conv.mm_to_px(pos[1]) + self.margin
        w = self.conv.mm_to_px(fixture.get('width', 360))
        h = self.conv.mm_to_px(fixture.get('depth', 550))
        rotation = fixture.get('rotation', 0)
        
        toilet_group = self.dwg.g(
            transform=f"translate({x},{y}) rotate({rotation})"
        )
        
        # Tank
        toilet_group.add(self.dwg.rect(
            insert=(-w/2, 0),
            size=(w, h * 0.25),
            fill='#f5f5f5',
            stroke='#333',
            stroke_width=1
        ))
        
        # Bowl
        toilet_group.add(self.dwg.ellipse(
            center=(0, h * 0.6),
            r=(w/2 - 5, h * 0.35),
            fill='#f5f5f5',
            stroke='#333',
            stroke_width=1
        ))
        
        group.add(toilet_group)
    
    def _add_vanity(self, group, fixture: Dict):
        """Add vanity with sink."""
        pos = fixture.get('position', (0, 0))
        x = self.conv.mm_to_px(pos[0]) + self.margin
        y = self.conv.mm_to_px(pos[1]) + self.margin
        w = self.conv.mm_to_px(fixture.get('width', 900))
        d = self.conv.mm_to_px(fixture.get('depth', 450))
        rotation = fixture.get('rotation', 0)
        
        vanity_group = self.dwg.g(
            transform=f"translate({x},{y}) rotate({rotation})"
        )
        
        # Cabinet
        vanity_group.add(self.dwg.rect(
            insert=(0, 0),
            size=(w, d),
            fill='#e0d5c5',
            stroke='#333',
            stroke_width=1
        ))
        
        # Sink basin
        vanity_group.add(self.dwg.ellipse(
            center=(w/2, d/2),
            r=(w * 0.25, d * 0.35),
            fill='#f5f5f5',
            stroke='#333',
            stroke_width=1
        ))
        
        # Drain
        vanity_group.add(self.dwg.circle(
            center=(w/2, d/2),
            r=3,
            fill='#333'
        ))
        
        group.add(vanity_group)
    
    def _add_shower(self, group, fixture: Dict):
        """Add shower enclosure."""
        pos = fixture.get('position', (0, 0))
        x = self.conv.mm_to_px(pos[0]) + self.margin
        y = self.conv.mm_to_px(pos[1]) + self.margin
        w = self.conv.mm_to_px(fixture.get('width', 900))
        h = self.conv.mm_to_px(fixture.get('depth', 900))
        features = fixture.get('features', [])
        
        shower_group = self.dwg.g(transform=f"translate({x},{y})")
        
        # Base
        shower_group.add(self.dwg.rect(
            insert=(0, 0),
            size=(w, h),
            fill='#e8f4f8',
            stroke='#333',
            stroke_width=1
        ))
        
        # Glass partition
        if 'glass-partition' in features:
            shower_group.add(self.dwg.line(
                start=(0, 0),
                end=(0, h),
                stroke='#0066cc',
                stroke_width=3
            ))
        
        # Linear drain
        if 'linear-drain' in features:
            shower_group.add(self.dwg.rect(
                insert=(w * 0.1, h - 8),
                size=(w * 0.8, 4),
                fill='#999',
                stroke='#666',
                stroke_width=0.5
            ))
        
        group.add(shower_group)
    
    def _add_bathtub(self, group, fixture: Dict):
        """Add bathtub symbol."""
        pos = fixture.get('position', (0, 0))
        x = self.conv.mm_to_px(pos[0]) + self.margin
        y = self.conv.mm_to_px(pos[1]) + self.margin
        w = self.conv.mm_to_px(fixture.get('width', 700))
        h = self.conv.mm_to_px(fixture.get('depth', 1700))
        
        tub_group = self.dwg.g(transform=f"translate({x},{y})")
        
        # Outer edge
        tub_group.add(self.dwg.rect(
            insert=(0, 0),
            size=(w, h),
            fill='#e0f0ff',
            stroke='#333',
            stroke_width=1.5,
            rx=10
        ))
        
        # Inner basin
        tub_group.add(self.dwg.rect(
            insert=(8, 8),
            size=(w - 16, h - 16),
            fill='#f0f8ff',
            stroke='#666',
            stroke_width=0.5,
            rx=5
        ))
        
        group.add(tub_group)
    
    def _add_dimensions(self, geometry: Geometry):
        """Add dimension lines."""
        group = self.dwg.g(id='dimensions')
        
        # Calculate overall dimensions
        bounds = geometry.bounds
        width_mm = bounds[2] - bounds[0]
        height_mm = bounds[3] - bounds[1]
        
        # Top dimension (width)
        self._add_dimension_line(
            group,
            start=(self.margin, self.margin - 25),
            end=(self.margin + self.conv.mm_to_px(width_mm), self.margin - 25),
            value_mm=width_mm
        )
        
        # Left dimension (height)
        self._add_dimension_line(
            group,
            start=(self.margin - 25, self.margin),
            end=(self.margin - 25, self.margin + self.conv.mm_to_px(height_mm)),
            value_mm=height_mm,
            vertical=True
        )
        
        self.dwg.add(group)
    
    def _add_dimension_line(self, group, start: Tuple, end: Tuple, 
                           value_mm: float, vertical: bool = False):
        """Add a single dimension line."""
        # Dimension line with arrows
        group.add(self.dwg.line(
            start=start,
            end=end,
            stroke='#333',
            stroke_width=0.5,
            marker_start='url(#arrow-start)',
            marker_end='url(#arrow-end)'
        ))
        
        # Text
        mid_x = (start[0] + end[0]) / 2
        mid_y = (start[1] + end[1]) / 2
        
        text_str = str(int(value_mm))
        
        if vertical:
            group.add(self.dwg.text(
                text_str,
                insert=(mid_x - 5, mid_y),
                font_size='10px',
                font_family='Arial',
                text_anchor='end',
                fill='#333',
                transform=f"rotate(-90,{mid_x - 5},{mid_y})"
            ))
        else:
            group.add(self.dwg.text(
                text_str,
                insert=(mid_x, mid_y - 5),
                font_size='10px',
                font_family='Arial',
                text_anchor='middle',
                fill='#333'
            ))
    
    def _add_annotations(self, geometry: Geometry, width: float, height: float):
        """Add title, scale bar, compass."""
        group = self.dwg.g(id='annotations')
        
        # Title
        group.add(self.dwg.text(
            geometry.room_name.upper(),
            insert=(width - 20, height - 30),
            font_size='14px',
            font_family='Arial',
            font_weight='bold',
            text_anchor='end',
            fill='#1a1a1a'
        ))
        
        # Scale
        group.add(self.dwg.text(
            f"Scale {self.scale}",
            insert=(width - 20, height - 15),
            font_size='10px',
            font_family='Arial',
            text_anchor='end',
            fill='#666'
        ))
        
        # Scale bar
        bar_width = self.conv.m_to_px(1)
        group.add(self.dwg.rect(
            insert=(20, height - 50),
            size=(bar_width, 4),
            fill='#333'
        ))
        group.add(self.dwg.text(
            "1m",
            insert=(20 + bar_width/2, height - 55),
            font_size='8px',
            font_family='Arial',
            text_anchor='middle',
            fill='#333'
        ))
        
        # Compass
        self._add_compass(group, 40, 40)
        
        self.dwg.add(group)
    
    def _add_compass(self, group, x: float, y: float, size: float = 30):
        """Add north arrow."""
        compass = self.dwg.g(transform=f"translate({x},{y})")
        
        compass.add(self.dwg.circle(
            center=(0, 0),
            r=size/2,
            fill='none',
            stroke='#333',
            stroke_width=1
        ))
        
        compass.add(self.dwg.polygon(
            points=[(0, -size/2 + 2), (-4, 4), (0, -2), (4, 4)],
            fill='#333'
        ))
        
        compass.add(self.dwg.text(
            'N',
            insert=(0, -size/2 - 5),
            font_size='8px',
            font_family='Arial',
            font_weight='bold',
            text_anchor='middle',
            fill='#333'
        ))
        
        group.add(compass)


def generate_from_spec(spec: Dict, output_path: str, scale: str = "1:50") -> str:
    """
    Generate SVG from specification dictionary.
    
    Args:
        spec: Floor plan specification with room, walls, openings, fixtures
        output_path: Where to save SVG
        scale: Output scale (default "1:50")
    
    Returns:
        Path to generated SVG
    """
    # Convert spec to Geometry object
    geometry = Geometry(
        vertices=spec['room']['vertices'],
        wall_thickness=spec.get('walls', {}).get('thickness', 100),
        openings=spec.get('openings', []),
        fixtures=spec.get('fixtures', []),
        room_name=spec['room'].get('name', 'Floor Plan')
    )
    
    # Generate
    generator = FloorPlanGenerator(scale=scale)
    return generator.generate(geometry, output_path)


# Example usage
if __name__ == "__main__":
    # Example bathroom spec
    spec = {
        "room": {
            "name": "Bathroom",
            "vertices": [
                (0, 0), (1700, 0), (1700, 3700),
                (600, 3700), (600, 2500), (0, 2500)
            ]
        },
        "walls": {"thickness": 100},
        "openings": [
            {"type": "door", "position": (0, 100), "width": 700, "rotation": 90}
        ],
        "fixtures": [
            {"type": "toilet", "position": (180, 800), "rotation": 90},
            {"type": "vanity", "position": (1250, 500), "width": 900, "depth": 450},
            {"type": "shower", "position": (600, 2500), "width": 1100, "depth": 1200,
             "features": ["glass-partition", "linear-drain"]}
        ]
    }
    
    output = generate_from_spec(spec, "/tmp/bathroom.svg", scale="1:50")
    print(f"Generated: {output}")
