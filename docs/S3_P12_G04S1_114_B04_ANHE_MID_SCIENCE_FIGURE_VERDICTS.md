# P12 G04S1 114 — B04 安和國小期中原卷逐題科學與原圖驗收

## Source / authority
- `SCI_G04_S1_114_MID_006` — `114_康軒_四上_自然_期中評量卷_安和國小.pdf`
- Actual original 2-page PDF binary SHA-256 `f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb` inspected and verified against source map.
- All **50/50** original answer positions; 15 true/false + 15 multiple choice + 20 group slots = **100 score points**. Preserve source score-to-position equality and all exact source IDs.
- Frozen 114 all-25-before-release gate `data/governance/p12-g04s1-114-full25-screen-before-public-admission-v1.json`; this B04 is private corpus screening **only**, not public admission; 108–113 completion not required for later 114 admission.

## Model-independent science verdict

| Category | Positions | Meaning |
|---|---:|---|
| `FULL_PASS` | **47** | Science and source text/figure answer independently reasoned; **not** teacher key or public acceptance |
| `CORRECTABLE` | **3** | Original wording not precise enough for unique or pedagogically valid response |
| `HOLD` | 0 | This batch adds no undecidable source slot; other batch HOLDs remain |
| `REJECT` | 0 | No new scope rejection in this original |
| **Total** | **50** | Same 50 original source answer positions retained |

From first-pass frozen V17/B15 classes: 26 ordinary KP candidates, 21 evidence-HOLD, 3 KP-uncertain. Some science FULL_PASS original KP-uncertain need **separate current 45-KP authority confirmation** (e.g. observation safety, non-native organism release). Never automatically convert model science correctness into formal KP admission.

## Source image results (20 original diagram-dependent positions)

On the original second page, compare three water-level figures for each aquatic plant:
- Waterweed / 水蘊草: type `A 沉水性`, three figures left→right: **√、√、×**. At low water levels flexible stems bend; erect shoots above the drawn waterline are not the source's typical submerged adaptation.
- Water lily / 睡蓮: type `B 浮葉性`, three figures left→right: **√、×、√**. Leaf pads need to remain on water surface.
- Earthquake protective A/B/C: **趴下 B、掩護 A、穩住 C** as drawn.
- Source fish head-and-body schematic: **乙→D 鰓** (internal gill for breathing); **丙→E 胸鰭** (steering); **甲→A 口** (feeding).
- **IMPORTANT SOURCE SUMMARY DEFECT**: frozen first-pass source `S03|G03|013` says 「尾鰭與方向」, but the actual source arrow `丙` points to the **胸鰭** and its correct listed choice is `E`. The independent source-science overlay retains the existing first-pass string for traceability, while flagging a required semantic-summary repair. No original source/PDF or existing admission candidate is silently overwritten.
- Earthquake diagram: `丙=震源`, `乙=震源深度`, `甲=震央`. Group 4 contains **six** answer boxes, each two points, not only three group items.

Original source images are **not republished**. Student-facing redraw, physical scaling and rights clearance are separate later gates.

## Three CORRECTABLE originals, draft only

1. **TF4** mixes magnitude of water/wind transport forces and particle size into a vague guaranteed relationship. Stronger flow also transports larger particles; wind also exceeds the current U01_06 water-only core and remains KP review.
2. **MC1** says watermelon grows in `溼潤的泥土`; moderate moisture with well-drained soil can be appropriate, so this cannot uniquely be deemed the incorrect habitat while other choices remain valid.
3. **MC11** asks what is `不是地震所造成的` and expects forest fire, but secondary electrical faults triggered by an earthquake can cause fire, so categorical exclusion is scientifically false.

Draft-only possible revisions and source-summary issue are separately recorded in `data/review/p12-g04s1-114-b04-three-rewrites-and-fish-source-summary-correction-draft-v1.json`. None was approved by the operator and no source question text was edited.

## B01–B04 durable cumulative ledger

| Metric | Count |
|---|---:|
| All 114 source papers first-pass mapped | 25 / 25 |
| Independently science reviewed eligible/uncertain original source positions | **145 / 1,285** |
| `FULL_PASS / CORRECTABLE / HOLD / REJECT` | **121 / 13 / 10 / 1** |
| Original 440 HOLD/KP queue reviewed / not yet reviewed | **99 / 341** |
| Original 845 general KP candidates reviewed / not yet reviewed | **46 / 799** |
| Remaining original 1,285 candidates without independent science review | **1,140** |
| All first-pass source position inventory | **1,623** |
| Pre-existing public answer positions: total / G04S1 | **251 / 53**, unchanged |
| New public admitted positions | **0** |

The B03 8 fish box geometry holds + 2 free response scoring holds **remain open**; B04 does not resolve them. The 114 all-25 public admission preflight must report `publication_ready=false` until full 25-source closure, corrections, KP match, rights/print, final candidate manifest and explicit operator approval.

### Durable files
- `data/review/p12-g04s1-114-b04-anhe-mid-science-figure-50-verdicts-v1.json` — all 50 independently reviewed original IDs, scientific answers and explanations
- `data/review/p12-g04s1-114-b04-three-rewrites-and-fish-source-summary-correction-draft-v1.json` — three unapproved correction drafts and one provenance repair
- `data/review/p12-g04s1-114-b04-science-figure-progress-v4.json` — cumulative source ledger and no-public-gate evidence
- `tests/p12-g04s1-114-b04-anhe-mid-science-figure-50.test.mjs` — exact PDF/source IDs and score, diagram answers, correction gate, unchanged corpus and public site

NEXT_RESUME_TASK = `P12_G04S1_114_ALL25_ScienceAnswerVerdictAndFigureEvidence_Batch05`.
Select a different original paper in B15, verify raw PDF and screen remaining KP science and figure source positions. Do not re-run or overwrite B01–B04. No public admissions.
