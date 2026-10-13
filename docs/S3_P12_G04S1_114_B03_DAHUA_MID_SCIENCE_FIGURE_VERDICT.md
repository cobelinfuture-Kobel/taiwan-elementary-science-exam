# P12 G04S1 114 — Batch03 大華國小期中原卷科學／圖形逐題驗收

## 凍結規則與來源

- 來源：`114_翰林_四上_自然_期中評量卷_大華國小.pdf`，`SCI_G04_S1_114_MID_010`；**原始二頁 PDF**；SHA-256 `d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6`，與實際本機二進位檔一致。
- 初審：全卷 **50** 個原卷作答位置；17 個原有 `NONMATCH_G04S1_KP_ARCHIVE`（包含月相等，未做新當期 KP 入庫推論），33 個候選／HOLD／KP 待定全部納入本批科學審核。
- 114 年 25 卷全部科學、KP 與圖形篩選完成、最終候選清單另經人工核准**之後**才正式入庫；不要求 108～113 年完成。出處：`data/governance/p12-g04s1-114-full25-screen-before-public-admission-v1.json`。
- 所有判定均為**獨立模型科學閱讀原 PDF**，不是原卷教師答案認證、出版社授權、學習者圖片驗收或正式 KP／公開入庫。原卷不得因選項疑義被直接改寫覆蓋。

## 本批 33 個來源題位

| 判定 | 題位 | 實際後續 |
|---|---:|---|
| `FULL_PASS` | **19** | 來源科學解答可獨立驗證，仍未公開 |
| `CORRECTABLE` | **4** | 待修訂；另存草案並重驗收，原卷不改 |
| `HOLD` | **10** | 魚圖八個框未鎖原題位 ID 坐標，開放式回答兩格尚無具體評分規準 |
| `REJECT` | **0** | 本批未另外排除題位 |
| **合計** | **33** | 16 個來源原圖依賴題位已核閱原圖，8 個魚圖 ID 幾何位置仍有證據缺口 |

源分類核對：8 個 `KP_MATCH_CANDIDATE`、16 個 `KP_MATCH_SOURCE_EVIDENCE_HOLD`、9 個 `REVIEW_KP_UNCERTAIN`。這三種是 **first-pass 來源分類**，不能與本批科學 verdict 混用。

### 第 2 頁圖形

原卷圖片「將用鰓呼吸的水生動物圈起來」：魚、蝦、蟹均有鰓，三個原題位各判 `圈選`。青蛙四肢／跳躍游水單格應塗色。

水生植物四分類原圖順序為 **D／D／C／B**：香蒲挺水、荷花挺水、右側漂浮植株漂浮、睡蓮浮葉。圖中右側小型浮生植株不額外臆斷物種名稱。資料皆保留 exact source slot lineage。

**魚體八框 HOLD 不是魚的基本科學答案不知道：** 原圖箭頭可辨識 G 鱗、A 背鰭、C 鰓蓋、H 尾鰭、D 口、E 臀鰭、B 腹鰭、F 胸鰭。然而第一輪 `S03|G05|014`～`021` 項目只稱「魚圖第 1～8 個框」，**未鎖定第 1～8 的實際座標與閱讀順序**。直接按圖框猜對 source ID 會破壞來源追溯，故保持八題 `HOLD`、答案欄 null，單獨記錄原圖區域：`data/review/p12-g04s1-114-b03-dahua-fish-eight-box-geometry-hold-evidence-v1.json`。日後先建立 exact ID→座標再驗證答案，原圖並未被複製到公開題庫。

### 命題問題和 KP 邊界

- 蝌蚪變青蛙「哪項完全不變」：`皮膚狀態`並未定義且變態期間皮膚亦有改變，無可靠唯一不變選項；`CORRECTABLE`。
- 「海洋資源」題把「珊瑚礁岩建材」當一般正面選項，未標註採集破壞／限制；`CORRECTABLE`，避免課程傳遞不當保育訊息。
- 「地球上最孤獨的鯨魚」本文有科學缺陷：將鯨視為魚類、將「大部分鯨聲只有15–20Hz」概括為通則、未經證實的「52Hz鯨沒有朋友且同類完全聽不見」敘述。第 1、3 題採 `CORRECTABLE`。第 2 題選 ④ 僅表示**原文未列「趕走敵人」**，不能據此斷言真實鯨豚不會發出防禦相關聲音；其是否命中 U03 `聲音需要介質傳播`仍待 KP 範圍核定。
- 鯨魚閱讀第 4 題有 **兩個實際作答空格**，來源缺評分準則，**兩格各 HOLD**；可候選保育行動不得當原卷唯一答案。
- 第 1 部分「浮潛勿碰珊瑚海龜」、「拉姆薩六公尺細部條文」、「限制過度捕撈」有可判定的科學真假，但其目前 45 KP 的實際歸屬**仍待審**。獨立科學 `FULL_PASS`不解鎖 KP。六公尺條款僅適用拉姆薩定義的部分海域情形，不能由深度單一條件泛化所有水體。

四個 `CORRECTABLE` 的獨立、未核准教學修訂稿：
`data/review/p12-g04s1-114-b03-dahua-four-correctable-rewrite-proposals-v1.json`。

### 凍結累計與下一任務

| 累計 B01–B03 | 件數 |
|---|---:|
| 來源 25 卷 first-pass | 25／25 |
| 已獨立科學審核的原卷題位 | **95／1,285** |
| 科學 `FULL_PASS / CORRECTABLE / HOLD / REJECT` | **74／10／10／1** |
| 原 B15 HOLD＋KP uncertain 440 題位已審 | 75 |
| 原 B15 HOLD＋KP uncertain 尚未獨立科學審核 | 365 |
| 原一般 845 候選已審／未審 | 20／825 |
| 原 1,285 個候選／待定尚未獨立科學審核 | **1,190** |
| 原始來源題位、整體網站與四上網站答案位置 | **1,623／251／53**（不變） |
| 114 年此輪新增公開題位 | **0** |

本批科學審核已涵蓋大華原卷的 33/33 個候選或 uncertain 題位，但 10 個 HOLD、4 個待修正和相關 KP 尚未解除，不能宣稱該考卷已具備正式入庫條件。

Data: `data/review/p12-g04s1-114-b03-dahua-mid-science-figure-verdict-v1.json`；
progress: `data/review/p12-g04s1-114-b03-science-figure-acceptance-progress-v3.json`；
CI contract: `tests/p12-g04s1-114-b03-dahua-science-figure-33-verdicts.test.mjs`。

NEXT_RESUME_TASK = `P12_G04S1_114_ALL25_ScienceAnswerVerdictAndFigureEvidence_Batch04`. Batch04 selects a different source with independent original PDF and avoids all B01–B03 existing source item IDs. No public admission until all 114-source candidates reach terminal review states and final consolidated operator authorization.
