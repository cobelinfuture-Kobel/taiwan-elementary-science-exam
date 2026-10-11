# Science Exam S3 | Historical exam extraction and certification pilot (P01)

## Inputs inspected
113-year four source PDF files: G03-S1 MID / FINAL, G04-S1 MID / FINAL. 2 pages each. 40 *text-only true/false* candidates (10/source) collected from page 1 into a **private/local reviewer registry**. Other question types, passages and figures are not presumed processed in this pilot.

## Evidence and audit
- 40 candidates extracted; 36 **provisional** exact-KP matches to the already frozen 187 KP; 4 `KP_UNRESOLVED` (do not force an ID).
- 10 G03-S1 MID answer letters O/X appear in the PDF **text layer**, yet the first-page **visible render shows blank parentheses**. They must be marked `TEXT_LAYER_OX_NOT_VISIBLE_IN_RENDER`, not a verified answer key. 30 more candidates have no key. Accordingly, `ANSWER_VERIFIED = 0`.
- The original PDFs contain unneeded student/form header spaces, and at least one contains teacher attribution. Do not republish exam page scans, names, drive IDs, or verbatim question text without explicit reuse rights.
- S3 **public GitHub** contains only source-less counts, a question admission validator, synthetic tests and a status page, not the private raw question text.
- Original question numbering, source PDF SHA-256, PDF page, text-layer marker, mapping status, and dependencies remain in the private local reviewer registry.
- Phase one uses text-based TF items only. All image/reading/list questions remain blocked pending whole-group asset extraction.
- The public admission gate requires complete visual source review + independently validated answer + KP reviewer approval + all assets + public reuse rights + final `CERTIFIED_PUBLIC` state. It fails closed otherwise.
- This pilot does not change Math Generator, KP Authority source files, or the S2 site A4 two-column renderer.

## Evidence state
```
EXACT_SOURCE_PDFS = 4
TEXT_ONLY_CANDIDATES = 40
PROVISIONAL_KP_MATCHES = 36
KP_UNRESOLVED = 4
PDF_HIDDEN_TEXT_OX_HINTS = 10
KEY_ABSENT = 30
ANSWER_VERIFIED = 0
PUBLIC_CERTIFIED = 0
REUSE_RIGHTS = NOT_VERIFIED
```

## Next stop
Obtain original key pages/teacher answer sets or independently review answers, then check permission to republish scanned exam text. Move **only reviewed + permitted** candidates into an admitted bank in a separate PR. For picture/reading tasks, create atomic context-group source assets, record dependencies, and ensure dual-column browser geometry before admitting any item.
