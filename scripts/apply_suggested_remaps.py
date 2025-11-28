#!/usr/bin/env python3
import csv
from pathlib import Path
from shutil import copyfile

root = Path(__file__).resolve().parents[1]
suggested = root / 'docs' / 'manual_review_top200_suggested.csv'
final = root / 'docs' / 'docs_qid_map_final.csv'
backup = root / 'docs' / 'docs_qid_map_final.csv.bak'

if not suggested.exists():
    print('Suggested file not found:', suggested)
    raise SystemExit(1)

# backup final
copyfile(final, backup)
print('Backup written to', backup)

# load existing pairs
existing = set()
rows = []
with final.open(newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        key = (r.get('source',''), r.get('canonical_id',''))
        existing.add(key)
        rows.append(r)

# read suggestions
added = 0
with suggested.open(newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for r in reader:
        sugg = (r.get('suggested_id') or '').strip()
        if not sugg:
            continue
        source = r.get('source','')
        # use source format 'rtf_qid' if source contains 'rtf'
        source_type = 'rtf_qid' if 'rtf' in (source or '').lower() or (r.get('source_type')=='rtf_qid') else r.get('source_type','other')
        canonical = sugg
        key = (f'{source_type},{r.get("source")}', canonical)
        # To compare with existing, we look for existing canonical with same source string
        exists_pair = False
        for e in existing:
            # existing stored as (source, canonical_id)
            if e[0].endswith(r.get('source','')) and e[1]==canonical:
                exists_pair = True
                break
        if exists_pair:
            continue
        # append row
        newrow = {
            'source_type': source_type,
            'source': r.get('source',''),
            'canonical_id': canonical,
            'score': r.get('score',''),
            'provenance': 'program_suggest'
        }
        rows.append(newrow)
        existing.add((newrow['source'] , newrow['canonical_id']))
        added += 1

# write back
with final.open('w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['source_type','source','canonical_id','score','provenance'])
    writer.writeheader()
    for r in rows:
        writer.writerow(r)

print('Added', added, 'suggested remaps to', final)
print('If you want, I can also update data.js; tell me to proceed.')
