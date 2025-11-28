#!/usr/bin/env python3
"""
Map extracted PDF text and images to canonical question IDs from `data.js`.
Produces:
 - docs/docs_pdf_map.csv (pdf, page, canonical_id, canonical_text, score, match_method)
 - docs/docs_pdf_images_map.csv (pdf, page, image_file, canonical_id, score, match_method)

Scoring: combination of difflib sequence ratio and Jaccard token overlap.
"""
from pathlib import Path
import re
import csv
from difflib import SequenceMatcher

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
PDF_TEXT_DIR = DOCS / "pdf_texts"
QID_CANDIDATES = DOCS / "docs_pdf_qid_candidates.csv"
IMAGES_INDEX = DOCS / "docs_pdf_images_index.csv"
PDF_TEXTS_INDEX = DOCS / "docs_pdf_texts_index.csv"
DATA_JS = ROOT / "data.js"

OUT_MAP = DOCS / "docs_pdf_map.csv"
OUT_IMAGES_MAP = DOCS / "docs_pdf_images_map.csv"

PAGE_SEPARATOR = "\n\n---PAGE---\n\n"


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


# extract canonical ids & texts from data.js (exam-checklist entries)
DATA = DATA_JS.read_text(encoding='utf-8')
CANON = {}
# regex to find objects like { id: 'M1-Q01', text: 'What is price?' }
for m in re.finditer(r"\{\s*id:\s*'(?P<id>M\d+-Q\d+)'\s*,\s*text:\s*'(?P<text>[^']*)'\s*\}", DATA):
    cid = m.group('id')
    ctext = m.group('text')
    CANON[cid] = normalize(ctext)

# fallback: also collect ids from wiki arrays and study-guide ids (simple regex)
for m in re.finditer(r"'(?P<id>M\d+-Q\d+)'", DATA):
    cid = m.group('id')
    if cid not in CANON:
        CANON[cid] = ""

print(f"Found {len(CANON)} canonical IDs (some without text).")

# load pdf text files
pdf_texts = {}
for t in PDF_TEXT_DIR.glob("*.txt"):
    txt = t.read_text(encoding='utf-8')
    pages = txt.split(PAGE_SEPARATOR)
    pdf_texts[t.stem] = pages

# load qid candidates (pdf_file, token, snippet)
qid_candidates = {}
if QID_CANDIDATES.exists():
    with QID_CANDIDATES.open(encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            pdf = Path(row['pdf_file']).stem
            token = row['qid_token']
            snippet = row.get('context_snippet','')
            qid_candidates.setdefault((pdf), []).append((token, snippet))

# helper to score a page against all canonical texts and return top N

def score_page_against_canon(page_text, top_n=3):
    normp = normalize(page_text)
    scores = []
    for cid, ctext in CANON.items():
        # if ctext empty, skip for scoring but still include with low score
        if ctext:
            s1 = seq_ratio(normp, ctext)
            s2 = jaccard(normp, ctext)
            score = max(s1, s2)
        else:
            score = 0.0
        scores.append((cid, score))
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:top_n]

# Map PDF pages
with OUT_MAP.open('w', newline='', encoding='utf-8') as outf:
    w = csv.writer(outf)
    w.writerow(['pdf_file', 'page', 'canonical_id', 'score', 'match_method'])

    for pdf_stem, pages in pdf_texts.items():
        for i, page in enumerate(pages, start=1):
            top = score_page_against_canon(page, top_n=3)
            # write top candidate only if score > 0.25
            if top and top[0][1] > 0.25:
                cid, score = top[0]
                method = 'seq_or_jaccard'
                w.writerow([pdf_stem, i, cid, f"{score:.3f}", method])
            else:
                # still write empty row to indicate unmapped
                w.writerow([pdf_stem, i, '', '0.000', 'none'])

# Map images by page proximity and qid token hints if available
with OUT_IMAGES_MAP.open('w', newline='', encoding='utf-8') as outf:
    w = csv.writer(outf)
    w.writerow(['pdf_file', 'page', 'image_file', 'canonical_id', 'score', 'match_method'])

    # read images index
    if IMAGES_INDEX.exists():
        with IMAGES_INDEX.open(encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                pdf = Path(row['pdf_file']).stem
                page = int(row['page_number'])
                image_file = row['image_file']
                # candidate qid tokens on same pdf
                candidates = []
                if pdf in qid_candidates:
                    for token, snippet in qid_candidates[pdf]:
                        # token may not have page info; we'll match text in page snippet
                        candidates.append((token, snippet))
                # get best page-based mapping
                pages = pdf_texts.get(pdf, [])
                page_text = pages[page-1] if 0 <= page-1 < len(pages) else ''
                top = score_page_against_canon(page_text, top_n=3)
                best_cid = ''
                best_score = 0.0
                method = 'none'
                if top and top[0][1] > 0.25:
                    best_cid, best_score = top[0]
                    method = 'page_text'
                # try token-based resolution: if any token matches canonical id directly
                for token, snippet in candidates:
                    # normalize token to possible forms (e.g., Q1 -> M1-Q01?) We attempt to find any canonical id where token occurs in canonical text
                    ntok = normalize(token)
                    for cid, ctext in CANON.items():
                        if ntok and ntok in ctext:
                            # higher confidence
                            best_cid = cid
                            best_score = max(best_score, 0.9)
                            method = 'token_in_canonical'
                            break
                    if method == 'token_in_canonical':
                        break

                w.writerow([pdf, page, image_file, best_cid, f"{best_score:.3f}", method])

print('Mapping complete.')
print(f'Wrote: {OUT_MAP} and {OUT_IMAGES_MAP}')
