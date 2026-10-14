# P12 B06｜臺北市民權國小 114 四上期中：Article9 原題來源及 Science/KP Second Pass

## Frozen source and identity
- 原始檔：`114_康軒_四上_自然_期中評量卷_民權國小.pdf`；connected Drive ID `1eWBdPcFVKEWOUqgAcwnki-u9vbuPmWIB`。
- 第1頁實際抬頭：**臺北市民權國小 114學年第一學期期中評量自然科學試題四年級**，不是其他「民權國小」的地名；本卷原始來源版本標籤為康軒。
- 原 PDF **386737 bytes、2頁**，重新計算 SHA256 `ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a`，與歷史 `data/review/p12-g04s1-114-kanghsuan-minquan-mid-75-source-manifest-v1.json`、`data/review/p12-g04s1-114-minquan-mid-tfmc-25-v1.json` 完全吻合。
- 第1頁雙欄內容第1節 **是非題15×2分**、第2節 **單選10×2分**，因此這輪完成 **25道可獨立答題的原始純文字題目、40個原始選項**，有第1頁 PDF 真實答題括號字元 `bbox`；Source IDs 完整對齊 immutable 前審 TFMC25。
- 第2頁「回答問題／連連看／勾選題／素養題」包含表格、圖片、地震中央氣象署報告，**不在這輪純文字獨立 TFMC source**；仍保留原封存 **75 個作答位置、100 分**，不得把圖表或連線標籤拆錯或由文字猜答案。
- `data/source-archive` 依臺灣著作權法第9條第1項第5款之依法令舉行的學校考試題文字範圍處理。沒有公開原始整份 PDF、其他原圖/第三方文章或教師解答；未能獨立核實學校域名直連這份原始卷的網址，保留已核對的 Google Drive 來源 ID、原始頁首與 SHA。

## Science/KP model pre-review
| 分類 | 新增 |
|---|---:|
| 完整獨立 TF / MC | 15 / 10 |
| 科學模型初審無明顯問題 | 24 |
| Science HOLD | **1** |
| 四上 G04S1 KP 強候選 | 23 |
| KP REVIEW | 2 |
| NONMATCH G04S1 | 0 |
| 同時 KP 強候選、科學模型初審通過 | 22 |
| 原始教師答案認證／正式科學／正式KP／網站新增 | 0／0／0／0 |

### 科學 HOLD
`SCI_G04_S1_114_MID_005|S02|MC|006`「岩石、土壤、沙的顆粒由大到小排序」：土壤包含多種粒徑（可能含沙、礫石、粉砂、有機質），不是粒徑單一類別；教科書題目傾向③「岩石>沙>土壤」，但缺乏明確的顆粒或土壤類別限制，不能獨立認證唯一科學答案。維持完整來源文字與四個原選項，模型答案 `null`，不自動入學生題庫。與上批大墩 `SCI_G04_S1_114_MID_004|S02|MC|001` 屬**同一科學爭點**，不是相同原文；兩卷皆有 science HOLD。

### KP REVIEW
- `S02|MC|001` 水域調查必備器材／磁鐵：現行 U01/U02 的45 KP 並無明確以器材使用清單為單一技能 owner，避免強塞。
- `S02|MC|002` 捕捉採摘水生生物的保育行為：不等於 U02 的水域污染特定權威 KP，先保持待審。

### 重複/相似題
已與之前六卷的 **120** 題全部原題幹檢查，無文字正規化完全相同題幹。另 `SCI_G04_S1_114_MID_005|S01|TF|007` 與大墩 `SCI_G04_S1_114_MID_004|S01|TF|003` 皆涉及流水將較小地表顆粒搬到較遠處，雙字集合相似比例 0.5，標記為**待人工語義去重的近似關係**；各來源 ID、學校及原試題選項不變。

## Source and learner website are separate
- 完成原題公開文字來源庫：原 120 + 民權 25 = **145 個原始考卷出現次數**。
- 是非 **67**、單選 **78**，選擇題選項原文 **312**。
- 累計科學模型初審無明顯問題 **135**、SCIENCE HOLD **10**；另保留大墩 MC009 來源印刷選項標號重複的獨立 SOURCE PRINT HOLD 1。
- 原卷第一輪 standalone 已開始 **7/25**，並非 7 卷所有題組都做完；25卷1,623原作答位置分母、網站已正式存在的 **251個作答位置（四上53）** 皆不變，本輪新增 learner-site 0。
- 必須持續獨立完成科學唯一答案、KP、圖文來源、全25卷原題整理後才可由操作者核准正式抽題。

## Durable GitHub files
- `data/source-archive/p12-art9-114-minquan-g04s1-mid25-original-questions-v1.json`
- `data/review/p12-art9-114-minquan-mid25-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v6.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-minquan-mid25-source-science-kp.test.mjs`

## NEXT_RESUME_TASK
`P12_STANDALONE_B06_NextTextLayerPaper_Art9CompleteTFMC_ScienceKP`

Next frozen queue paper is `SCI_G04_S1_114_MID_006` (康軒 安和國小 四上期中); download and source-verify exact school PDF, isolate independent complete TF+MC and printed-choice anomalies, science+KP review, compare old 145 source items, commit via CI and keep all25/site gates unchanged.
