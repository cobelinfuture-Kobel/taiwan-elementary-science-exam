# P12｜113 四上全29卷 FullFix Bulk Admission（1122 個來源工作位置）

## 本次核准範圍（2026-11-06）

**只改執行方式，不改 Admission 既有必經條件。** 依 `README.md` 與 `docs/QUESTION_ADMISSION_GOVERNANCE.md`，各題仍須：

```text
SOURCE_EXACT → PDF_PAGE_BBOX → SCIENCE_UNIQUE_ANSWER → CANONICAL_KP
→ DUPLICATE → RIGHTS → ADMISSION_GATE（適用的精確操作人核准）
→ selective student PR → focused CI → main readback → live Pages E2E
```

- 原卷 **29/29**、原卷來源**工作位置** 1762（不是 1762 道已認證獨立題）。
- 凍結 v8：333 PUBLISHED／283 HOLD／15 ALIAS／1131 UNREVIEWED。
- 已正式確認的互斥來源處置 overlay：和順期末一題 Science 唯一答案 HOLD、和順期中七個月相無直接 Frozen48 KP HOLD、永安期末一題與 114 已公開完全同題 ALIAS。
- **截至目前有效快照**：333 PUBLISHED／291 HOLD／16 ALIAS／**1122 UNREVIEWED**，合計1762。已發布333、Frozen48、原 PDF、Rights 與歷史審查不覆寫。
- 前輪 PR #184 已具備的 **7 道 model-supported 原題**，繼承證據（不是額外 Science/KP 二審），維持 **operator 精確原題 ID 清冊待核准**；兩個內安 Science／KP 疑義題仍留原範圍，未混入7題。
- 這次使用者的「核准 FullFix 批量執行」**不等同**「核准精確7題發布」。不可自動簽名、發表或合併。

## 凍結九批（完整原卷不得拆散）

由凍結 1122 個 `source_slot_id` 做確定性的九個分組，**每批 100–150**，保留全卷題組父子位置於同一批。這是工作佇列，不是硬性要求每批必須發布100題。

| Batch | 原卷（`SCI_G04_S1_113_` 前綴省略） | 未審來源工作位置 |
| --- | --- | ---: |
| B01 | MID_001、FINAL_005、FINAL_007 | 114 |
| B02 | MID_002、MID_003、MID_006 | 133 |
| B03 | MID_004、FINAL_004 | 121 |
| B04 | FINAL_001、MID_012 | 126 |
| B05 | FINAL_002、MID_008、MID_010 | 126 |
| B06 | FINAL_003、MID_007、MID_016 | 129 |
| B07 | MID_005、MID_009、MID_017 | 131 |
| B08 | MID_011、MID_013、FINAL_008 | 127 |
| B09 | FINAL_009、FINAL_010、FINAL_011 | 115 |
| **總數** | **25 份仍有 UNREVIEWED 的原卷／其餘4份不重開** | **1122** |

批次凍結清冊：`data/review/p12-g04s1-113-all29-bulk-admission-fullfix-1122-nine-batch-frozen-plan-v1.json`，包含 1122 **精確原始 source IDs**。若來源處置有更新，應以 append-only 新 evidence/overlay 追加並檢查，不應重洗原已核准佇列、默默換批或改變同源親子群。

## 實際執行指令

```bash
# 機械守恆與既有證據 Gate 回讀，不寫新檔
node scripts/review/p12-g04s1-113-all29-bulk-admission-fullfix.mjs --all --check

# **一個 GitHub Actions run**連續執行 B01～B09，
# 逐原卷逐來源列出已驗證證據與缺哪個既有 Gate；
# 單筆例外不阻塞其他獨立來源。
node scripts/review/p12-g04s1-113-all29-bulk-admission-fullfix.mjs --all --out-dir=artifacts/p12-g04s1-113-bulk1122-fullfix

# 若需只補特定原卷範圍，固定批次接續
node scripts/review/p12-g04s1-113-all29-bulk-admission-fullfix.mjs --batch=B02 --out-dir=artifacts/p12-g04s1-113-bulk1122-fullfix
```

GitHub Actions：`.github/workflows/p12-g04s1-113-all29-bulk-admission-fullfix.yml`，手動 `workflow_dispatch` 選 `all` 或 `B01...B09`，或 PR 變更時自動跑 all。只給 `contents: read` 權限，不取得 GitHub 寫權限、不呼叫模型、不發布學生題；每個 batch 產出一份 JSON，另附 `summary.json`，作為逐格工作交接紀錄。**本次不需要每個 batch 都停下向使用者重新核准。**

## FullFix 執行的「真實進度」定義

執行器實際完成：原始來源位置、原卷身分、已存在的 PDF answer marker BBox／掃描父題證據的回接，逐題列出七個 Admission Gate 缺口，繼承已證明原題與模型 Science／KP 的七題候選，在同一 run 中完成 1122 個來源位置的**機械 Gate 盤點**。

執行器**不會宣稱**：1122 個原題都已逐字轉錄／Science 唯一答案／KP 精確符合／全部語意去重／權利正式接受；這些無法只由過去 source geometry ledger、原始 source-only PDF 位置推得。必須在每批逐卷補齊，不能因九批工作清單跑完就把 UNREVIEWED 改成 HOLD／ALIAS／PUBLISHED。

每個來源輸出 `gate_results`、`missing_formal_gates`、`source_candidate_stage`、`geometry_source_proof_ref`、`next_short_step`；若只有模型或部分來源證據，狀態維持 pending，**不得**自動升格為 `FORMAL_SCIENCE_KP_APPROVED`。

正式三指標的本輪增量維持：`FORMAL_SCIENCE_KP_APPROVED=0`、`ADMISSION_READY=0`、`PUBLISHED=0`。要認列新題，還是要真實通過各項既有 Gate 與現有適用精確操作人清冊，再依 **selective PR／CI／main／Pages E2E** 發布。

## 後續逐批綁定原卷閉環（不是每次7題）

1. 每批依來源欄位 `source_slot_id`、`paper_id` 保留 100～150 格，對獨立 TF/MC、全文選項原有者優先採正式來源；圖片/父題獨立分流，不阻塞其他題目。
2. 優先繼承 PR #124 原始 source/raster PDF 頁碼與幾何、PR #183 全29互斥 ledger、PR #184 精確7題 Science/KP 提案；只補缺少的 `SOURCE_EXACT`／`SCIENCE`／`KP`／`DUPLICATE`／`RIGHTS` 證據。
3. 全部正式通過、只有精確 operator 核准待處理者，集中成**一次精確來源 ID 清冊**，不在每50格重新交握。適用既有核准範圍的項目直接繼續，只有合約要求的新簽核或實際無解例外才需交握。
4. 每輪真實回報按原卷累計 `PUBLISHED/HOLD/ALIAS/UNREVIEWED`，不把來源幾何回接、模型 PASS、CI PASS 冒充學生入庫。

**NEXT_RESUME_TASK**：
`P12_G04S1_113_ALL29_FULLFIX_BULK1122_B01_TO_B09_PaperComplete_OriginalExactScienceKP_Dedup_Rights_OperatorExactOnly_SelectiveStudentPR_CI_Main_PagesE2E_No333Reopen`
