# Floor Plan SVG - Design Notes

## Architecture Overview

```
Input → Parser → Geometry → Generator → SVG
         ↓
    [PDF/DXF/Image/Spec]
```

## Design Decisions

### 1. Scale System
- Chose 1:50 as default (40px/m, 1px=25mm)
- Matches common architectural practice for room-level plans
- Easy mental math for verification

### 2. Coordinate System
- All internal measurements in mm
- Origin at top-left (NW corner)
- Y-axis positive downward (SVG convention)

### 3. Layer Organization
- Strict layer order for predictable rendering
- Named groups for easy Figma/CAD import
- Allows selective hiding/showing

### 4. Fixture Library
- Standard dimensions from manufacturer specs
- Modular symbols with rotation support
- Easy to extend with new fixture types

## Libraries Evaluation

| Library | Purpose | Verdict |
|---------|---------|---------|
| svgwrite | SVG generation | ✅ Clean API, pure Python |
| ezdxf | DXF parsing | ✅ Excellent DXF support |
| PyMuPDF | PDF extraction | ✅ Fast, good vector support |
| drawsvg | Alternative SVG | ❌ Less mature |
| pycairo | Cairo backend | ❌ Overkill for SVG |

## Future Enhancements

### Phase 1 (MVP) ✅
- [x] Basic room outline generation
- [x] Wall thickness support
- [x] Common fixtures (toilet, vanity, shower)
- [x] Dimension labels
- [x] Scale configuration

### Phase 2
- [ ] Multi-room floor plans
- [ ] Staircase symbols
- [ ] Kitchen fixtures
- [ ] Electrical/plumbing symbols
- [ ] Auto-dimension placement

### Phase 3
- [ ] 3D isometric view generation
- [ ] Material/finish annotations
- [ ] PDF export with title block
- [ ] DXF export for CAD

## Testing Strategy

1. **Unit tests**: Scale converter, geometry validation
2. **Visual tests**: Compare generated SVG against reference
3. **Integration tests**: Full pipeline from spec to SVG

## Known Limitations

1. **Complex polygons**: Only supports simple polygons (no holes)
2. **Curved walls**: Not currently supported
3. **Multi-floor**: Single floor only
4. **Text rotation**: Some edge cases with vertical text

## Performance Notes

- Typical bathroom SVG: <50KB
- Generation time: <100ms
- No external API calls required
