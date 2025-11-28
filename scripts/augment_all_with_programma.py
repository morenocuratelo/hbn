#!/usr/bin/env python3
import csv
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manual_csv = root / 'docs' / 'docs_qid_manual_review.csv'
programma = root / 'docs' / 'Programma.md'
out_csv = root / 'docs' / 'manual_review_all_suggested.csv'
out_md = root / 'docs' / 'manual_review_all_suggested.md'

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
    candidate = (r.get('candidate_id') or '').strip()
    context = (r.get('context_snippet') or '')
    suggestion = ''
    reason = ''
    # Heuristic rules based on Programma and context:
    # 1) If candidate is M4-* and context mentions 'Module 1' or 'Module 1 -' suggest M1 same Q
    # 2) If candidate is M4-* and context mentions 'Module 3' or 'MindChange' do not suggest
    # 3) If candidate is M4-* and Programma contains relevant section headings that match context keywords, keep as-is (no auto suggestion)
    if candidate.startswith('M4-'):
        if 'Module 1' in context or 'Module 1 -' in context or 'Module 1' in prog_text and 'Placebo' not in context:
            suggested = 'M1-' + candidate.split('-',1)[1]
            suggestion = suggested
            reason = 'Context or Programma indicates Module 1 content; remap M4 → M1 keeping Q number.'
        elif 'Module 3' in context or 'MindChange' in context:
            suggestion = ''
            reason = 'Context mentions Module 3 — no remap.'
        else:
            # additional heuristic: if context contains words from Programma Module 4 (e.g., Placebo, Nocebo, placebo, nocebo, analgesia)
            lowc = context.lower()
            if any(k in lowc for k in ['placebo','nocebo','analgesia','expectation','conditioning','placebo effect','nocebo']):
                suggestion = ''
                reason = 'Context appears to be Module 4 topic; keep as M4.'
            elif any(k in lowc for k in ['brain','memory','google','videogame','multitask','like','digital','3d','2d','social network']):
                # likely Module 3 or Module 1 content — be conservative: if 'Module 1' explicit in context we already handled; otherwise suggest M1
                suggestion = 'M1-' + candidate.split('-',1)[1]
                reason = 'Context keywords match Programma Module 1/3 themes; suggest remap to M1 (conservative).' 
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

# write MD summary with counts
count = sum(1 for _,_,sugg,_ in suggestions if sugg)
with out_md.open('w', encoding='utf-8') as f:
    f.write('# Manual-Review Suggested Remappings (All Rows)\n\n')
    f.write(f'Programma.md found: {bool(prog_text)}\n\n')
    f.write(f'Total manual-review rows processed: {len(suggestions)}\n')
    f.write(f'Total suggestions generated: {count}\n\n')
    f.write('Top suggestions (first 200):\n\n')
    c = 0
    for i,r,sugg,reason in suggestions:
        if not sugg:
            continue
        c += 1
        snippet = (r.get('context_snippet') or '').replace('\n',' ').strip()
        if len(snippet) > 300:
            snippet = snippet[:300] + '...'
        f.write(f'## {i}. {r.get("candidate_id")} → {sugg} — score {r.get("score")}\n')
        f.write(f'- Source: {r.get("source_type")} — `{r.get("source")}`\n')
        f.write(f'- Reason: {reason}\n')
        f.write(f'- Context: {snippet}\n\n')
        if c >= 200:
            break

print(f'Wrote {out_csv} ({len(suggestions)} rows, {count} suggestions) and {out_md}')
