---
name: floor-plan-to-svg
description: Convert floor plans from PDF, CAD (DXF/DWG), or photos into clean architectural SVG diagrams. Supports multiple scales, automatic dimension labeling, fixture libraries, and CAD-import-ready output.
---

# 📐 Floor Plan to SVG

Convert floor plans from any source into professional architectural SVG diagrams.

## Commands

| Command | Action |
|---------|--------|
| `Convert floor plan: [file]` | Full conversion workflow |
| `Parse: [file]` | Extract geometry only (no SVG yet) |
| `Generate SVG: [geometry]` | Create SVG from parsed data |
| `Add fixtures: [svg]` | Overlay fixtures on existing SVG |
| `Set scale: [ratio]` | Configure output scale (1:50, 1:100) |

## Supported Inputs

| Format | Extension | Parser |
|--------|-----------|--------|
| PDF | `.pdf` | PyMuPDF + pdf2image |
| CAD | `.dxf`, `.dwg` | ezdxf |
| Image | `.png`, `.jpg`, `.jpeg` | Claude Vision + OpenCV |
| ASCII | text block | Regex parser |

## Workflow

### Step 1: Input Detection
Detect file type and route to appropriate parser.
→ Load `modules/input-router.md`

### Step 2: Geometry Extraction
Parse walls, openings, fixtures from source.
→ Load `modules/geometry-parser.md`

### Step 3: SVG Generation
Convert geometry to scaled SVG with layers.
→ Load `modules/svg-generator.md`

### Step 4: Annotation
Add dimensions, labels, scale bar, notes.
→ Load `modules/annotation-engine.md`

## Module Loading

| Trigger | Load |
|---------|------|
| PDF input | `modules/pdf-parser.md` |
| DXF/DWG input | `modules/cad-parser.md` |
| Image input | `modules/image-parser.md` |
| ASCII input | `modules/ascii-parser.md` |
| SVG generation | `modules/svg-generator.md` |
| Fixture placement | `modules/fixture-library.md` |
| Dimension labels | `modules/annotation-engine.md` |

## Output Format

```svg
<svg viewBox="0 0 {width} {height}" xmlns="...">
  <g id="walls">...</g>
  <g id="openings">...</g>
  <g id="fixtures">...</g>
  <g id="dimensions">...</g>
  <g id="annotations">...</g>
</svg>
```

## Scale System

| Scale | Pixels/Meter | Use Case |
|-------|--------------|----------|
| 1:50 | 40 px/m | Detailed rooms |
| 1:100 | 20 px/m | Apartments |
| 1:200 | 10 px/m | Full floors |

Formula: `mm_to_px = scale_factor / 25`

## Storage

**Location**: `~/exocortex-data/floor-plan-to-svg/`

```
floor-plan-to-svg/
├── projects/           # Saved conversions
├── fixtures/           # Custom fixture SVGs
├── templates/          # Output templates
└── config.yaml         # User preferences
```

## Integration

- **Input**: PDF, DXF, DWG, PNG, JPG, ASCII
- **Output**: SVG (Figma/CAD ready), React artifact

---
**Version**: 0.1.0 | **Patterns**: input-routing, output
