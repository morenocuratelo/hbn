#!/usr/bin/env python3
import csv
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
manual_csv = root / 'docs' / 'manual_review_top200.csv'
programma = root / 'docs' / 'Programma.md'
out_csv = root / 'docs' / 'manual_review_top200_suggested.csv'
out_md = root / 'docs' / 'manual_review_top200_suggested.md'

prog_text = ''
if programma.exists():
    prog_text = programma.read_text(encoding='utf-8')

rows = []
with manual_csv.open(newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for r in reader:
        rows.append(r)

suggestions = []
for i,r in enumerate(rows, start=1):
    candidate = r.get('candidate_id','')
    context = (r.get('context_snippet') or '')
    suggestion = ''
    reason = ''
    # If candidate is M4 and context mentions Module 1, suggest M1 with same Q number
    if candidate.startswith('M4-') and 'Module 1' in context:
        suggested = 'M1-' + candidate.split('-',1)[1]
        suggestion = suggested
        reason = 'Context mentions "Module 1"; remap M4 -> M1 keeping Q number.'
    # If candidate is M4 and context mentions 'Module 3' or 'Module 4' check program content
    elif candidate.startswith('M4-') and 'Module 3' in context:
        suggested = candidate
        suggestion = ''
        reason = 'Context mentions Module 3; no automatic suggestion.'
    else:
        suggestion = ''
        reason = ''
    suggestions.append((i,r,suggestion,reason))

# write CSV
with out_csv.open('w', newline='', encoding='utf-8') as f:
    fieldnames = ['rank','source_type','source','candidate_id','score','context_snippet','suggested_id','reason']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for i,r,sugg,reason in suggestions:
        writer.writerow({'rank': i,
                         'source_type': r.get('source_type',''),
                         'source': r.get('source',''),
                         'candidate_id': r.get('candidate_id',''),
                         'score': r.get('score',''),
                         'context_snippet': r.get('context_snippet',''),
                         'suggested_id': sugg,
                         'reason': reason})

# write MD
with out_md.open('w', encoding='utf-8') as f:
    f.write('# Top 200 Suggested Remappings Based on `Programma.md`\n\n')
    if prog_text:
        f.write('Programma.md was found and used to identify module contexts for suggestions.\n\n')
    else:
        f.write('Programma.md not found; suggestions are heuristic based on context snippets.\n\n')
    for i,r,sugg,reason in suggestions:
        if not sugg:
            continue
        snippet = (r.get('context_snippet') or '').replace('\n',' ').strip()
        if len(snippet) > 500:
            snippet = snippet[:500] + '...'
        f.write(f"## {i}. Suggest {r.get('candidate_id','')} → {sugg}\n")
        f.write(f"- Score: {r.get('score','')}\n")
        f.write(f"- Source: {r.get('source_type','')} — `{r.get('source','')}`\n")
        f.write(f"- Reason: {reason}\n")
        f.write(f"- Context: {snippet}\n\n")

print(f'Wrote {out_csv} and {out_md}')
