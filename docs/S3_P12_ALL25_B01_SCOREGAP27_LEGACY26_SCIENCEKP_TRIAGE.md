# P12 ALL25 B01｜六卷 27 分來源配分稽核、東光期中 26 題 Contract 補齊與 Science／KP 分流

## Scope 與版本治理

本輪使用 GitHub main 已合併的 P12 v24（25 份原卷、1,623 frozen 原始位置、717 題完整來源）。本 B01 僅做 **配分證據定位、早期 26 題 JSON 的缺漏欄位補齊、Science HOLD73 與 KP REVIEW81 逐題清冊**。不增加或改寫原題文字、選項、原始 Source ID，不更改 frozen Source Map，不變更既有學生網站。非原卷 full-paper 畢業驗收或正式答案審定。

## 1. 六卷來源配分差異：27 分均保留 HOLD

| 原考卷來源 | 既存 V17 | 新 B23 | 證據和最小處理 |
|---|---:|---:|---|
| `SCI_G04_S1_114_FINAL_001` 永安期末 | 4 | — | 印刷 78 個配分權重，但僅確認 74 明確位置；S06 4 個推定位置尚未獲原卷作答框支持 |
| `SCI_G04_S1_114_MID_003` 崇德期中 | 8 | — | 分卷列出 64 個自然答題位置，第三大題共用題組配分不足以證明新增 8 個位置 |
| `SCI_G04_S1_114_FINAL_008` 明義期末 | 2 | — | 第三大題標 38 分，18 個名義每題 2 分的答題位置合計 36 分；兩條畫線任務仍是同一題 |
| `SCI_G04_S1_114_FINAL_013` 獅湖期末 | 3 | — | 第三大題標 18 分，僅 15 個可辨識答題位置 |
| `SCI_G04_S1_114_MID_009` 普仁期中 | 4 | — | 第二大題標 42 分，19 個 2 分位置合計 38 分 |
| `SCI_G04_S1_114_FINAL_010` 普仁期末 | — | 6 | 原卷第三大題 G05 六項各 1 分，frozen 先前記成各 2 分；按印刷位置只能對齊全卷 94/100 分 |
| **合計** | **21** | **6** | **27 分仍未核准，不補造作答位置** |

每卷具來源證據、原凍結 Source Map 路徑、配分差距、歸因和操作員複核動作，均列於 `data/review/p12-all25-b01-source-score-gap27-evidence-ledger-v1.json`。**本輪配分解決數 0 分；六卷仍開放。** 這是重新驗證既有證據而非宣稱已對所有原卷實際裁切框完成 pixel-exact acceptance。

## 2. 26 題舊 Source Schema 已做原位 additive 修復

目標：`SCI_G04_S1_114_MID_008`，基隆市東光國小 114 康軒四上期中，原卷 26 筆獨立題（14 TF／12 MC）。原來源 archive 有完整文字與 48 個選項，但先前 26 筆未在單題層寫出 `question_type`、`science_review_status`、`kp_review_status`。

本輪採用原有來源檔 `data/source-archive/p12-art9-114-dongguang-g04s1-mid26-original-questions-v1.json`，與原有定位證據 `data/source-archive/p12-art9-114-dongguang-mid26-pdf-marker-science-kp-v1.json`、原有第二輪審核 `data/review/p12-art9-114-dongguang-mid26-science-kp-secondpass-v1.json` **逐 Source ID、逐 index 對接**，補進 26 筆：題型、原配分、PDF page/BBox、Science PASS/HOLD、模型暫定答案與原有科學理由、KP 候選與 REVIEW、來源範圍及所有未正式核准標記。

- **26/26 補齊**；TF14、MC12；Science model PASS23/HOLD3；KP 強候選24/REVIEW2。
- 不修改任一原題幹、選項、原 source_id 或原頁次。老師答案仍未 authenticated，正式 Science、正式 KP、學生入庫仍 0。
- 原 P12 全25 首輪稽核 v1 於「當時」真實記錄 26 筆 schema 缺漏；**舊版稽核不回寫**。更新過的回歸測試同時檢查當時缺漏的 immutable snapshot 與現在 26/26 已補齊。

## 3. Science HOLD 73、KP REVIEW 81 逐題分流

新 `data/review/p12-all25-b01-science73-kp81-triage-index-v1.json` 加上三份來源分組清冊：

| 批次 | 來源考卷 | Science HOLD | KP REVIEW |
|---|---:|---:|---:|
| shard01 | 8 | 12 | 23 |
| shard02 | 8 | 31 | 21 |
| shard03 | 9 | 30 | 37 |
| **總計** | **25** | **73** | **81** |

兩類清冊均保留 source_id、原卷 source archive、Science QA reference、題目摘錄、原審核狀態與需要人工完成的獨立操作。**Science HOLD 與 KP REVIEW 同時命中的 8 筆，只需 8 筆來源身份，但必須分開完成兩項審核**，聯集為 146 個來源題位置。

原檔明確可追溯的 Science 問題說明目前有 **47/73** 筆已載入；另 **26/73** 筆只保留原審核檔指標而未擅自補寫科學理由。下一輪應先從個別原 Science QA 逐筆補回理由；不得將無理由的 HOLD 轉 PASS，也不得將 Science 已初審 PASS 視為教師答案認證。

KP 81 其中普仁期中 `SCI_G04_S1_114_MID_009|S3|G02|007–012` 共 6 題，原題文字明寫「**漂浮性水生植物**」，舊 frozen source map 卻指向 `sci_g04s1_02_05`（沉水性），候選應為 `sci_g04s1_02_04`（漂浮性）且保留 KP REVIEW；不改原卷內容或 frozen map。另有 **166 題 KP NONMATCH** 僅可作來源保存，不得強制塞進現有四上單元。

## 4. 獨立 gates 尚未開啟

- 來源首輪：**25/25 PDF 已整理；717 source occurrences**，非 717 題正式學生練習。
- Frozen 原作答位置：**1,623** 不變，既有未形成完整獨立文字題的 906 位置，仍需另排圖片、共用題組及其他題型。
- B01 來源配分 HOLD **27 分／六卷**；Science 模型 HOLD **73 題**；KP REVIEW **81 題**；正式 teacher key／Science／KP **0**。
- 既有網站 **251** 個作答位置／G04S1 **53**，**新增 0**。掃描原圖的 raster BBox 仍為估計值，不是 exact PDF glyph box。
- 不可因 Source Map 或本輪 CI PASS 宣稱已經完成 score-parity、Science answer、canonical KP 或 student public admission。

## 5. 下一個最短 Gate

`P12_ALL25_B02_ScoreGap27OperatorEvidenceThenScience73KPHumanTriage`

先針對六份原卷顯示配分原始畫面完成 Operator score authority 驗收，將已補齊東光 26 題的 schema parity 鎖入 CI；接著按逐題清冊優先審 Science HOLD、KP REVIEW（尤其 8 題雙重阻塞與普仁六題 KP family 錯配）。任何通過都必須保留逐題來源／證據，不能只改總數。

## Evidence
- `data/review/p12-all25-b01-source-score-gap27-evidence-ledger-v1.json`
- `data/source-archive/p12-art9-114-dongguang-g04s1-mid26-original-questions-v1.json`（additive 欄位修復）
- `data/review/p12-all25-b01-science73-kp81-triage-index-v1.json`
- `data/review/p12-all25-b01-science-kp-triage-shard01-v1.json`
- `data/review/p12-all25-b01-science-kp-triage-shard02-v1.json`
- `data/review/p12-all25-b01-science-kp-triage-shard03-v1.json`
- `tests/p12-all25-b01-scoregap27-legacy26-triage.test.mjs`
