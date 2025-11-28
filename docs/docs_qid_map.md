# Docs QID Map

*(previous content — placeholder)*
# Docs QID Map

This file maps canonical question sources to the QID ranges (as found in the canonical `Multiple Questions.rtf`) and notes whether `Domande di ripasso.md` contains explicit QIDs.

Summary table

| File | Module / Section | QIDs (observed) | Notes |
|---|---:|---|---|
| `Multiple Questions.rtf` | Module 1 (General) | Q1.1–Q16.2 | explicit QIDs present in RTF (Module 1 section)
| `Multiple Questions.rtf` | Neuroeconomics & Decision Making — Part 2 (Specific Studies) | Q1.1–Q4.3 | explicit QIDs present in RTF (Part 2)
| `Multiple Questions.rtf` | Neuroeconomics — Part 3 (Circuitry) | Q1.1–Q4.2 | explicit QIDs present in RTF (Part 3 / Circuitry)
| `Multiple Questions.rtf` | Module 3 — Mind Change | Q1.1–Q7.2 | explicit QIDs present in RTF under 'Module 3: Mind Change'
| `Multiple Questions.rtf` | Module 3 — Videogaming | Q1.1–Q10.2 | explicit QIDs present in RTF under 'Videogaming'
| `Multiple Questions.rtf` | Placebo / Nocebo / RCTs (Module 4 topics) | Q1.1–Q11.2 | explicit QIDs present across placebo sections and RCT-related sections
| `Domande di ripasso.md` | Module 1 / 3 / 4 | (no explicit QIDs) | Contains canonical prompts without QID labels — map manually or generate QIDs

Notes & next steps

- `Multiple Questions.rtf` is the authoritative source for explicit QIDs — the RTF contains question IDs like `Q1.1`, `Q1.2`, etc. I extracted the observed ranges above as an initial mapping.
- `Domande di ripasso.md` contains the canonical list of prompts but does not include explicit QID labels. We have two choices:
	- Generate QIDs for the markdown file (automatic numbering based on module + ordinal), or
	- Map markdown prompts to existing RTF QIDs manually (preferred if you want the same IDs across both files).
- Next immediate action (if you confirm): produce a per-QID row extraction (CSV rows for each explicit QID) by parsing `Multiple Questions.rtf` for every `Qx.y` instance and cross-check against `data.js`/`audit_qid.md`.

If you want, I can now parse every explicit `Qx.y` from `Multiple Questions.rtf` and produce an expanded CSV with one row per QID (question text, module, canonical source, answer key if present). Confirm and I'll proceed.
| filename | type | suggested_module | suggested_QIDs | notes |
| --- | --- | --- | --- | --- |
| **Primary question sources** |  |  |  | The webapp should extract explicit QIDs from the files below. These files contain the canonical ripasso questions and are the authoritative source for mapping QIDs to module pages. |
| `Domande di ripasso.md` | md | All modules | All M1/M3/M4 QIDs | CONTAINS ALL QUESTIONS. Primary source for extracting explicit QIDs and mapping to modules. |
| `Multiple Questions.rtf` | rtf | All modules | All M1/M3/M4 QIDs | CONTAINS ADDITIONAL QUESTIONS. Also a primary Q source. |
| `Domande di ripasso.docx` | docx | All modules | All M1/M3/M4 QIDs | Legacy docx copy — may be redundant. |

| **Lecture PDFs / Professor full lectures (guidelines)** |  |  |  | The following files are full lecture slide decks or lecture syntheses. They generally do NOT contain explicit QIDs and should be used as guideline material (visuals, figures, slide references) when building interactive lectures on the module pages. |
| `MODULE 1_1_6wdx.yFooMSpEweBG.file.pdf` | pdf | Module 1 | none (slides only) | Lecture PDF — guideline for Module 1 interactive content. |
| `MODULE 1_2_1xn2.Fqv7c8lyq6Fk.file.pdf` | pdf | Module 1 | none (slides only) | Lecture PDF — guideline for Module 1. |
| `MODULE 1_3_cp9q.vZHFBn9oMUZP.file.pdf` | pdf | Module 1 | none (slides only) | Lecture PDF — guideline for Module 1. |
| `MODULE 3 synthesis.pdf` | pdf | Module 3 | none (slides only) | Lecture synthesis — guideline for Module 3. |
| `MODULE 3_MindChange_part1.pdf` | pdf | Module 3 | none (slides only) | Lecture PDF — guideline for Module 3. |
| `MODULE 3_MindChange_part2.pdf` | pdf | Module 3 | none (slides only) | Lecture PDF — guideline for Module 3. |
| `MODULE 3_MindChange_part3.pdf` | pdf | Module 3 | none (slides only) | Lecture PDF — guideline for Module 3. |
| `MODULE 4_1_Neuro_mech-1.pdf` | pdf | Module 4 | none (slides only) | Lecture PDF — guideline for Module 4. |
| `MODULE 4_2_RCT_PSYCH_MECHANISMS.pdf` | pdf | Module 4 | none (slides only) | Lecture PDF — guideline for Module 4. |
| `Module 4_synth.rtf` | rtf | Module 4 | none (slides only) | Lecture synthesis (RTF) — guideline for Module 4 interactive content. |

| Other docs (supporting) |  |  |  | Supporting files that may include summaries, key takeaways or conversion artifacts. |
| `1_Cortical control of a tablet computer by people with paralysis.md` | md | Module 4 | M4-Q01..M4-Q24 | Clinical/translation topic — map to Module 4 clinical & methods QIDs; confirm by inspecting file. |
| `1_Cortical control of a tablet computer by people with paralysis.pdf` | pdf | Module 4 | none (slides only) | Slides (lecture slides). Do NOT contain explicit QIDs — use as source for visuals/figures and slide references. |
| `1_Neuro_mech-1.pdf` | pdf | Module 1 | none (slides only) | Slides (lecture slides). Do NOT contain explicit QIDs — use for charts/figures. |
| `2_1xn2.Fqv7c8lyq6Fk.file.md` | md | Unknown | — | Converted artifact; requires manual inspection to map QIDs. |
| `2_1xn2.Fqv7c8lyq6Fk.file.pdf` | pdf | Unknown | none (slides/artifact) | Slides / artifact — likely no explicit QIDs; use only as visual/source material. |
| `3_cp9q.vZHFBn9oMUZP.file.pdf` | pdf | Module 3 (likely) | none (slides only) | Slides (lecture slides). Likely no explicit QIDs; use for visuals and examples. |
| `Key takeaways.docx` | docx | All modules | — | Summary doc — useful to extract highlights for study-guide. |
| `Key takeaways.md` | md | All modules | — | Markdown version of key takeaways. |
| `MODULE 3 synthesis.docx` | docx | Module 3 | M3-Q01..M3-Q17 | Explicitly Module 3 synthesis; high-confidence mapping. |
| `Ripasso.docx` | docx | All modules | — | Generic review doc. |
| `Synth.docx` | docx | All modules | — | Generic synthesis notes. |

Notes:
- Ranges (e.g., `M1-Q01..M1-Q32`) indicate the full set of QIDs for that module as found in `audit_qid.md` and `doc_texts.js`.
- Files flagged `Unknown` should be opened and checked; they may contain slides from multiple modules or be OCR artifacts.
- Next step (recommended): extract explicit QIDs from the primary question sources (`Domande di ripasso.md` and `Multiple Questions.rtf`) and use those to generate a per-module, per-file QID mapping. Then use the lecture PDFs/RTF as guideline assets when converting Q&A into interactive lecture pages.
