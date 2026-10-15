# P12 ALL25 B02｜六份原卷配分影像證據、Science73／KP81 複審分流

**狀態：B02 evidence readback + model-level human-review preflight 完成；Operator 正式驗收尚未核准，來源分數 27 分全數 HOLD，無新增學生網站題。**

## A. 重新讀取六份真實原卷

全部六份來源由連結的 Google Drive PDF 重新取得，實際 PDF byte size 與 SHA256 逐檔核對，檢視共 **9 個指定原卷頁面**。原 PDF 不放進公共 GitHub，來源圖表／第三方內容不隨題庫釋出；本輪僅將 SHA、原卷文字配分指示、頁次及差異類型加入 JSON。

| 原卷 | 待核分數 | 本輪驗證頁（1 起算） | 來源證據結論 |
|---|---:|---|---|
| 永安四上期末 | 4 | 2 | Printed S06 12-points under one-point-per-response instruction; previous registry enumerates only 74 explicit response positions against original printable 78. Layout cannot validate four speculative S06 boxes. |
| 崇德四上期中 | 8 | 1、2 | Original printed mixed-weight directive confirmed, 12 contextual subquestion groups span two pages. Earlier 64 natural response slots lack proof of eight additional independent boxes. |
| 明義四上期末 | 2 | 2 | Source visibly shows one lighting circuit drawing prompt with two drawn wires, not 2 separate printed answer boxes. 18 third-section source positions worth nominal 36 vs printed 38. |
| 獅湖四上期末 | 3 | 1、2 | Three original matching groups: six sound/light examples, three matter-change rows (one '複選' row), six light-use cases. Fifteen visible source responses vs 18 printed section points. |
| 普仁四上期中 | 4 | 1、2 | Nineteen separately identified original second-section source response positions at 2 points = 38, printed 42. All diagram/animal/matching response marks require image-by-image count; no inferred extra two blanks. |
| 普仁四上期末 | 6 | 2 | Scan page 2 visually confirms G05 '每答1分，共6分'. Frozen map says six slots 2 each to satisfy overall S3 '共46分'; source-evident S3 = 34+6 = 40 and entire paper attributable 94/100, so score-sum conflict is real, not 6 proven missing answers. |
| **總計** | **27** | 六卷來源身份驗證通過 | **正式解除配分 0 分** |

重要例子：普仁四上期末第三大題第 5 組原卷第 2 頁印出「**每答 1 分，共 6 分**」，同一卷第三大題總計卻寫 46 分；既有 frozen Source Map 以每答 2 分填補這 6 分，無法以原卷配分指示支持。這屬原卷印刷與 source-map 之間的 **score authority conflict**，不可拿已辨識的 49 個作答位置強行拆出新題。

其他五卷則是題組、畫線、配合題和自然作答格數／配分權重尚未同時完整確認，不能把 points 誤作 answer slots。

完整機讀 JSON：`data/review/p12-all25-b02-sixpdf-scoregap27-original-visual-evidence-v1.json`。六份原卷的配分畫面另已製作**僅供操作員私下檢查**的六頁 PDF 審核包（不提交公共 GitHub）。

## B. Science HOLD 73 題──逐題模型分類已完成，HOLD 尚未核銷

- **73/73** 個真實 source IDs 均保留所屬學校、來源題幹摘錄、原 Science QA 參照，以及按原題內容判斷的 `model_issue_category`（比較基準不明、多答案選項、物理配置條件不足、日期觀測限制、文化資料依據不完整等）。
- 舊審核證據有 **47/73** 筆已取得明確科學問題說明；剩餘 **26/73** 尚需逐份原 QA 取得具體原因，嚴禁自動創作理由再解鎖。
- 每一筆均是 `KEEP_SCIENCE_HOLD_PENDING_ORIGINAL_AND_HUMAN_UNIQUE_ANSWER_DECISION`；正式 Science PASS 增量 **0**。即使四選一模型能推測教科書想考的答案，沒有唯一性證據也不更動原始選項／強行通過。

## C. KP REVIEW 81 題──獨立於 Science 的 frozen-authority 檢查

- **81/81** 原題均保留來源段落與 KP 建議；其中 **45** 筆有既存初審候選 KP，**36** 筆暫無可核定的候選 ID，不得任意強塞給四上單元。
- **普仁四上期中六題** `SCI_G04_S1_114_MID_009|S3|G02|007–012` 原共同題幹為「漂浮性水生植物」，frozen map 卻標 `sci_g04s1_02_05` 沉水性植物。第二輪有 `sci_g04s1_02_04` 漂浮性植物候選，**六題仍須個別人工核准後才能轉正式 KP**。
- Science HOLD × KP REVIEW 同時符合的 **8** 個原題 ID 排列於下；兩項 gate 必須各自驗收：
- `SCI_G04_S1_114_FINAL_003|S02|MC|002`
- `SCI_G04_S1_114_FINAL_007|S01|TF|006`
- `SCI_G04_S1_114_FINAL_008|S02|MC|014`
- `SCI_G04_S1_114_FINAL_009|S1|TF|005`
- `SCI_G04_S1_114_MID_010|S01|TF|009`
- `SCI_G04_S1_114_MID_011|Q01|005`
- `SCI_G04_S1_114_FINAL_012|Q08|005`
- `SCI_G04_S1_114_MID_002|S2|TF|015`
- Science73 + KP81 合併後共 **146 個不同來源 occurrences**；不是 154 個不同原題。
- 既有 **166** 筆 KP NONMATCH 仍保留來源及原分類，不予強制改配四上。
- 正式 KP 新核准 **0**；Operator 認證 **0**。

## D. 本輪不變條件

| 檢核 | 結果 |
|---|---:|
| 真實原卷 | **25** |
| frozen 原卷答案位置 | **1,623** |
| source-only 完整獨立題 | **717** |
| Science 模型 PASS / HOLD | **644 / 73** |
| KP 強候選 / REVIEW / NONMATCH | **470 / 81 / 166** |
| Scoring 27 分解鎖 | **0** |
| 新正式 Science、KP 核准 | **0** |
| 學生網站新增 | **0** |
| 學生網站既有總數／四上 | **251／53** |

掃描原卷 bbox 仍為視覺估計而非 pixel-exact；原文、選項、frozen Source Maps、前次 B01 狀態均未因模型複審而被正式放行。本次 operator-approved 欄位固定為 **false**。

## E. B03 準備

`P12_ALL25_B03_OperatorSixPDFScoreAuthorityDecisionThenPrioritizedScienceKPEvidenceAcceptance`

建議讓操作員先看六份來源配分畫面，對每一卷選擇「維持 27 分 HOLD／確認有別的印刷配分規則／保留來源印刷本身矛盾」。選擇前不得改配分。接著優先處理 **8 題雙重 Science/KP 阻塞** 與 **6 題漂浮／沉水錯配**，再續跑剩餘 Science HOLD（尤其缺明確原因的 26 題）及 KP 不確定項。

本輪配分及 Science/KP 清冊自動化回歸測試通過後，僅可聲稱 **B02 operator evidence prepared / triage fully enumerated**，不可聲稱最終人工 acceptance。
