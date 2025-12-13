# Changelog

All notable changes to floor-plan-to-svg skill.

## [0.1.0] - 2025-12-12

### Added
- Initial skill structure
- PDF parser (vector and raster support)
- CAD parser (DXF/DWG via ezdxf)
- Image parser (Claude Vision + OpenCV pipeline)
- ASCII parser (box drawing, coordinates, natural language)
- SVG generator with svgwrite
- Fixture library (toilet, sink, vanity, shower, door, window)
- Annotation engine (dimensions, scale bar, north arrow, title block)
- Multi-scale support (1:50, 1:100, 1:200)
- Layered SVG output (walls, openings, fixtures, dimensions, annotations)

### Technical
- Standardized geometry format across all parsers
- Modular architecture following exocortex patterns
- Config-driven scale and dimension system
