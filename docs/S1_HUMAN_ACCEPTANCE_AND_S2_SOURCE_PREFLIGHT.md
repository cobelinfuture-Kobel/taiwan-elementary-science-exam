# S1 人工驗收與 S2 來源預檢（2026-10-11）

## 本輪人工確認

- User acceptance: **「核准, 已經放在雙欄的其中一欄」**。
- Accepted behavior: 四上 U02 示範閱讀題組、示意圖與兩道子題，排在 A4 雙欄的**同一欄內**。
- Shared context: atomic, never split its article/figure/subquestions across unrelated columns or pages.
- Images: preserve original ratio, shrink to column width; no stretch/crop.
- GitHub commit first accepted: `2fbf434bde2f6d9963696f0ea98b472f8b695b85`.
- Chromium browser geometry gated deployment: `2ead7ef90f80bd3b818393373069fb6e19c3ddc1`.
- Exact browser CI/Pages run: https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/actions/runs/38149645116
- Browser evidence reported: column count 2, figure ratio 3.817997 (~420/110), overflow 0, group overflow false. On-screen and print modes PASS.
- Prior CI: 7/7 PASS; full local ZIP parity remains **NOT ATTESTED**; original 16 tests in the separate ZIP are NOT claimed as covered by the GitHub 7 tests.

## S1 acceptance boundary

**S1 UI and double-column print behavior: OPERATOR_ACCEPTED.**
**S1 full original ZIP source parity: PENDING.**
Do not falsely claim a fully reconciled ZIP or formal historical exam database.

## S2 frozen target

- Use the four original 113 康軒 science KP Authority JSON for G03-S1/S2 and G04-S1/S2.
- Preserve all KP identifiers, original source provenance, canonical mappings and MIDTERM/FINAL scoping; no re-extraction or new definitions without review.
- Exam screening of school papers is **not** restricted to 康軒-branded papers; downstream relevance is determined by exact KP scope.
- S2 is the KP selector/data readback ONLY: no imported real historical exam questions.
- Public GitHub data should be a derived, minimal, publishable metadata projection; do not automatically publish teacher resources, scans, verbatim long textbook excerpts or protected reference material.
- The local fixture bank remains `DEMO_ONLY` until explicitly retired or gated from production.
- Main source bundle `elementary_science_kp_authority_g03_g04_v1.zip` was referenced in prior discussions, but its bytes were **not available in this environment** at this preflight. The four named JSONs are listed in `data/authority/source_manifest_v1.json`.

## S2 admission gates

1. Locate and read **actual four JSON file bytes** before any production selector import.
2. Verify JSON parse, four unit scopes, KP counts, duplicate IDs, canonical KP IDs, provenance, and exam-period partitions.
3. Compare derived public selector projection against original authority; no placeholders, invented titles or silent fallback.
4. Keep demo-only vs certified source status visible in UI and tests.
5. CI then Pages browser visual readback before S2 closeout.

## Current stop

```text
S1_OPERATOR_DOUBLE_COLUMN_ACCEPTANCE = PASS
S1_DEPLOYED_GEOMETRY_GATE = PASS
S1_FULL_SOURCE_PARITY = PENDING
S2_SOURCE_AUTHORITY_PREFLIGHT = PARTIAL
SOURCE_JSON_BYTES = NOT_LOCATED
NEXT_SHORTEST_STEP = Obtain exact four original JSON files (or source ZIP), then verify before public selector import
```
