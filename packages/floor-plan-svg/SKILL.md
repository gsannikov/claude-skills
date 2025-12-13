---
name: floor-plan-svg
description: Convert floor plans from PDF, CAD (DXF), or photos into precise architectural SVG diagrams. Supports multiple scales, fixture libraries, and dimension labeling. Outputs CAD-import ready SVGs.
---

# 📐 Floor Plan to SVG

Convert floor plans from various input formats to precise, architectural SVG diagrams.

## Commands

| Command | Action |
|---------|--------|
| `convert floor plan: [file]` | Full conversion workflow |
| `extract geometry: [file]` | Parse dimensions only |
| `generate svg: [room-spec]` | Create from JSON/YAML spec |
| `add fixtures: [svg]` | Add fixtures to existing SVG |
| `set scale: [ratio]` | Configure output scale |

## Supported Inputs

| Format | Extension | Processing Method |
|--------|-----------|-------------------|
| PDF | `.pdf` | PyMuPDF extraction + vision |
| Photo | `.jpg/.png` | Vision analysis + OCR |
| CAD | `.dxf` | ezdxf parsing |
| ASCII | text | Pattern matching |
| JSON Spec | `.json` | Direct generation |

## Workflow

### Step 1: Input Analysis
Detect input type and extract raw geometry data.
→ Load `modules/input-parser.md` for format-specific handling

### Step 2: Geometry Extraction
Parse walls, openings, fixtures into structured format.
→ Load `modules/geometry-extractor.md` for algorithms

### Step 3: SVG Generation
Generate architectural SVG with proper scaling and annotations.
→ Load `modules/svg-generator.md` for rendering

### Step 4: Annotation
Add dimensions, labels, symbols, and legend.
→ Load `modules/annotation-engine.md` for styling

## Module Loading

| Trigger | Load |
|---------|------|
| PDF input | `modules/input-parser.md` → pdf section |
| DXF input | `modules/input-parser.md` → cad section |
| Image input | `modules/input-parser.md` → vision section |
| Generate SVG | `modules/svg-generator.md` |
| Add dimensions | `modules/annotation-engine.md` |
| Fixture placement | `modules/fixture-library.md` |
| Detailed workflow | `references/workflow.md` |

## Scale Configuration

| Scale | Pixels/Meter | Use Case |
|-------|--------------|----------|
| 1:50 | 40 px/m | Detailed bathroom/kitchen |
| 1:100 | 20 px/m | Single room |
| 1:200 | 10 px/m | Apartment overview |

Default: **1:50** (1px = 25mm)

## Output Format

```svg
<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <g id="walls">...</g>
  <g id="openings">...</g>
  <g id="fixtures">...</g>
  <g id="dimensions">...</g>
  <g id="annotations">...</g>
</svg>
```

## Storage

**Location**: `~/exocortex-data/floor-plan-svg/`

```
floor-plan-svg/
├── projects/           # Saved floor plan projects
├── exports/            # Generated SVG files
├── fixtures/           # Custom fixture definitions
└── config.yaml         # User preferences
```

## Integration

- **Input**: PDF, DXF, JPG/PNG, JSON spec, ASCII art
- **Output**: SVG (Figma/CAD compatible), React JSX artifact

## Libraries Used

| Library | Purpose | Install |
|---------|---------|---------|
| svgwrite | SVG generation | `pip install svgwrite` |
| ezdxf | DXF parsing | `pip install ezdxf` |
| PyMuPDF | PDF extraction | `pip install pymupdf` |
| Pillow | Image processing | `pip install pillow` |

---
**Version**: 0.1.0 | **Patterns**: output, processing
