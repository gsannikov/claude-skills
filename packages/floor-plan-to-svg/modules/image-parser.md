# Image Parser Module

## Purpose
Extract floor plan geometry from photos/screenshots using Claude Vision + OpenCV.

## Two-Stage Pipeline

```
Image Input
    │
    ├── Stage 1: Claude Vision
    │   └── Semantic understanding (room layout, fixtures)
    │
    └── Stage 2: OpenCV
        └── Precise geometry extraction (walls, dimensions)
    │
    ↓
Combined Geometry Output
```

## Stage 1: Claude Vision Analysis

```python
def analyze_with_vision(image_path: str) -> dict:
    """Use Claude Vision to understand floor plan semantics."""
    
    # This is handled by Claude directly when image is in context
    # The prompt should request structured output:
    
    prompt = """
    Analyze this floor plan image and extract:
    
    1. Room type and approximate dimensions
    2. Wall layout (describe the polygon shape)
    3. Fixtures present (toilet, sink, shower, etc.) with positions
    4. Door/window locations
    5. Any visible dimension labels
    
    Return as structured YAML:
    
    ```yaml
    room:
      type: bathroom
      shape: L-shaped
      approx_dimensions:
        width_m: 1.7
        length_m: 3.7
      
    walls:
      - description: "North wall, 1.7m"
      - description: "East wall, 3.7m total (2.5m + step + 1.2m)"
      # ...
      
    fixtures:
      - type: toilet
        position: "west wall, 0.4m from north"
        facing: east
      - type: vanity
        position: "east wall, center"
        width_mm: 900
      # ...
      
    openings:
      - type: door
        position: "west wall, 0.1m from north"
        width_mm: 700
        swing: inward
    ```
    """
    
    # Claude Vision will return structured analysis
    return vision_response
```

## Stage 2: OpenCV Geometry Extraction

```python
import cv2
import numpy as np

def extract_geometry_opencv(image_path: str) -> dict:
    """Extract precise geometry using OpenCV."""
    
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Preprocessing
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)
    
    # Morphological operations to connect walls
    kernel = np.ones((3, 3), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)
    edges = cv2.erode(edges, kernel, iterations=1)
    
    # Detect lines (walls)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 
                            threshold=100,
                            minLineLength=50, 
                            maxLineGap=10)
    
    # Detect contours (room boundaries)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, 
                                    cv2.CHAIN_APPROX_SIMPLE)
    
    return {
        'lines': process_lines(lines),
        'contours': process_contours(contours),
        'image_size': img.shape[:2]
    }
```

## Line Processing

```python
def process_lines(lines) -> list:
    """Process detected lines into wall segments."""
    if lines is None:
        return []
    
    walls = []
    for line in lines:
        x1, y1, x2, y2 = line[0]
        
        # Calculate length and angle
        length = np.sqrt((x2-x1)**2 + (y2-y1)**2)
        angle = np.arctan2(y2-y1, x2-x1) * 180 / np.pi
        
        # Filter: walls are typically horizontal or vertical
        if is_orthogonal(angle, tolerance=10):
            walls.append({
                'start': [x1, y1],
                'end': [x2, y2],
                'length_px': length,
                'angle': angle
            })
    
    return merge_collinear_lines(walls)

def is_orthogonal(angle: float, tolerance: float = 10) -> bool:
    """Check if angle is roughly horizontal or vertical."""
    normalized = abs(angle) % 90
    return normalized < tolerance or normalized > (90 - tolerance)

def merge_collinear_lines(lines: list) -> list:
    """Merge lines that are collinear and close together."""
    # Group by angle, merge overlapping segments
    # ... implementation
    return merged_lines
```

## Contour Processing

```python
def process_contours(contours) -> list:
    """Extract room polygons from contours."""
    rooms = []
    
    for contour in contours:
        # Approximate polygon
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        
        # Filter by area (ignore small noise)
        area = cv2.contourArea(contour)
        if area > 1000:  # Minimum room area in pixels
            rooms.append({
                'vertices': approx.reshape(-1, 2).tolist(),
                'area_px': area,
                'perimeter_px': cv2.arcLength(contour, True)
            })
    
    return rooms
```

## Scale Calibration

```python
def calibrate_scale(image_path: str, known_dimension_mm: float, 
                    dimension_pixels: float) -> float:
    """Calculate mm-per-pixel scale from known dimension."""
    return known_dimension_mm / dimension_pixels

def auto_detect_scale(geometry: dict, vision_analysis: dict) -> float:
    """Attempt automatic scale detection."""
    
    # If vision detected dimension labels, use them
    if 'dimensions' in vision_analysis:
        for dim in vision_analysis['dimensions']:
            # Match dimension text to nearest line
            # ... implementation
            pass
    
    # Fallback: assume standard door width (700-900mm)
    for fixture in vision_analysis.get('fixtures', []):
        if fixture['type'] == 'door':
            door_width_mm = fixture.get('width_mm', 800)
            # Find door in geometry, calculate scale
            # ... implementation
            pass
    
    # Default: 1 pixel = 5mm (reasonable for screen captures)
    return 5.0
```

## Combined Pipeline

```python
def parse_image(image_path: str, scale_hint: float = None) -> dict:
    """Complete image parsing pipeline."""
    
    # Stage 1: Claude Vision semantic analysis
    # (This happens when Claude sees the image in context)
    vision_analysis = analyze_with_vision(image_path)
    
    # Stage 2: OpenCV geometry extraction
    opencv_geometry = extract_geometry_opencv(image_path)
    
    # Determine scale
    if scale_hint:
        mm_per_px = scale_hint
    else:
        mm_per_px = auto_detect_scale(opencv_geometry, vision_analysis)
    
    # Convert pixels to mm
    walls = []
    for wall in opencv_geometry['lines']:
        walls.append({
            'start': [wall['start'][0] * mm_per_px, 
                      wall['start'][1] * mm_per_px],
            'end': [wall['end'][0] * mm_per_px, 
                    wall['end'][1] * mm_per_px],
            'thickness': 100  # Default wall thickness
        })
    
    # Extract fixtures from vision analysis
    fixtures = []
    for fixture in vision_analysis.get('fixtures', []):
        fixtures.append({
            'type': fixture['type'],
            'center': estimate_fixture_position(fixture, opencv_geometry),
            'dimensions': get_fixture_dimensions(fixture['type'])
        })
    
    return {
        'walls': walls,
        'fixtures': fixtures,
        'openings': vision_analysis.get('openings', []),
        'room': {
            'type': vision_analysis.get('room', {}).get('type'),
            'area_sqm': calculate_area(walls) / 1_000_000
        },
        'scale': {'mm_per_px': mm_per_px},
        'source': image_path
    }
```

## Fixture Detection with Template Matching

```python
def detect_fixtures_template(image_path: str, templates_dir: str) -> list:
    """Detect fixtures using template matching."""
    img = cv2.imread(image_path, 0)
    
    fixtures = []
    for template_name in os.listdir(templates_dir):
        template = cv2.imread(os.path.join(templates_dir, template_name), 0)
        
        # Multi-scale template matching
        for scale in [0.5, 0.75, 1.0, 1.25, 1.5]:
            resized = cv2.resize(template, None, fx=scale, fy=scale)
            result = cv2.matchTemplate(img, resized, cv2.TM_CCOEFF_NORMED)
            
            threshold = 0.7
            locations = np.where(result >= threshold)
            
            for pt in zip(*locations[::-1]):
                fixtures.append({
                    'type': template_name.split('.')[0],
                    'position': list(pt),
                    'confidence': result[pt[1], pt[0]],
                    'scale': scale
                })
    
    return non_max_suppression(fixtures)
```

## Best Practices

1. **Image quality**: Request high-resolution images (300+ DPI)
2. **Lighting**: Even lighting, no shadows
3. **Orientation**: Correct rotation before processing
4. **Scale reference**: Include known dimensions or scale bar
5. **Clean backgrounds**: White/light backgrounds work best
