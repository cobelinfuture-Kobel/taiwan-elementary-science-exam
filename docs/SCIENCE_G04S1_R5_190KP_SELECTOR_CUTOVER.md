# G04-S1 R5: 190-KP public selector cutover and immutable published bank

## Verified entry conditions

- R4 PR #111 merged to main at `e9acd02641984b1a9afe19582400ce7919cfe985`.
- R4 merge CI `38841210189` and Pages workflow `38841210131`: SUCCESS.
- Original G04-S1 private V1 SHA-256: `ac2122b09caa56afec373303c8a6169b57353bff06794831b508c3a3f5b5e4d5` (45 KPs).
- R4 private 48-KP V2 SHA-256: `0422cbbbf685d20cf2389ecc37fda147291b309ae486f49b16c0c5ba86193389`. This full source stays **outside public GitHub**.

## Additive 190 selector

The existing `science-g03-g04-selector-v2.json` remains intact with 187 legacy KP IDs, titles, and order. The new `science-g03-g04-selector-v3.json` contains the exact 187 rows plus three new G04-S1 KPs:

- `sci_g04s1_01_12` — 風的作用搬運並堆積地表物質 (康軒 PDF page 21);
- `sci_g04s1_02_13` — 水域環境實地調查的準備、觀察與紀錄 (pages 45–46);
- `sci_g04s1_02_14` — 水域調查安全與尊重水生生物 (page 46).

Unit distribution G04-S1: **12 / 14 / 10 / 12 = 48**. Four-term total (G03/G04) = **190**. The adapter still accepts and validates the frozen 187 selector. Exam’s default `loadAuthority()` now reads V3. No student-facing textbook statements or evidence prose are published.

## Important boundary: selector activation is not a question-bank release

The three new KP options are visible in the Exam KP selector, but no approved public historical question has yet been certified against them. A selected KP with insufficient source questions **fails closed**; it must not silently substitute another KP’s question or generate content. The exact source item `SCI_G04_S1_114_MID_002|S1|MC|010` is a **remap candidate only**, from old `sci_g04s1_02_02` to new `sci_g04s1_02_13`; it remains held due original scanned BBox not formally certified. Other previously reviewed questions retain original mappings and science decisions. No question JSON files are modified in this PR.

Existing tooling and index jobs referencing selector V2 remain frozen until **separately governed** downstream index V3 migration. Do not quietly reinterpret old 45-KP source projections.

## Validation

- R5 tests assert that all 187 previous KP metadata rows are byte-for-byte-equivalent as parsed JSON, including unit order and names; V3 adds exactly 3 IDs without duplicates.
- Tests assert V2 and V3 adapters both validate, new IDs are findable, malformed or duplicate KPs fail closed, and all published bank files contain none of the three new canonical IDs.
- Existing S2 / P12 tests continue on V2. PR and post-merge CI are required; Pages deploy success must be read back independently. Browser/live HTTP acceptance still requires direct observation (GitHub Actions success alone is not HTTP content proof).

## Operator boundaries

Do not publish private source JSON; do not republish a held historical item; do not alter a previous question’s science conclusion, original source text, rights clearance or answer. Any new admissions require exact scan/source science/answer+KP/duplicate+rights/renderer validation and operator approval.
