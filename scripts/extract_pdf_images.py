#!/usr/bin/env python3
"""
Extract images/figures from PDFs in docs/ using PyMuPDF (fitz).
Writes:
 - docs/pdf_images/<pdf_stem>/page_<n>_img<k>.png
 - docs/docs_pdf_images_index.csv (pdf_file,page,image_file,xref,width,height,context_snippet)

Also writes small thumbnails in the same folder named *_thumb.png

Run from repo root: .venv\Scripts\python.exe scripts\extract_pdf_images.py
"""
from pathlib import Path
import csv
import fitz  # PyMuPDF

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
OUT_DIR = DOCS / "pdf_images"
OUT_DIR.mkdir(parents=True, exist_ok=True)

INDEX_CSV = DOCS / "docs_pdf_images_index.csv"

# how many characters of surrounding text to include as context
CTX_CHARS = 220

pdf_files = sorted(DOCS.glob("*.pdf"))

with INDEX_CSV.open("w", newline='', encoding='utf-8') as idxf:
    writer = csv.writer(idxf)
    writer.writerow(["pdf_file", "page_number", "image_file", "xref", "width", "height", "context_snippet"])

    for pdf in pdf_files:
        print(f"Processing images in {pdf.name}...")
        doc = fitz.open(str(pdf))
        pdf_dir = OUT_DIR / pdf.stem
        pdf_dir.mkdir(parents=True, exist_ok=True)

        for pageno in range(len(doc)):
            page = doc.load_page(pageno)
            # page.get_images returns list of tuples; each tuple's first element is xref
            images = page.get_images(full=True)
            if not images:
                continue

            # collect page text to get context snippets
            try:
                page_text = page.get_text("text")
            except Exception:
                page_text = ""

            for img_index, img in enumerate(images, start=1):
                xref = img[0]
                base_name = f"page_{pageno+1}_img{img_index}"
                try:
                    pix = fitz.Pixmap(doc, xref)
                except Exception as e:
                    print(f"  Skip image xref={xref} on page {pageno+1}: {e}")
                    continue

                # decide output format and convert if needed
                if pix.n < 5:
                    out_path = pdf_dir / (base_name + ".png")
                    pix.save(str(out_path))
                else:
                    # CMYK: convert to RGB
                    pix1 = fitz.Pixmap(fitz.csRGB, pix)
                    out_path = pdf_dir / (base_name + ".png")
                    pix1.save(str(out_path))
                    pix1 = None
                width, height = pix.width, pix.height
                # create thumbnail
                try:
                    thumb = fitz.Pixmap(str(out_path))
                    thumb.scale(0.25, 0.25)
                    thumb_path = pdf_dir / (base_name + "_thumb.png")
                    thumb.save(str(thumb_path))
                    thumb = None
                except Exception:
                    # fallback: ignore thumb generation errors
                    thumb_path = ""

                # find a short text snippet near top of page as context
                snippet = (page_text or "").strip().replace('\n', ' ')
                snippet = snippet[:CTX_CHARS] + ("..." if len(snippet) > CTX_CHARS else "")

                writer.writerow([pdf.name, pageno+1, str(out_path.relative_to(ROOT)), xref, width, height, snippet])

print("PDF image extraction complete.")
print(f"Images placed under: {OUT_DIR}")
print(f"Index: {INDEX_CSV}")
