#!/usr/bin/env python3
"""Audit definitions in data.js against doc_texts.js answers.

Produces: docs/definitions_audit.md
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / 'data.js'
DOC_TEXTS = ROOT / 'doc_texts.js'
OUT = ROOT / 'docs' / 'definitions_audit.md'

data = DATA_JS.read_text(encoding='utf-8')
doc_texts = ''
if DOC_TEXTS.exists():
    try:
        doc_texts = DOC_TEXTS.read_text(encoding='utf-8')
    except Exception:
        doc_texts = DOC_TEXTS.read_text(encoding='cp1252')

# extract definitions titles from data.js
defs = []
for m in re.finditer(r"\{\s*title:\s*'(?P<title>[^']+)'\s*,\s*text:\s*'(?P<text>[^']*)'\s*\}", data):
    defs.append({'title': m.group('title'), 'text': m.group('text')})

lines = []
lines.append('# Definitions Audit')
lines.append('This file checks whether `doc_texts.js` contains text matching each `definitions` entry from `data.js`.')
lines.append('')

for d in defs:
    title = d['title']
    text = d['text']
    found = False
    score = 0
    # simple substring test on title and text
    if title.lower() in doc_texts.lower() or text.lower()[:30].strip() in doc_texts.lower():
        found = True
        score = 1
    lines.append(f'## {title}')
    lines.append(f'- Present in `doc_texts.js`: **{found}**')
    lines.append(f'- Definition snippet: {text[:200]}')
    lines.append('')

OUT.write_text('\n'.join(lines), encoding='utf-8')
print(f'Wrote definitions audit: {OUT}')
