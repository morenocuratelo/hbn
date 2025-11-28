#!/usr/bin/env python3
"""Apply high-confidence RTF->canonical mappings to mapping CSVs and emit a JS mapping file.

This script:
- reads `docs/docs_qid_map_final.csv`
- selects rows with provenance containing 'rtf' and score >= 0.6
- appends any missing mapping rows to `docs/docs_qid_map_final.csv` (with provenance 'rtf_auto_applied')
- writes `data/rtf_mappings.json` and `data_rtf_mappings.js` with a dict {rtf_qid: canonical_id}
"""
import csv
from pathlib import Path
import json


def load_final(csvp: Path):
    rows = []
    with csvp.open(newline='', encoding='utf-8') as fh:
        reader = csv.DictReader(fh)
        for r in reader:
            rows.append(r)
    return rows


def write_final(csvp: Path, rows):
    # assume consistent fieldnames
    fieldnames = ['source_type','source','canonical_id','score','provenance']
    with csvp.with_suffix('.bak').open('w', encoding='utf-8') as bakfh:
        writer = csv.DictWriter(bakfh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    with csvp.open('w', encoding='utf-8', newline='') as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main():
    base = Path('docs')
    final_csv = base / 'docs_qid_map_final.csv'
    if not final_csv.exists():
        print('docs_qid_map_final.csv not found; aborting')
        return

    rows = load_final(final_csv)
    # collect existing (source, canonical)
    seen = set((r['source'], r['canonical_id']) for r in rows)

    # find high-confidence rtf mappings
    to_apply = {}
    for r in rows:
        prov = (r.get('provenance') or '').lower()
        try:
            score = float(r.get('score') or 0)
        except Exception:
            score = 0.0
        src = r.get('source')
        if 'rtf' in prov and score >= 0.6:
            # canonical id
            can = r.get('canonical_id')
            # normalize source like 'RTF:Q1.2' -> 'Q1.2' if prefixed
            if src and src.upper().startswith('RTF:'):
                src_q = src.split(':', 1)[1]
            else:
                src_q = src
            to_apply[src_q] = can

    if not to_apply:
        print('No high-confidence RTF mappings (>=0.6) to apply.')
        return

    # append missing rows into final CSV
    appended = 0
    for src_q, can in to_apply.items():
        src_field = f'RTF:{src_q}'
        if (src_field, can) not in seen:
            new_row = {
                'source_type': 'rtf_qid',
                'source': src_field,
                'canonical_id': can,
                'score': '0.600',
                'provenance': 'rtf_auto_applied'
            }
            rows.append(new_row)
            appended += 1

    if appended:
        write_final(final_csv, rows)
        print(f'Appended {appended} mapping rows to {final_csv}')
    else:
        print('No new rows appended; mappings already present.')

    # write JSON + JS mapping
    out_dir = Path('data')
    out_dir.mkdir(exist_ok=True)
    jsonp = out_dir / 'rtf_mappings.json'
    js_out = Path('data_rtf_mappings.js')
    jsonp.write_text(json.dumps(to_apply, indent=2), encoding='utf-8')
    js_out.write_text('window.HBN_RTF_MAPPINGS = ' + json.dumps(to_apply, indent=2) + ';\n', encoding='utf-8')
    print(f'Wrote {jsonp} and {js_out}')


if __name__ == '__main__':
    main()
