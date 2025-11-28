#!/usr/bin/env python3
import csv
import sys
from pathlib import Path

N = int(sys.argv[1]) if len(sys.argv) > 1 else 200
root = Path(__file__).resolve().parents[1]
input_csv = root / 'docs' / 'docs_qid_manual_review.csv'
out_csv = root / 'docs' / f'manual_review_top{N}.csv'
out_md = root / 'docs' / f'manual_review_top{N}.md'

rows = []
with input_csv.open(newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for r in reader:
        try:
            score = float(r.get('score') or 0)
        except:
            score = 0.0
        r['_score_f'] = score
        rows.append(r)

rows.sort(key=lambda r: r['_score_f'], reverse=True)
top = rows[:N]

# write CSV
with out_csv.open('w', newline='', encoding='utf-8') as f:
    fieldnames = ['rank','source_type','source','candidate_id','score','context_snippet']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for i,r in enumerate(top,1):
        snippet = (r.get('context_snippet') or '').replace('\n',' ').strip()
        if len(snippet) > 400:
            snippet = snippet[:400] + '...'
        writer.writerow({'rank': i,
                         'source_type': r.get('source_type',''),
                         'source': r.get('source',''),
                         'candidate_id': r.get('candidate_id',''),
                         'score': f"{r.get('score','')}",
                         'context_snippet': snippet})

# write preview markdown
with out_md.open('w', encoding='utf-8') as f:
    f.write(f"# Top {N} Manual-Review Candidates\n\n")
    for i,r in enumerate(top,1):
        snippet = (r.get('context_snippet') or '').replace('\n',' ').strip()
        if len(snippet) > 800:
            snippet = snippet[:800] + '...'
        f.write(f"## {i}. {r.get('candidate_id','')} — score {r.get('score','')}\n")
        f.write(f"- Source: {r.get('source_type','')} — `{r.get('source','')}`\n")
        f.write(f"- Context: {snippet}\n\n")

print(f"Wrote {out_csv} and {out_md}")
