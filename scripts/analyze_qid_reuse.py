#!/usr/bin/env python3
"""Analyze QID reuse across mapping artifacts and produce a report.

Writes: docs/docs_qid_reuse_report.md
"""
from pathlib import Path
import csv
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / 'docs'

EXPANDED = DOCS / 'docs_qid_expanded.csv'
PDF_MAP = DOCS / 'docs_pdf_map.csv'
IMAGES_MAP = DOCS / 'docs_pdf_images_map.csv'
FINAL = DOCS / 'docs_qid_map_final.csv'
OUT = DOCS / 'docs_qid_reuse_report.md'

def read_csv(path):
    rows = []
    if not path.exists():
        return rows
    with path.open(encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append(r)
    return rows

expanded = read_csv(EXPANDED)
pdf_map = read_csv(PDF_MAP)
img_map = read_csv(IMAGES_MAP)
final_map = read_csv(FINAL)

# Build canonical -> sources mapping
canon_sources = defaultdict(set)

for r in expanded:
    cid = r.get('canonical_id')
    if cid:
        canon_sources[cid].add(r.get('file') or r.get('context') or 'rtf')

for r in pdf_map:
    cid = r.get('canonical_id') or r.get('canonical_id')
    if cid:
        canon_sources[cid].add(r.get('pdf_file') or r.get('pdf') or 'pdf')

for r in img_map:
    cid = r.get('canonical_id')
    if cid:
        canon_sources[cid].add(r.get('pdf_file') or 'pdf_image')

for r in final_map:
    cid = r.get('canonical_id')
    if cid:
        canon_sources[cid].add(r.get('source') or 'final')

# Find canonical IDs referenced by multiple distinct sources (reuse candidates)
reuse = {cid: list(srcs) for cid, srcs in canon_sources.items() if len(srcs) > 1}

lines = []
lines.append('# QID Reuse Report')
lines.append('This report lists canonical question IDs referenced from multiple source artifacts (RTF export, PDF pages, images, or final merge).')
lines.append('')
lines.append(f'- Total canonical IDs with multiple sources: **{len(reuse)}**')
lines.append('')
for cid, srcs in sorted(reuse.items()):
    lines.append(f'## {cid}')
    for s in sorted(srcs):
        lines.append(f'- {s}')
    lines.append('')

if not reuse:
    lines.append('No reuse candidates found; canonical IDs appear referenced from a single source each.')

OUT.write_text('\n'.join(lines), encoding='utf-8')
print(f'Wrote reuse report: {OUT}')
