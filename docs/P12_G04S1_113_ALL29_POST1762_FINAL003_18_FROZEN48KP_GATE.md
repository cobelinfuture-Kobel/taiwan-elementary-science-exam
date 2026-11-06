# 113 四上自然｜POST_SOURCE1762 東光期末 18 題既有 Admission Gate 與 Frozen48KP 分流

> 正式來源：main `d7f909327771dc309dd324bcc81d1165de454003`；證據新增在 PR #183 Draft。依 README／QUESTION_ADMISSION_GOVERNANCE 維持同一正式 Gate；本文件不是新增科學答案二審或 KP 三審，已公開 333 個來源位置不可重審或重新發布。

## 完成的實際工作

1. 繼承東光期末 `SCI_G04_S1_113_FINAL_003` 原卷第 1 頁獨立是非／選擇題原文、全部原選項及原 PDF 原生作答括號 BBox（已有 main 上的 `missing15-native88-original-text-sci-g04-s1-113-final-003-v1.json` 與原生 marker 證據）；只挑出 PR #183 v7 清冊中尚未公開的 **18 個**真實獨立來源位置，已公開 8 個保持原樣。
2. 逐題繼承先前 `native59-18-candidate-113114-public717-dedup-rights-gates-v1.json` 中已經提出的 Science／KP 模型論據，新的題目依原卷文字判斷，不把模型答案冒稱原校教師答案。
3. 核對 Frozen `site/data/authority/science-g03-g04-selector-v3.json` 的 48 個直接 KP。**4** 個暫有直接 KP 候選（S1 MC003 電池串聯極性、S1 MC004 市電／電池使用情境、S1 MC006 電池並聯接法、S2 TF001 電池耗盡與燈泡不亮）；都不是正式 Science/KP 核准，也不是可發布名單。
4. **14** 個逐題 HOLD：10 個屬於能源／減碳／空氣污染／風電等**無 Frozen48KP 直接對應**；1 個反射光用眼安全的 KP 直接性未證實；另 3 個有回收地點「通常」、鋰電池可充電類型及手電筒開關後必然亮燈等科學條件疑義。
5. 比對 114 年全部 25 份原卷 **717 個來源題目**、113 年正式公開題庫 26 JSON／320 top-level blocks、114 正式公開題庫 9 JSON／309 top-level blocks；並保留 113 年其他 29 原卷獨立題全文與圖片父題還未做全量 formal semantic duplicate 的事實。
6. 發現東光期末 S1 MC009 減碳題與 114 原卷永安期末、崇德期末來源文本同題／選項重排，但只是原卷 source-only，不可聲稱學生題已公開。S1 MC004「電力來源不是電力公司」與 114 已公開題幹高度相似但四選項內容不同，不可擅自標記 ALIAS。

## 來源工作位置互斥更新（不等於正式獨立題數）

| 狀態 | v7 | 本次變動 | v8 |
|---|---:|---:|---:|
| PUBLISHED | 333 | 0 | 333 |
| HOLD | 269 | +14 | 283 |
| ALIAS | 15 | 0 | 15 |
| UNREVIEWED | 1,145 | −14 | 1,131 |
| **來源工作位置總數** | **1,762** | **0** | **1,762** |

- 本輪 `FORMAL_SCIENCE_KP_APPROVED_new=0`，`ADMISSION_READY_new=0`，`PUBLISHED_new=0`，29 卷完整 Admission CLOSED = **0／29**。
- 這些都是可追溯**來源工作位置**，不是 1,762 道已驗收、也不是 1,131 道獨立未審試題。學生既有 333 個來源作答位置未修改。
- **不能因來源證據、答題 BBox 或 CI PASS 就宣告 4 題 Eligible**。仍須補足 113 其他卷全文／父題的正式語意去重、來源原文視覺與 Science unique、KP 直接性、逐題 Article9 與第三方圖像權利及 scope-specific 精確 Operator 核准。

## 憑證

- `data/review/p12-g04s1-113-all29-final003-18-onegate-science-kp-source-scope-v1.json`
- `data/review/p12-g04s1-113-all29-known-atomic-disjoint-source-ledger-v8.json`
- `tests/p12-g04s1-113-all29-final003-admission18-scope-hold-v8.test.mjs`
- 舊 v1-v7 清冊與原卷 PDF/source evidence 原樣保留，僅在新版本追加分類，不改 Frozen 原始檔。

## NEXT_RESUME_TASK

`P12_G04S1_113_ALL29_POST1762_POST_FINAL003_18_HOLD14_4Pending_DirectKP_ScienceFullAnswer_Full11329_11425_ExactSemantics_Rights_OperatorExactEligibleOnly_SelectiveStudentPR_CI_Main_PagesE2E_No333Reopen`

繼續沿用現有 113 四上其他全原卷的 SOURCE_EXACT 已有證據，直接執行缺少的 Gate，避免微批次重複審核。沒有全 Gate 或確定的操作人 Eligible 清冊時，只在 PR #183 留下 source-only／Admission review ledger，不建立假的 student-public PR。
