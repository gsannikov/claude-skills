# Floor Plan to SVG - Detailed Workflow

## Overview

Convert floor plans from PDF, CAD (DXF), photos, or text specifications into precise architectural SVG diagrams suitable for CAD import, web display, or printing.

## Prerequisites

- Python 3.9+
- Libraries: `svgwrite`, `ezdxf`, `pymupdf`, `pillow`
- Claude vision capabilities (for photo input)

## Complete Workflow

### Step 1: Input Detection & Parsing

**Purpose**: Identify input format and extract raw geometry data.

**Process**:

1. **Detect input type**:
   ```python
   input_type = detect_input_type(file_path)
   # Returns: 'pdf' | 'dxf' | 'image' | 'spec' | 'ascii'
   ```

2. **Route to appropriate parser**:
   | Input Type | Parser | Notes |
   |------------|--------|-------|
   | PDF | PyMuPDF | Extract vectors + text |
   | DXF | ezdxf | Direct geometry access |
   | Image | Vision AI | Describe → extract |
   | JSON/YAML | Direct load | Structured spec |
   | ASCII | Pattern match | Text diagram |

3. **Output normalized geometry**:
   ```yaml
   room:
     vertices: [[0,0], [1700,0], [1700,3700], ...]
     unit: mm
   walls:
     thickness: 100
   openings: [...]
   fixtures: [...]
   ```

**Example - PDF Input**:
```
User: convert floor plan: bathroom.pdf
Claude:
1. Opens PDF with PyMuPDF
2. Extracts vector paths (walls, fixtures)
3. Extracts text (dimensions, labels)
4. Normalizes to mm coordinates
5. Outputs structured geometry
```

### Step 2: Geometry Validation & Enhancement

**Purpose**: Validate extracted geometry and fill gaps.

**Process**:

1. **Validate vertices**:
   - Check polygon closure
   - Verify reasonable dimensions (not negative, not absurd)
   - Confirm unit consistency

2. **Auto-detect missing data**:
   - Infer wall thickness from drawing style
   - Identify fixtures by shape patterns
   - Extract dimensions from text labels

3. **User confirmation** (for ambiguous cases):
   ```
   Claude: I detected a 1700x3700mm room with an L-shape step.
   Fixtures found: toilet (wall-hung), vanity (900mm), shower (1100x1200mm)
   
   Is this correct? Any adjustments needed?
   ```

### Step 3: Scale Configuration

**Purpose**: Set output scale for target use case.

**Scale Options**:

| Scale | px/m | Best For |
|-------|------|----------|
| 1:20 | 100 | Detail drawings |
| 1:50 | 40 | Room plans (default) |
| 1:100 | 20 | Floor plans |
| 1:200 | 10 | Building overview |

**Auto-selection logic**:
```python
def recommend_scale(room_size_sqm):
    if room_size_sqm < 10:
        return "1:50"  # Small room, show detail
    elif room_size_sqm < 50:
        return "1:100"  # Medium space
    else:
        return "1:200"  # Large area
```

### Step 4: SVG Generation

**Purpose**: Generate CAD-grade SVG with proper layering.

**Process**:

1. **Calculate canvas size**:
   ```python
   margin = 60  # for dimensions
   canvas_width = room_width_px + margin * 2
   canvas_height = room_height_px + margin * 2
   ```

2. **Generate layers in order**:
   ```
   1. Background (white fill)
   2. Room outline (floor polygon)
   3. Walls (stroke on polygon)
   4. Openings (doors, windows)
   5. Fixtures (toilet, vanity, shower, etc.)
   6. Dimensions (exterior labels)
   7. Annotations (title, scale, compass)
   ```

3. **Apply architectural standards**:
   - Wall thickness: 100mm default
   - Door swing: 90° arc, dashed line
   - Dimension lines: Outside room envelope
   - Text: Arial, black, appropriately sized

### Step 5: Dimension Placement

**Purpose**: Add clear, non-overlapping dimension labels.

**Placement Rules**:

1. **Exterior dimensions** (preferred):
   - Horizontal dims above/below room
   - Vertical dims left/right of room
   - Chain dimensions for segmented walls

2. **Interior dimensions** (when needed):
   - Fixture positions from walls
   - Opening widths
   - Clearance zones

3. **Avoid overlaps**:
   ```python
   def place_dimension(dim, existing_dims):
       # Check for collisions
       for existing in existing_dims:
           if overlaps(dim, existing):
               # Offset further from room
               dim.offset += 15
       return dim
   ```

### Step 6: Output Generation

**Purpose**: Save final SVG and optional artifacts.

**Outputs**:

| Format | Use |
|--------|-----|
| `.svg` | CAD import, web, print |
| `.jsx` | React artifact for preview |
| `.pdf` | Print-ready document |

**SVG Export**:
```python
dwg.save()  # Saves to file

# Also output to Claude's outputs folder
copy_to_outputs(output_path)
```

**React Artifact** (optional):
```jsx
// For interactive preview in Claude chat
const FloorPlan = () => (
  <svg viewBox="0 0 {w} {h}">
    {/* Generated content */}
  </svg>
);
```

## Input Format Examples

### JSON Specification

```json
{
  "room": {
    "name": "Master Bathroom",
    "scale": "1:50",
    "vertices": [
      [0, 0], [1700, 0], [1700, 3700],
      [600, 3700], [600, 2500], [0, 2500]
    ]
  },
  "walls": {
    "thickness": 100
  },
  "openings": [
    {
      "type": "door",
      "wall": "west",
      "offset": 100,
      "width": 700,
      "swing": "inward-north"
    }
  ],
  "fixtures": [
    {
      "type": "toilet",
      "model": "wall-hung",
      "wall": "west",
      "centerline": 400
    },
    {
      "type": "vanity",
      "wall": "east",
      "offset": 500,
      "width": 900,
      "depth": 450
    },
    {
      "type": "shower",
      "corner": "SE",
      "width": 1100,
      "depth": 1200,
      "features": ["glass-partition", "linear-drain"]
    }
  ]
}
```

### ASCII Art Input

```
+-----+-------------+
|     |             |
| WC  |             |
|     |   VANITY    |
+--+  |             |
   |  +------+------+
   |  |      |      |
   |  |SHOWER|      |
   |  |      |      |
   +--+------+------+
```

### Verbal Description

```
User: Create a bathroom floor plan:
- Room is L-shaped, 1.7m wide, 3.7m long with a 0.6m step
- Door on west wall, 0.7m wide, 0.1m from north
- Toilet on west wall, wall-hung, centered 0.4m from wall
- Vanity on east wall, 0.9m wide
- Shower in SE corner, 1.1m x 1.2m with glass partition
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid polygon | Vertices don't close | Auto-close or prompt user |
| Missing dimensions | No text in PDF/image | Estimate from scale or ask |
| Fixture overlap | Insufficient space | Warn user, suggest smaller fixtures |
| Scale mismatch | Input uses different units | Convert to mm or prompt |

## Tips

1. **For best results from photos**: Ensure image is straight-on, well-lit, with visible dimension labels.

2. **For DXF files**: Use standard layer naming (A-WALL, A-DOOR, etc.) for automatic classification.

3. **For PDF floor plans**: Architectural PDFs with vector graphics work best; scanned images require vision processing.

4. **Scale verification**: Always verify one known dimension to confirm scale is correct.

5. **Iterative refinement**: Generate initial SVG, then use "adjust fixture: [name] position [x,y]" to fine-tune.
