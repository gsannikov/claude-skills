# Local RAG OCR Debugging Guide

## Quick Test Command

```bash
cd packages/local-rag
PYTHONUNBUFFERED=1 PYTHONPATH=. OCR_ENGINE=paddle OCR_MAX_PAGES=3 \
python debug_ocr.py /path/to/your/file.pdf
```

## What the Enhanced Logging Shows

With the updated code, you'll now see:

```
PDF: Reading file.pdf...
PDF: Found 5 pages
PDF: Average 45 chars/page
PDF: Will OCR first 3 pages
PDF: Converting to images (dpi=200)...
PDF: Converted 3 images, starting OCR...
OCR: Processing image 1/3...
OCR: Image 1 - running PaddleOCR...
OCR: Image 1 - extracted 234 chars
OCR: Processing image 2/3...
OCR: Image 2 - cache hit
...
```

## If It Hangs

**At "PDF: Reading..."** → Corrupted PDF or too large
- Try with a smaller/different PDF
- Check file size: `ls -lh file.pdf`

**At "PDF: Converting to images..."** → pdf2image/Poppler issue
- Install/update Poppler: `brew install poppler`
- Try lower DPI: `OCR_PAGE_DPI=150`

**At "OCR: Image X - running PaddleOCR..."** → OCR model stuck
- Will automatically timeout after 60 seconds per image
- Check if it's a specific image causing issues
- Try different OCR engine: `OCR_ENGINE=none` to skip OCR

## Timeout Protection

Each image now has a 60-second timeout. If PaddleOCR hangs, you'll see:
```
Warning: PaddleOCR timed out on image 2 (60s limit)
```

The processing will continue with the next image.

## Common Issues

1. **First run takes forever**: PaddleOCR downloads models (~300MB)
   - Watch for download progress in verbose mode
   
2. **Specific image causes hang**: The timeout will skip it
   - Check the image number from logs
   - That page will have empty text in output

3. **All images timeout**: PaddleOCR installation issue
   - Try: `pip install --upgrade paddlepaddle paddleocr`
