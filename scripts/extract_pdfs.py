#!/usr/bin/env python3
"""
Extract text from PDFs in docs/ and collect QID-like tokens.
Writes:
 - docs/pdf_texts/<pdfname>.txt
 - docs/docs_pdf_texts_index.csv (filename,pages,text_file)
 - docs/docs_pdf_qid_candidates.csv (pdf, token, context_snippet)

Usage: run from repo root: python scripts/extract_pdfs.py
"""
from pathlib import Path
import re
import csv
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
OUT_DIR = DOCS / "pdf_texts"
OUT_DIR.mkdir(parents=True, exist_ok=True)

INDEX_CSV = DOCS / "docs_pdf_texts_index.csv"
QID_CSV = DOCS / "docs_pdf_qid_candidates.csv"

# Regex for QID-like tokens e.g. Q1, Q1.1, Q12.3, Q10a (some slides use variants)
QID_RE = re.compile(r"\bQ\d+(?:\.\d+)?[a-zA-Z]?\b")

def extract_pdf_text(pdf_path: Path) -> str:
    try:
        reader = PdfReader(str(pdf_path))
        pages = []
        for p in reader.pages:
            try:
                text = p.extract_text() or ""
            except Exception:
                text = ""
            pages.append(text)
        return "\n\n---PAGE---\n\n".join(pages)
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return ""

def snippet_around(text: str, match_span, radius=80):
    s, e = match_span
    start = max(0, s - radius)
    end = min(len(text), e + radius)
    return text[start:end].replace('\n', ' ')[:300]

pdf_files = sorted(DOCS.glob("*.pdf"))

with INDEX_CSV.open("w", newline='', encoding='utf-8') as idxf, QID_CSV.open("w", newline='', encoding='utf-8') as qidf:
    idx_writer = csv.writer(idxf)
    qid_writer = csv.writer(qidf)
    idx_writer.writerow(["pdf_file", "pages_estimate", "text_file"])
    qid_writer.writerow(["pdf_file", "qid_token", "context_snippet"])

    for pdf in pdf_files:
        print(f"Processing {pdf.name}...")
        text = extract_pdf_text(pdf)
        text_file = OUT_DIR / (pdf.stem + ".txt")
        try:
            text_file.write_text(text, encoding='utf-8')
        except Exception as e:
            print(f"Error writing text file for {pdf.name}: {e}")
            continue

        # crude pages estimate by counting the page-separator tag
        pages_est = text.count('\n\n---PAGE---\n\n') + 1 if text.strip() else 0
        idx_writer.writerow([pdf.name, pages_est, str(text_file.relative_to(ROOT))])

        # find QID-like tokens
        for m in QID_RE.finditer(text):
            token = m.group(0)
            snippet = snippet_around(text, m.span())
            qid_writer.writerow([pdf.name, token, snippet])

print("PDF extraction complete.")
print(f"Wrote text files to: {OUT_DIR}")
print(f"Index: {INDEX_CSV}")
print(f"QID candidates: {QID_CSV}")
