# G04-S1 KP Gap R4 — additive Authority V2 shadow

## Operator-approved decision (2026-10-16)

The canonical Kang Hsuan G04-S1 authority V1 from the original ZIP is SHA-256 `ac2122b09caa56afec373303c8a6169b57353bff06794831b508c3a3f5b5e4d5`; all original 45 IDs, titles and full statements remain **unchanged**. Only the following 3 new KPs are accepted as source-backed additions:

| New canonical KP | Unit | Concept | Kang Hsuan 113 self-study PDF page |
| --- | --- | --- | --- |
| `sci_g04s1_01_12` | U01 | 風搬運與堆積地表物質 | 21 |
| `sci_g04s1_02_13` | U02 | 水域調查的準備、觀察與紀錄 | 45–46 |
| `sci_g04s1_02_14` | U02 | 水域調查安全與生物保護 | 46 |

R3 ruled vibration loudness already inside `sci_g04s1_03_01`; neither sound-speed enrichment nor LED enrichment becomes a core KP.

## Versioning and source traceability

The full authored V2 JSON is a **private** operator handoff file, `science_g04_s1_kanghsuan_kp_authority_v2_r4_PRIVATE.json` (SHA-256 `0422cbbbf685d20cf2389ecc37fda147291b309ae486f49b16c0c5ba86193389`). Do not commit full `statement` or textbook text to the public repo. The source PDF SHA-256 is `3a20236f593cfde191b2bd90b19385eebe8ab1123e3ab8f192947295098dfbf3`.

The new private V2 contains 48 G04-S1 KPs (U01 12, U02 14, U03 10, U04 12). The projected G03/G04 four-semester aggregate becomes 190, but existing S2 public Selector is frozen at **187**; runtime use still consumes the existing V1, with no changed answers or published bank records.

## Why this pull request does not activate 190-KP runtime

Existing adapter validation `site/assets/js/authority-adapter.mjs` and its regressions explicitly require 187 KPs, including the 45-KP G04-S1 subset. Changing the live Selector without an independent schema/contract transition will break existing tests, deterministic corpus index, and historical candidate lineage. This PR only adds reviewed metadata, a non-mutating prospective remap queue and test guards.

## Question-bank remap gate

A verified **candidate** is the original source slot `SCI_G04_S1_114_MID_002|S1|MC|010` in the B07 review. The original mapping was `sci_g04s1_02_02` (water conditions); the proposed target is `sci_g04s1_02_13` (what to record in a water survey). It remains a scanned-PDF bbox hold and is **not** admitted.

Negative controls: questions interpreting water habitat from species stay mapped to `02_02`; a question about moving material by **流水** stays mapped to `01_05`; a rock-weathering claim with ambiguous science remains unresolved. Do not treat keyword matches as automatic remap. Archive and old verdicts stay untouched.

## Next gates

1. Private V2 source SHA/readback in a supported private delivery path.
2. Separate authority-adapter, selector and frozen test-schema migration with legacy lineage preservation and baseline parity.
3. Re-inspect archived/held questions that could assess wind transport, water survey procedures or water survey safety; each requires original source, unique correct answer, figure/scan geometry and rights review.
4. Explicit operator decision before public question admission; independent CI and Pages evidence before activating any site selector.

This PR **does not** publish V2, reclassify any historical source question, modify the frozen V1, admit questions or alter deployed Pages content.
