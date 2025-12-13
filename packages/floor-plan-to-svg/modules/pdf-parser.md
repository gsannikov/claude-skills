# PDF Parser Module

## Purpose
Extract floor plan geometry from PDF files (vector or rasterized).

## Libraries

```bash
pip install PyMuPDF pdf2image Pillow --break-system-packages
```

| Library | Use Case |
|---------|----------|
| `PyMuPDF` (fitz) | Vector PDF extraction |
| `pdf2image` | Rasterize for image processing |
| `Pillow` | Image manipulation |

## Detection: Vector vs Raster

```python
import fitz  # PyMuPDF

def analyze_pdf(pdf_path: str) -> dict:
    """Analyze PDF to determine extraction method."""
    doc = fitz.open(pdf_path)
    page = doc[0]
    
    # Check for vector content
    drawings = page.get_drawings()
    text_blocks = page.get_text("blocks")
    images = page.get_images()
    
    analysis = {
        'has_vectors': len(drawings) > 10,
        'has_text': len(text_blocks) > 0,
        'has_images': len(images) > 0,
        'drawing_count': len(drawings),
        'recommended': 'vector' if len(drawings) > 50 else 'raster'
    }
    
    return analysis
```

## Vector Extraction (CAD-origin PDFs)

```python
def extract_vector_geometry(pdf_path: str, page_num: int = 0) -> dict:
    """Extract geometry from vector PDF."""
    doc = fitz.open(pdf_path)
    page = doc[page_num]
    
    drawings = page.get_drawings()
    
    walls = []
    for path in drawings:
        for item in path['items']:
            if item[0] == 'l':  # Line
                x1, y1, x2, y2 = item[1], item[2], item[3], item[4]
                
                # Filter by stroke width (walls are thicker)
                if path.get('width', 0) > 1:
                    walls.append({
                        'start': [x1, y1],
                        'end': [x2, y2],
                        'thickness': path.get('width', 1) * 25  # Convert to mm
                    })
            
            elif item[0] == 're':  # Rectangle
                x, y, w, h = item[1:5]
                # Could be a room or fixture
    
    return {'walls': walls, 'raw_drawings': drawings}
```

## Raster Extraction (Scanned PDFs)

```python
from pdf2image import convert_from_path
import cv2
import numpy as np

def extract_raster_geometry(pdf_path: str, dpi: int = 300) -> dict:
    """Convert PDF to image and extract via OpenCV."""
    
    # Convert PDF to image
    images = convert_from_path(pdf_path, dpi=dpi)
    img = np.array(images[0])
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    
    # Edge detection
    edges = cv2.Canny(gray, 50, 150)
    
    # Line detection
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, 
                            minLineLength=50, maxLineGap=10)
    
    walls = []
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            walls.append({
                'start': [x1 * 25.4 / dpi, y1 * 25.4 / dpi],  # px to mm
                'end': [x2 * 25.4 / dpi, y2 * 25.4 / dpi],
                'thickness': 100  # Default wall thickness
            })
    
    return {'walls': walls, 'source_dpi': dpi}
```

## Dimension Extraction

```python
def extract_dimensions(pdf_path: str) -> list:
    """Extract dimension text from PDF."""
    doc = fitz.open(pdf_path)
    page = doc[0]
    
    text_blocks = page.get_text("dict")["blocks"]
    dimensions = []
    
    for block in text_blocks:
        if "lines" in block:
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"]
                    # Match dimension patterns: "1500", "1.5m", "150cm"
                    if re.match(r'[\d.,]+\s*(mm|cm|m)?', text):
                        dimensions.append({
                            'value': text,
                            'position': [span["bbox"][0], span["bbox"][1]]
                        })
    
    return dimensions
```

## Scale Detection

```python
def detect_scale_from_pdf(pdf_path: str) -> str:
    """Attempt to detect drawing scale from PDF."""
    doc = fitz.open(pdf_path)
    page = doc[0]
    text = page.get_text()
    
    # Look for scale indicators
    scale_patterns = [
        r'1\s*:\s*50', r'1\s*:\s*100', r'1\s*:\s*200',
        r'Scale\s*1\s*:\s*(\d+)', r'SCALE\s*(\d+)'
    ]
    
    for pattern in scale_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return f"1:{match.group(1) if match.lastindex else match.group()}"
    
    return "1:50"  # Default
```

## Full Pipeline

```python
def parse_pdf(pdf_path: str) -> dict:
    """Complete PDF parsing pipeline."""
    
    # Analyze PDF
    analysis = analyze_pdf(pdf_path)
    
    # Extract geometry
    if analysis['recommended'] == 'vector':
        geometry = extract_vector_geometry(pdf_path)
    else:
        geometry = extract_raster_geometry(pdf_path)
    
    # Extract dimensions
    dimensions = extract_dimensions(pdf_path)
    
    # Detect scale
    scale = detect_scale_from_pdf(pdf_path)
    
    return {
        'geometry': geometry,
        'dimensions': dimensions,
        'scale': scale,
        'source': pdf_path,
        'method': analysis['recommended']
    }
```
