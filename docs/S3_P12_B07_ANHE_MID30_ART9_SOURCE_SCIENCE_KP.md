# P12 B07｜安和國小 114 四上期中：Article 9 完整原題 SourceExact／Science／KP

## Frozen original paper and provenance
- 原始試卷 `114_康軒_四上_自然_期中評量卷_安和國小.pdf`，Google Drive source ID `1b2Ra-MB32xdJjXy-xtn0gJTIuvtF8YTW`。
- 原卷頁首：**新北市土城區安和國民小學114學年度第一學期第一次定期考查試題，自然，四年級**。
- Original PDF 2 pages / 186,792 bytes; SHA256 **`f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb`**，本輪從原PDF byte重新計算，與 frozen `data/review/p12-g04s1-114-kanghsuan-anhe-mid-50-source-kp-first-v1.json` 一致。
- 按原頁實際逐頁 render／text layer readback，不使用 OCR；第1節是非15×2分、第2節選擇15×2分，**30 題、60 個完整原四選一文字選項**，每題保留 Frozen Source ID 與來源原始 PDF 字元括號 bbox。
- 第一頁左欄包含TF15與MC01，第一頁右欄包含MC02–MC13，**第二頁左上角MC14、MC15**。這兩道跨頁獨立選擇題因不依賴圖像，列入本次30題，而非當成遺漏。
- 第三節40分、20個原始位置（水生植物水位示意、地震防護圖、魚構造圖、震源/震央圖等）須另審圖像/共用題組。不因圖文複雜而卡住此30道文字單題；完整原卷50個作答位置、100分不變。

## Article9 source-only scope
依照已核准的 P12 source archive governance，將符合規定學校考試之**原始純文字試題與選項**保存在 GitHub source archive。原始整卷PDF、第三方圖片、共用圖像、原教師答案與詳解均不公開重製。校方域名的這份原 PDF 確切直連網址尚未獨立驗證，故以已連接 Google Drive 來源、原卷頁首及 PDF SHA 保存真實 provenance。
原題來源保存 **≠** 科學唯一性核准 **≠** canonical KP 核准 **≠** 網站正式抽題入庫。

## Independent model science second pass (not authentic teacher key)
| 科目審核 | 結果 |
|---|---:|
| 完整獨立 TF / MC | 15 / 15 |
| 科學模型初審暫無明顯問題 | 28 |
| **SCIENCE HOLD** | **2** |
| G04S1 45KP 強候選 | 29 |
| G04S1 KP REVIEW | 1 |
| 同時科學模型暫過與KP強候選 | 27 |
| 正式教師答案認證/正式科學/正式KP/網站新增 | 0 / 0 / 0 / 0 |

### SCIENCE HOLD：兩道單選
1. `SCI_G04_S1_114_MID_006|S02|MC|001`：生物棲地判斷，教材預期西瓜與「溼潤的泥土」不相符。但**溼潤**未指過濕、排水不良或土壤類型，西瓜也必須獲得適當水分，不能據此認定選項②必然錯誤；模型唯一答案 = null。
2. `SCI_G04_S1_114_MID_006|S02|MC|011`：「下列何者不是地震所造成的？」預期④森林大火；但地震可能使電力設備損壞、火源外洩而間接引發野地火災。未限制為**直接**地質後果時，唯一錯誤敘述不穩健，暫停正式驗收。

`S01|TF|011` 對隨意放生的命題本身模型判FALSE，但既有 G04S1 KP 權威尚未確定完全合適的單一 owner，因此保留 `KP_REVIEW`，不硬塞水污染 KP。

## Cross-school near-duplicate lineage
- 從前7份學校已保存的145個原題文字中，以正規化完全比對，**0個完整同題幹**。
- 安和 `S01|TF|001`（岩石堅硬建材/步道）與大墩 `SCI_G04_S1_114_MID_004|S01|TF|005` 概念相似（雙字集合比 0.56），標記近似候選，不刪除兩校各自 exact original wording/source ID。
- 字面格式相近的 MC14「下列有關水生動物」與先前LED題因常見問法而看似文字相似，**不是相同概念**；避免錯誤去重。

## Cumulative source-only census
| 指標 | 前批 | 本批 | 累積 |
|---|---:|---:|---:|
| 原始完整文字獨立單題來源出現次數 | 145 | +30 | **175** |
| TRUE_FALSE | 67 | +15 | **82** |
| SINGLE_CHOICE | 78 | +15 | **93** |
| 完整原選項文字 | 312 | +60 | **372** |
| Science model prelim pass | 135 | +28 | **163** |
| Science HOLD | 10 | +2 | **12** |
| 至少開始獨立TF/MC整理之原卷 | 7 | +1 | **8/25** |

此前大墩原卷 MC009 重複②之 **來源印刷 HOLD 1** 仍單獨保留；不可混入 12個科學HOLD。
全25原卷、1,623作答位置分母不變。正式網站抽題仍251作答位置／四上53，本批新增正式抽題0。
原始source archive被公開並不自動通過 Answer+KP+operator gate。

## Durable GitHub files
- `data/source-archive/p12-art9-114-anhe-g04s1-mid30-original-questions-v1.json`
- `data/review/p12-art9-114-anhe-mid30-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v7.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-anhe-mid30-source-science-kp.test.mjs`

## NEXT_RESUME_TASK
`P12_STANDALONE_B07_NextTextLayerPaper_Art9CompleteTFMC_ScienceKP`

照 frozen queue 下一份有文字層的學校原卷繼續「完整原題→Science/KP→source defect/duplicate lineage→CI→讀回」，圖形題及共用情境另行審核，不提前修改正式學生抽題庫。
