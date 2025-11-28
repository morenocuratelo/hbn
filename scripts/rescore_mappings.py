#!/usr/bin/env python3
"""Rescore existing mapping outputs with improved heuristics.

Produces:
 - docs/docs_qid_manual_review.csv  (all mapping candidates with score < 0.4)
 - docs/docs_qid_map_final.csv      (merged high-confidence mappings, score >= 0.4)

Heuristics: combine difflib seq ratio, Jaccard token overlap, n-gram overlap,
and char 5-gram overlap. Boost when RTF snippet hints point to a canonical id,
and boost when token hints (RTF QIDs) match canonical ids.
"""
from pathlib import Path
import re
import csv
from difflib import SequenceMatcher
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
DATA_JS = ROOT / "data.js"

PDF_MAP = DOCS / "docs_pdf_map.csv"
IMAGES_MAP = DOCS / "docs_pdf_images_map.csv"
QID_EXPANDED = DOCS / "docs_qid_expanded.csv"
QID_EXPANDED_MAP = DOCS / "docs_qid_map_expanded.csv"

OUT_MANUAL = DOCS / "docs_qid_manual_review.csv"
OUT_FINAL = DOCS / "docs_qid_map_final.csv"


def normalize(text: str) -> str:
    if not text:
        return ""
    s = text.lower()
    s = re.sub(r"[\r\n]+", " ", s)
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def jaccard(a: str, b: str) -> float:
    sa = set(a.split())
    sb = set(b.split())
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def seq_ratio(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()


def ngram_set(text: str, n: int):
    toks = text.split()
    if len(toks) < n:
        return set()
    return set([" ".join(toks[i:i+n]) for i in range(len(toks) - n + 1)])


def ngram_overlap(a: str, b: str, n=2) -> float:
    sa = ngram_set(a, n)
    sb = ngram_set(b, n)
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def char_ngram_set(text: str, n=5):
    s = text.replace(" ", "")
    if len(s) < n:
        return set()
    return set([s[i:i+n] for i in range(len(s) - n + 1)])


def char_ngram_overlap(a: str, b: str, n=5) -> float:
    sa = char_ngram_set(a, n)
    sb = char_ngram_set(b, n)
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


# load canonical texts from data.js (exam-checklist and questions arrays)
DATA = DATA_JS.read_text(encoding='utf-8')
CANON = {}
for m in re.finditer(r"\{\s*id:\s*'(?P<id>M\d+-Q\d+)'\s*,\s*text:\s*'(?P<text>[^']*)'\s*\}", DATA):
    cid = m.group('id')
    ctext = m.group('text')
    CANON[cid] = normalize(ctext)

# also collect question objects in exam-checklist blocks (multi-line)
for m in re.finditer(r"\{\s*id:\s*'(?P<id>M\d+-Q\d+)'\s*,\s*text:\s*'(?P<text>[^']*?)'\s*\}", DATA, re.S):
    cid = m.group('id')
    if cid not in CANON:
        CANON[cid] = normalize(m.group('text'))

print(f"Loaded {len(CANON)} canonical IDs.")


# load prior expanded rtf->canonical mapping hints (if available)
RTF_HINTS = {}
if QID_EXPANDED_MAP.exists():
    with QID_EXPANDED_MAP.open(encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rtf = row.get('rtf_qid') or row.get('rtf_id')
            cid = row.get('canonical_id')
            text = row.get('rtf_text') or row.get('canonical_text') or ''
            score = float(row.get('score') or 0)
            if rtf:
                RTF_HINTS.setdefault(rtf, []).append({'canonical_id': cid, 'rtf_text': normalize(text), 'score': score})


# load pdf page texts to be able to cross-match rtf text snippets if available
PDF_TEXT_DIR = DOCS / 'pdf_texts'
PAGE_SEPARATOR = "\n\n---PAGE---\n\n"
pdf_texts = {}
if PDF_TEXT_DIR.exists():
    for t in PDF_TEXT_DIR.glob('*.txt'):
        try:
            txt = t.read_text(encoding='utf-8')
        except Exception:
            try:
                txt = t.read_text(encoding='cp1252')
            except Exception:
                txt = ''
        pages = txt.split(PAGE_SEPARATOR)
        pdf_texts[t.stem] = pages


# helper to compute improved score between source text and canonical text
def improved_score(source_text: str, canonical_text: str, rtf_snippet: str = '') -> float:
    a = normalize(source_text)
    b = normalize(canonical_text)
    if not a or not b:
        return 0.0
    s_seq = seq_ratio(a, b)
    s_jac = jaccard(a, b)
    s_ngram2 = ngram_overlap(a, b, n=2)
    s_ngram3 = ngram_overlap(a, b, n=3)
    s_char5 = char_ngram_overlap(a, b, n=5)
    # base weighted sum
    score = 0.35 * s_seq + 0.25 * s_jac + 0.2 * s_ngram2 + 0.1 * s_ngram3 + 0.1 * s_char5

    # boost if rtf_snippet overlaps strongly with canonical
    if rtf_snippet:
        rs = normalize(rtf_snippet)
        if rs:
            s_rtf = max(seq_ratio(rs, b), jaccard(rs, b), ngram_overlap(rs, b, n=2))
            if s_rtf > 0.4:
                score = max(score, 0.6 * s_rtf + 0.4 * score)

    # clamp
    return min(1.0, score)


# collect candidate rows from existing pdf_map and images_map
CANDIDATES = []
def load_csv_rows(path):
    rows = []
    if not path.exists():
        return rows
    with path.open(encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append(r)
    return rows

pdf_rows = load_csv_rows(PDF_MAP)
img_rows = load_csv_rows(IMAGES_MAP)

# Also include RTF-extracted qids as candidates (map qid -> canonical via hints or try fuzzy)
rtf_rows = []
if QID_EXPANDED.exists():
    with QID_EXPANDED.open(encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            rtf_rows.append(r)


# Build final mapping decisions
manual_rows = []
final_rows = []

# Helper to pick best canonical for a source text
def best_canonical_for_text(source_text, rtf_hint_ids=None, rtf_snippet=''):
    best = (None, 0.0)
    for cid, ctext in CANON.items():
        sc = improved_score(source_text, ctext, rtf_snippet=rtf_snippet)
        # if rtf_hint suggests this cid, give a small uplift
        if rtf_hint_ids and cid in rtf_hint_ids:
            sc = max(sc, sc * 1.25 + 0.05)
        if sc > best[1]:
            best = (cid, sc)
    return best


print('Scoring PDF page candidates...')
for row in pdf_rows:
    pdf = row.get('pdf_file') or row.get('pdf') or ''
    page = row.get('page') or ''
    src_text = ''
    # try to pull page text
    try:
        if pdf:
            stem = Path(pdf).stem
            pages = pdf_texts.get(stem, [])
            if page:
                pi = int(page) - 1
                if 0 <= pi < len(pages):
                    src_text = pages[pi]
    except Exception:
        src_text = ''
    # try rtf hints matching page/pdf
    rtf_hint_ids = set()
    # also use any rtf snippets that mention this pdf stem
    rtf_snippet = ''
    for rtf, hints in RTF_HINTS.items():
        for h in hints:
            if stem in (pdf or ''):
                rtf_hint_ids.add(h.get('canonical_id') or '')
                if h.get('rtf_text'):
                    rtf_snippet = h.get('rtf_text')

    cid, score = best_canonical_for_text(src_text, rtf_hint_ids=rtf_hint_ids, rtf_snippet=rtf_snippet)
    final_decision = cid if score >= 0.4 else ''
    if score < 0.4:
        manual_rows.append({'source_type': 'pdf_page', 'source': f"{pdf}#page={page}", 'candidate_id': cid or '', 'score': f"{score:.3f}", 'context_snippet': (src_text or '')[:300]})
    if final_decision:
        final_rows.append({'source_type': 'pdf_page', 'source': f"{pdf}#page={page}", 'canonical_id': final_decision, 'score': f"{score:.3f}", 'provenance': 'rescored_pdf'})

print('Scoring PDF image candidates...')
for row in img_rows:
    pdf = row.get('pdf_file') or row.get('pdf') or ''
    page = row.get('page') or ''
    image = row.get('image_file') or ''
    src_text = ''
    try:
        if pdf:
            stem = Path(pdf).stem
            pages = pdf_texts.get(stem, [])
            if page:
                pi = int(page) - 1
                if 0 <= pi < len(pages):
                    src_text = pages[pi]
    except Exception:
        src_text = ''
    cid, score = best_canonical_for_text(src_text, rtf_snippet='')
    if score < 0.4:
        manual_rows.append({'source_type': 'pdf_image', 'source': f"{pdf}#page={page}#{image}", 'candidate_id': cid or '', 'score': f"{score:.3f}", 'context_snippet': (src_text or '')[:300]})
    if score >= 0.4:
        final_rows.append({'source_type': 'pdf_image', 'source': f"{pdf}#page={page}#{image}", 'canonical_id': cid, 'score': f"{score:.3f}", 'provenance': 'rescored_image'})

print('Processing RTF QID candidates...')
for r in rtf_rows:
    rtf_qid = r.get('qid') or r.get('rtf_qid') or ''
    ctx = r.get('context') or ''
    # If RTF_HINTS has canonical mapping, promote high-score ones
    hints = RTF_HINTS.get(rtf_qid, [])
    chosen = None
    chosen_score = 0.0
    # prefer hint with highest original score
    for h in hints:
        cid = h.get('canonical_id')
        sc = float(h.get('score') or 0)
        if cid and sc > chosen_score:
            chosen = cid
            chosen_score = sc
    # fallback: attempt to match by canonical texts using context (if present)
    if not chosen:
        # try to match context string to canonical texts
        src = r.get('context') or ''
        cid, sc = best_canonical_for_text(src, rtf_snippet='')
        chosen = cid
        chosen_score = sc

    if chosen_score < 0.4:
        manual_rows.append({'source_type': 'rtf_qid', 'source': f"RTF:{rtf_qid}", 'candidate_id': chosen or '', 'score': f"{chosen_score:.3f}", 'context_snippet': (ctx or '')[:300]})
    else:
        final_rows.append({'source_type': 'rtf_qid', 'source': f"RTF:{rtf_qid}", 'canonical_id': chosen, 'score': f"{chosen_score:.3f}", 'provenance': 'rtf_hint_or_rescore'})

# write manual review CSV
with OUT_MANUAL.open('w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=['source_type', 'source', 'candidate_id', 'score', 'context_snippet'])
    w.writeheader()
    for r in manual_rows:
        w.writerow(r)

print(f'Wrote manual review: {OUT_MANUAL} ({len(manual_rows)} rows)')

# write final merged CSV
with OUT_FINAL.open('w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=['source_type', 'source', 'canonical_id', 'score', 'provenance'])
    w.writeheader()
    for r in final_rows:
        w.writerow(r)

print(f'Wrote final mapping: {OUT_FINAL} ({len(final_rows)} rows)')

print('Rescore complete.')
