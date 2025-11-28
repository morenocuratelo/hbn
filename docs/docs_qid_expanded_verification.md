**Extraction Summary**

**Source file:** `docs/Multiple Questions.rtf`

**Output CSV:** `docs/docs_qid_expanded.csv`

**Counts by Answer-Key Context**

- Module 1 - General: 32 entries (Q1.1 → Q16.2)
- Part 2 - Specific Studies: 9 entries (Q1.1 → Q4.3)
- Part 3 - Circuitry: 24 entries (Q1.1 → Q12.2)
- Module 3 - Mind Change: 14 entries (Q1.1 → Q7.2)

**Total extracted answer-key rows:** 79

**Quick Verification Notes**

- The CSV contains the QID token as presented in the RTF (local numbering like `Q1.1`, `Q2.1`, ...), together with the literal answer (A–D) and the answer-key context (e.g., `Module 1 - General`).
- The repository `data.js` and `audit_qid.md` use a different canonical QID naming scheme (e.g., `M1-Q01`, `M3-Q07`, `M4-Q05`). These are not 1:1 string-equal to the RTF tokens. A mapping step is required to reconcile the two systems.

**Recommended next steps (I can run these next):**

1. Create a mapping table that links each RTF token (e.g., `Module 1 - General | Q1.1`) to the canonical ID used in `data.js` (e.g., `M1-Q01`). This can be semi-automated by using the human-readable question text as a join key (matching the RTF question header to the `data.js` exam-checklist text).
2. After the mapping is created, run an automated cross-check that flags:
   - RTF QIDs present in the CSV but missing in `data.js` (or vice versa)
   - Duplicate canonical IDs referenced by multiple RTF entries
3. Optionally: extract the full question text and options into the CSV (currently the CSV stores only the qid + answer). I can extend the extractor to include the full question and the options (A–D) if you want the complete per-item dataset.

**Current status**

- Created `docs/docs_qid_expanded.csv` and this verification note.
- Next (recommended): I can produce the mapping stage (step 1) — confirm if you want me to attempt an automatic mapping using fuzzy text matching (I will then create `docs/docs_qid_map_expanded.csv`) or if you prefer to provide the canonical mapping rules manually.
