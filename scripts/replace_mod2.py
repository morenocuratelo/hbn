#!/usr/bin/env python3
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
# target common mapping and markdown files under docs and docs_md (skip binary/RTF files)
files = list((ROOT / 'docs').glob('**/*')) + list((ROOT / 'docs_md').glob('**/*')) + [ROOT / 'doc_texts.js', ROOT / 'todolist.md']
# filter to text files only
files = [f for f in files if f.is_file() and f.suffix.lower() in ['.md', '.csv', '.js', '.txt', '.json', '.html']]

replacements = [
    ('Modulo 2', 'Module 3'),
    ('Modulo 2 -', 'Module 3 -'),
    ('Modulo 2:', 'Module 3:'),
    ('Module 2', 'Module 3')
]

for f in files:
    if not f.exists():
        print(f"Skip missing: {f}")
        continue
    bak = f.with_suffix(f.suffix + '.bak')
    shutil.copy2(f, bak)
    # Try multiple encodings to be tolerant of files exported on Windows
    encodings = ['utf-8', 'cp1252', 'latin-1']
    text = None
    used_enc = None
    for enc in encodings:
        try:
            text = f.read_text(encoding=enc)
            used_enc = enc
            break
        except Exception:
            continue
    if text is None:
        print(f"Skip unreadable (encoding): {f}")
        continue
    new = text
    for old, newstr in replacements:
        new = new.replace(old, newstr)
    if new != text:
        try:
            f.write_text(new, encoding=used_enc or 'utf-8')
            print(f"Updated: {f} (backup: {bak.name}, encoding: {used_enc})")
        except Exception as e:
            print(f"Failed to write {f}: {e}")
    else:
        print(f"No changes for: {f}")
print('Replace complete.')
