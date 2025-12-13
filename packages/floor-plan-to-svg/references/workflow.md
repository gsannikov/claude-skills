# Floor Plan to SVG - Detailed Workflow

## Overview

Convert floor plans from any source (PDF, CAD, photo, ASCII) into clean, professional SVG diagrams suitable for Figma, CAD software, or web display.

## Prerequisites

- Python 3.10+
- Libraries: svgwrite, ezdxf, PyMuPDF, opencv-python, Pillow
- Claude Vision access (for image parsing)

## Installation

```bash
pip install svgwrite ezdxf PyMuPDF pdf2image opencv-python Pillow cairosvg --break-system-packages
```

## Complete Workflow

### Step 1: Input Detection

**Purpose**: Route file to correct parser

**Process**:
1. Check file extension
2. For PDFs, analyze vector vs raster content
3. For images, prepare for Vision + OpenCV pipeline
4. Load appropriate parser module

**Example**:
```python
# Input: "bathroom.pdf"
# Detection: PDF with vector content
# Router: modules/pdf-parser.md
```

### Step 2: Geometry Extraction

**Purpose**: Extract walls, openings, fixtures into standard format

**Process**:
1. Parse source file using detected parser
2. Extract wall segments (lines, polylines)
3. Identify openings (doors, windows)
4. Detect fixtures (symbols, blocks)
5. Extract dimension annotations if present

**Output Format**:
```yaml
geometry:
  walls:
    - start: [0, 0]
      end: [1700, 0]
      thickness: 100
      type: exterior
  openings:
    - type: door
      position: [100, 0]
      width: 700
      swing: inward
  fixtures:
    - type: toilet
      center: [200, 400]
      rotation: 90
  room:
    name: Bathroom
    bounds: [0, 0, 1700, 3700]
    area_sqm: 6.29
```

### Step 3: SVG Generation

**Purpose**: Create layered architectural SVG

**Process**:
1. Calculate canvas size from bounds + margin
2. Apply scale (1:50, 1:100, 1:200)
3. Create layer groups (walls, openings, fixtures, dimensions, annotations)
4. Draw room polygon or wall segments
5. Place fixtures using templates
6. Add opening symbols

**Layer Structure**:
```xml
<svg viewBox="0 0 {width} {height}">
  <defs><!-- Arrow markers, patterns --></defs>
  <g id="walls"><!-- Room boundary --></g>
  <g id="openings"><!-- Doors, windows --></g>
  <g id="fixtures"><!-- Toilet, vanity, etc --></g>
  <g id="dimensions"><!-- Measurement lines --></g>
  <g id="annotations"><!-- Labels, notes --></g>
</svg>
```

### Step 4: Annotation

**Purpose**: Add professional documentation

**Process**:
1. Add dimension lines for all walls
2. Add centerlines for fixtures
3. Add room label with area
4. Add scale bar
5. Add north arrow
6. Add title block
7. Add notes if provided

## Scale Reference

| Scale | Use | px/m | px/mm | mm/px |
|-------|-----|------|-------|-------|
| 1:50 | Rooms | 40 | 0.04 | 25 |
| 1:100 | Apartments | 20 | 0.02 | 50 |
| 1:200 | Floors | 10 | 0.01 | 100 |

**Conversion Formulas**:
```python
# mm to pixels
px = mm * px_per_mm

# pixels to mm  
mm = px * mm_per_px

# For 1:50 scale:
# 1000mm (1m) = 40px
# 25mm = 1px
```

## Input Type Guides

### PDF Files

Best for: CAD exports, architectural drawings

```python
# Check if vector or raster
analysis = analyze_pdf(pdf_path)

if analysis['has_vectors']:
    # Extract paths directly
    geometry = extract_vector_geometry(pdf_path)
else:
    # Rasterize and use image processing
    geometry = extract_raster_geometry(pdf_path, dpi=300)
```

### DXF/DWG Files

Best for: Native CAD files

```python
# Parse with ezdxf
doc = ezdxf.readfile(dxf_path)
msp = doc.modelspace()

# Extract by entity type and layer
for entity in msp:
    if entity.dxftype() == 'LINE':
        # Wall segment
    elif entity.dxftype() == 'INSERT':
        # Block reference (fixture)
```

### Images

Best for: Scanned plans, photos, screenshots

```python
# Two-stage pipeline
# Stage 1: Claude Vision for semantic understanding
vision_analysis = analyze_with_vision(image_path)

# Stage 2: OpenCV for precise geometry
opencv_geometry = extract_geometry_opencv(image_path)

# Combine results
geometry = merge_analyses(vision_analysis, opencv_geometry)
```

### ASCII Text

Best for: Quick sketches, text-based input

```python
# Supports multiple formats:
# - Box drawing characters (┌─┐)
# - Simple ASCII (+--+)
# - Coordinate lists (A: 0, 0)
# - Natural language descriptions

geometry = parse_ascii(text_input)
```

## Output Options

| Format | Method | Use Case |
|--------|--------|----------|
| SVG file | `dwg.saveas(path)` | Figma, CAD import |
| SVG string | `dwg.tostring()` | Embedding |
| React artifact | JSX template | Interactive |
| PNG | `cairosvg.svg2png()` | Preview |

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| No walls detected | Low contrast image | Increase preprocessing |
| Scale mismatch | Wrong unit assumption | Provide scale hint |
| Missing fixtures | Non-standard symbols | Manual addition |
| Overlapping dimensions | Auto-placement conflict | Adjust offset |

## Tips

1. **Always verify scale** - Check one known dimension
2. **Use high-res images** - 300 DPI minimum for scans
3. **Clean backgrounds** - Remove grid lines if possible
4. **Layer organization** - Keep SVG layers for easy editing
5. **Fixture centerlines** - Use for precise placement
