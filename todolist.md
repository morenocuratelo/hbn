# **🤖 HBN Interactive Modules Refactor - To-Do List Dettagliata**

**Data Creazione:** 27/11/2025

**Stato Attuale:** 🟡 IN CORSO (parziale)

**Priorità Generale:** ALTA

**Risorsa Assegnata:** Team HBN Platform

## **🎯 Obiettivo della Task**

L'obiettivo è implementare completamente la funzionalità di riallineamento dei percorsi di studio interattivi basati sulle Domande di Ripasso, in modo che sia robusta e integrata con i moduli Module 1: Neuroeconomics, Module 3: Mind Change e Module 4: Context Effects.

## **📋 Task Breakdown (Scomposizione delle Attività)**

## **🟢 Aggiornamenti Recenti**

- **Data:** 28/11/2025
- **Azioni completate:**
	- `Decide DOC_DOMANDE format` — adottato formato template-literal backtick per `window.DOC_DOMANDE` (duplicato rimosso).
	- `Lint & Format doc_texts.js` — eseguiti Prettier e `eslint --fix` dove applicabile.
	- `Final syntax check` — Node VM compile-only check confermato (`PARSE_OK`).
	- `Create ESLint config` — aggiunta `.eslintrc.json`.
	- `Create eslint.config.cjs` — aggiunta config compatibile ESLint v9.

Questi aggiornamenti sono già registrati nell'elenco delle attività principali; le attività di contenuto (mappatura QID, refactor delle sezioni e mini-quiz) restano da svolgere.

## **✅ Task Completati (sintesi)**

- [x] `Decide DOC_DOMANDE format` — adottato formato template-literal backtick per `window.DOC_DOMANDE`.
- [x] `Lint & Format doc_texts.js` — eseguiti Prettier e `eslint --fix` dove applicabile.
- [x] `Final syntax check` — Node VM compile-only check confermato (`PARSE_OK`).
- [x] `Create ESLint config` — aggiunta `.eslintrc.json`.
- [x] `Create eslint.config.cjs` — aggiunta config compatibile ESLint v9.
 - [x] `Finalize and commit` — creato backup finale `doc_texts.js.final.bak` e commit (d2ed7c5).

## **🔎 Risultati Scan QID (28/11/2025)**

- QID univoci trovati in `doc_texts.js`: **73**
- QID univoci trovati in `data.js`: **73**
- QID presenti in `data.js` ma mancanti in `doc_texts.js`: **Nessuno**
- QID presenti in `doc_texts.js` ma mancanti in `data.js`: **Nessuno**

Conclusione: il dataset di QID tra `data.js` e `doc_texts.js` è coerente. `app.js` non contiene riferimenti letterali ai QID da verificare.

## **📦 Inventario `docs/` (inizio, 28/11/2025)**

Ho effettuato una prima scansione della cartella `docs/` e trovato i seguenti file (ordinati):

 - `1_Cortical control of a tablet computer by people with paralysis.md`
 - `1_Cortical control of a tablet computer by people with paralysis.pdf`
 - `1_Neuro_mech-1.pdf`
 - `2_1xn2.Fqv7c8lyq6Fk.file.md`
 - `2_1xn2.Fqv7c8lyq6Fk.file.pdf`
 - `2_MindChange_part1.pdf`
 - `2_MindChange_part2.pdf`
 - `2_MindChange_part3.pdf`
 - `2_RCT_PSYCH_MECHANISMS.pdf`
 - `3_cp9q.vZHFBn9oMUZP.file.pdf`
 - `Domande di ripasso.docx`
 - `Domande di ripasso.md`
 - `Key takeaways.docx`
 - `Key takeaways.md`
 - `MODULE 3 synthesis.docx`
 - `Ripasso.docx`
 - `Synth.docx`

Prossimo passo (in questa attività): estrarre per ogni file il tipo (pdf/md/docx) e mappare manualmente le associazioni slide→QID. Vuoi che proceda e generi una tabella CSV/markdown con colonne `filename, type, suggested module/notes` ora? 




### **🔥 Fase 1: Discovery & Preparazione Contenuti**

**Stima Sforzo:** 2 giorni

| ID Task | Attività | Stato | Priorità | Note |
| :---- | :---- | :---- | :---- | :---- |
| 1.1 | Inventario completo degli asset `docs/*.pdf` e tracciamento dei riferimenti slide ↔ Domande di Ripasso | [x] | ALTA | Coperto in `docs/docs_inventory.md` + indici `docs_pdf_texts_index.csv` / `docs_pdf_images_index.csv` |
| 1.2 | Verifica coerenza IDs (M1/M3/M4) tra `doc_texts.js`, `data.js` e app di rendering | [x] | CRITICA | QID allineati (`data.js`=73, `doc_texts.js`=73, nessun mismatch) |
| 1.3 | Aggiornare la tassonomia: rinominare l'ex "Module 3" in "Module 3: Mind Change" nei dataset sorgente | [ ] | MEDIA | Garantire che i file markdown di origine riflettano la nuova nomenclatura |
| 1.4 | **Mappa coperture domande:** analizzare ogni sezione in `data.js` (definitions, text-block, process-flow, chart-section, grid-cards) e segnare quali hanno/mancano `wiki` arrays | [x] | CRITICA | Coperto in `audit_qid.md` (module→sezione→QID coverage) |
| 1.5 | Costruire schema modulo→QID di riuso: identificare quali Domande possono essere condivise tra sezioni senza duplicazione | [x] | ALTA | Generato `docs/docs_qid_reuse_report.md` via `scripts/analyze_qid_reuse.py` — review recommended |
| 1.6 | Audit delle definizioni statiche: elencare tutte le `definitions` arrays e verificare se esistono risposte corrispondenti in `doc_texts.js` | [x] | MEDIA | Generato `docs/definitions_audit.md` via `scripts/audit_definitions.py` — follow-up: convert definitions to study-guide cards |

### **🔍 Fase 1.5: Risoluzione Contenuti "Module 3" Orfani**

**Stima Sforzo:** 0.5 giorni

| ID Task | Attività | Stato | Priorità | Note |
| :---- | :---- | :---- | :---- | :---- |
| 1.5.1 | Decisione strategica: creare view dedicata `module2` in `HBN_DATA.nav` oppure fondere contenuti dentro Module 3 | [ ] | CRITICA | Consultare docente/stakeholder per scelta finale |
| 1.5.1 | Decisione strategica: creare view dedicata `module2` in `HBN_DATA.nav` oppure fondere contenuti dentro Module 3 | [x] | CRITICA | Decisione: lasciare i riferimenti `Modulo 2` nei file RTF originali intatti; operare sulle versioni testuali/generate (scansione/estratti) per il riallineamento |
| 1.5.2 | Se fusione → mappare QID "Module 3" (Mind Change topics) dentro le sezioni di Module 3 esistenti | [ ] | ALTA | Aggiornare `data.js` sections per includere nuovi wiki IDs (pendente — procederò su richiesta) |
| 1.5.3 | Se view separata → creare entry nav, intro, hero, e almeno 3 sezioni interattive (study-guide, process-flow, exam-checklist) | [ ] | ALTA | Riutilizzare pattern da module1/module3/module4 |
| 1.5.4 | Aggiornare `doc_texts.js` heading: rinominare "Module 3" in "Module 3" (o "Module 3" se view dedicata) per coerenza | [ ] | MEDIA | Garantire che i prompt parser riconoscano il nuovo modulo |

### **🔨 Fase 2: Core Implementation & UI Sync**

**Stima Sforzo:** 3 giorni

| ID Task | Attività | Stato | Priorità | File Coinvolti |
| :---- | :---- | :---- | :---- | :---- |
| 2.1 | Refactor di `doc_texts.js` per riallineare heading, prompt e risposte ai nuovi moduli | [ ] | CRITICA | doc_texts.js |
| 2.2 | **Ristruttura sezioni statiche (definitions):** sostituire array `definitions` in ogni modulo con widget `study-guide` linkati a QID | [ ] | ALTA | data.js (module1, module3, module4) |
| 2.3 | **Ristruttura sezioni statiche (text-block):** convertire `text-block` in `interactive-list` o `accordion-group` alimentati da risposte di `doc_texts.js` | [ ] | ALTA | data.js (sostituire content HTML con items[{title, detail}]) |
| 2.4 | **Allinea process-flow:** aggiungere `wiki: [...]` arrays a tutte le sezioni `process-flow` mappando ogni step a Domande pertinenti | [ ] | CRITICA | data.js (Module 1 DDM flow, Module 3 transactive memory, Module 4 expectation axis) |
| 2.5 | **Allinea chart-section:** aggiungere `wiki: [...]` a `chartFraming`, `chartMaguire`, `chartHormones`, `chartParkinsonDopamine` etc. | [ ] | ALTA | data.js (verificare che ogni grafico abbia footer wiki interattivo) |
| 2.6 | Implementare logiche di fallback/validazione aggiuntive in `app.js` per gestire i moduli ridenominati | [ ] | MEDIA | app.js |
| 2.7 | Integrare riferimenti alle slide pdf (tooltip/link opzionale) nei componenti interattivi rilevanti | [ ] | BASSA | data.js, assets UI (differire se troppo complesso) |

### **🧩 Fase 2.5: Integrazione MCQ Contestuali**

**Stima Sforzo:** 1.5 giorni

| ID Task | Attività | Stato | Priorità | File Coinvolti |
| :---- | :---- | :---- | :---- | :---- |
| 2.5.1 | Creare nuovo widget `mini-quiz` in `app.js` che replica logica `question-browser` ma con filtro su subset QID | [ ] | ALTA | app.js (nuovo case in renderModuleSection) |
| 2.5.2 | Inserire `mini-quiz` in Module 1 dopo la sezione "Prospect Theory and Framing" con QID M1-Q05, M1-Q06 | [ ] | MEDIA | data.js (module1.sections) |
| 2.5.3 | Inserire `mini-quiz` in Module 3 dopo "Videogaming & Brain" con QID M3-Q08, M3-Q09, M3-Q10, M3-Q11 | [ ] | MEDIA | data.js (module3.sections) |
| 2.5.4 | Inserire `mini-quiz` in Module 4 dopo "Pharmacological Probes" con QID M4-Q02, M4-Q03, M4-Q04 | [ ] | MEDIA | data.js (module4.sections) |
| 2.5.5 | Testare che ogni mini-quiz mostri solo le domande filtrate e feedback immediato (risposta corretta visibile) | [ ] | ALTA | Browser testing su tutti i moduli |

### **🧪 Fase 3: Testing e Validazione**

**Stima Sforzo:** 1.5 giorni

| ID Task | Attività | Stato | Priorità | Note |
| :---- | :---- | :---- | :---- | :---- |
| 3.1 | Rieseguire gli script di validazione wiki/ID e sanità dei dati DOM (`node` utilities) | [ ] | ALTA | Obiettivo: 0 ID mancanti, 100% wiki coverage |
| 3.2 | **Coverage audit finale:** verificare che ogni sezione (escluse quelle puramente visive) abbia almeno un wiki ID o study-guide | [ ] | CRITICA | Documentare gap residui e giustificazione |
| 3.3 | Test manuale dell'interfaccia per ciascun modulo (render, checklist, explorer, mini-quiz) | [ ] | ALTA | Verificare persistenza checklist in localStorage |
| 3.4 | Testare footer wiki interattivi: cliccare ogni ID badge per espandere pannello risposta | [ ] | ALTA | Assicurarsi che `mountWikiLinks` funzioni correttamente |
| 3.5 | Verifica coerenza narrativa: ogni percorso modulo deve alternare teoria → domanda → feedback in modo fluido | [ ] | MEDIA | Feedback qualitativo da beta tester |
| 3.6 | Code review incrociata + QA contenuti con docente di riferimento | [ ] | MEDIA | Annotare feedback su GitHub issue |
| 3.7 | Regressione Chart.js: confermare che tutti i grafici (chartFraming, chartMaguire, etc.) renderizzano correttamente | [ ] | ALTA | Verificare che nessun chartId sia stato rimosso accidentalmente |

## **⚠️ Rischi & Blocchi**

* [ ] **Rischio/Blocco 1:** Documentazione parziale nei PDF `docs/` → richiede conferma manuale dei riferimenti slide per ogni QID.  
* [ ] **Rischio/Blocco 2:** Possibili regressioni nei rendering Chart.js dopo la rimozione del vecchio modulo 2 o aggiunta wiki arrays.  
* [ ] **Rischio/Blocco 3:** Disallineamento tra nuove etichette modulo e localStorage chiavi già salvate dagli utenti (es. checklist progress).  
* [ ] **Rischio/Blocco 4:** Sovrapposizione QID tra sezioni diverse può generare duplicazione cognitiva (stesso concetto ripetuto in contesti diversi).  
* [ ] **Rischio/Blocco 5:** Tempo stimato per conversione manuale text-block → interactive widgets potrebbe espandersi se il mapping domanda→risposta è ambiguo.  
* [ ] **Rischio/Blocco 6:** Decisione sulla view "Module 3" potrebbe slittare, bloccando task 1.5.2/1.5.3 e impedendo finalization dei nav links.

## **🔗 Riferimenti & Risorse**

* **Specifiche Funzionali:** docs/Key takeaways.md, docs/Domande di ripasso.md  
* **Slide PDF:** docs\1_Neuro_mech-1.pdf
docs\2_1xn2.Fqv7c8lyq6Fk.file.pdf
docs\2_MindChange_part1.pdf
docs\2_MindChange_part2.pdf
docs\2_MindChange_part3.pdf
docs\2_RCT_PSYCH_MECHANISMS.pdf
docs\3_cp9q.vZHFBn9oMUZP.file.pdf (verificare se convertiti da PDF originali)  
* **Documentazione API:** app.js (renderers e validazione), data.js (schema contenuti), doc_texts.js (source of truth per QID/risposte)  
* **Issue Tracker:** GitHub repo `morenocuratelo/hbn` (branch main)  
* **Modello LLM:** GPT-5.1-Codex (Preview) con temperature basse per la generazione dei testi d'esame  
* **Script di Validazione:** Node.js one-liner per audit wiki IDs (già testato in terminal history)  
* **Pattern Widget Esistenti:** question-browser, prompt-explorer, study-guide, exam-checklist, interactive-list, accordion-group, process-flow

## **Module 2 Mapping Status**

- [x] **Map Module 2 → Module 3:** Completed — scan found no editable artifacts requiring remapping. Remaining "Modulo 2" occurrences are inside binary RTF/docx archives (e.g. `docs/Multiple Questions.rtf`) and `.bak` files which were intentionally left untouched. See `docs/mod2_to_m3_changelog.md` for details and recommended next steps.

