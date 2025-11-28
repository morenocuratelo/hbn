# Module 2 → Module 3 Mapping Changelog

Date: 2025-11-28

Summary:
- Purpose: locate and map any orphan references to "Modulo 2" / "Module 2" into the canonical Module 3 taxonomy, operating only on editable artifacts (CSV/MD/TXT/JS). Binary RTF files are intentionally left untouched per project decision.

What I did:
- Scanned the repository for occurrences of "Modulo 2" / "Module 2" and for canonical IDs with the prefix `M2-` in editable artifacts.
- Checked mapping outputs and expanded inventories under `docs/` (notably `docs_qid_expanded.csv`, `docs_qid_map_expanded.csv`, `docs_qid_manual_review.csv`, and `docs_qid_map_final.csv`).

Findings:
- No canonical `M2-` IDs were present in any editable artifacts or mapping CSVs.
- All active, editable text artifacts and mapping outputs either already reference Module 3 (or Module 1/4), or contain empty/unmapped rows; none required a programmatic rename from Module 2.
- The only remaining occurrences of the literal string "Modulo 2" are inside binary/RTF files (e.g. `docs/Multiple Questions.rtf`) and in backup files (`*.bak`). These were intentionally not modified.

Actions taken:
- Created this changelog to document the scan and decision.
- No changes made to `data.js` or mapping CSVs because there were no editable entries to remap.

Recommendations / Next steps:
1. If you want canonical QIDs extracted from the binary RTF (`docs/Multiple Questions.rtf`) to be remapped:
   - Export the RTF to a plain-text or MD form (manually or using `unrtf` / Word Save-as) and place the result under `docs/` (e.g. `docs/Multiple Questions.md`).
   - I can then run the rescoring/mapping pipeline on that extracted text and apply safe mappings into `docs/docs_qid_map_final.csv` and `data.js`.
2. If you prefer to keep the RTF as authoritative archive but want the student-facing site to list those questions under Module 3, follow step 1 and I will auto-merge high-confidence proposals into `data.js` and mapping CSVs.

Files inspected (editable):
- `docs/docs_qid_expanded.csv`, `docs/docs_qid_map_expanded.csv`, `docs/docs_qid_manual_review.csv`, `docs/docs_qid_map_final.csv`, `docs_md/Ripasso.md` (backups checked), `doc_texts.js.final.bak` (backup checked), `todolist.md`.

Files left untouched:
- `docs/Multiple Questions.rtf` (binary RTF) and other binary `.docx`/.rtf files (per decision).

If you want me to proceed with extracting text from the RTF and mapping those QIDs into Module 3, say "Yes, extract and map RTF" and I'll proceed (I'll create a text export backup first).

Actions performed (2025-11-28):

- Extracted `docs/Multiple Questions.rtf` to:
   - `docs/Multiple Questions.extracted.md`
   - `docs/Multiple Questions.extracted.txt`
   A backup of the original RTF was preserved at `docs/Multiple Questions.rtf.bak`.

- Re-ran the rescoring pipeline (`scripts/rescore_mappings.py`) to incorporate the newly-extracted text into mapping candidates.

- Attempted to auto-apply high-confidence mappings (threshold >= 0.6). Result: no RTF-derived mappings met the >=0.6 confidence threshold, so no mapping rows were appended and `data.js` was not modified.

Notes:
- The extraction made the previously-binary Module 2 content available for mapping and manual review (the MD file contains the "Modulo 2" sections). However, the rescoring output produced only low/medium confidence candidates for those RTF QIDs; we should proceed with a manual review pass or lower the auto-apply threshold if you want some automated merges (I do not recommend lowering the threshold without review).

Next steps (pick one):
- Manual review: I can generate a prioritized CSV of RTF-extracted QIDs with top candidate canonical IDs (score + context) for your approval in small batches.
- Auto-apply with lower threshold: I can re-run `scripts/apply_rtf_mappings.py` with a lower threshold (e.g., 0.5) and create backups; this increases risk of incorrect merges.
- Stop: keep extracted MD for future manual processing and do not alter mapping CSVs or `data.js`.
