# P12 B22｜普仁國小四上期中原卷 Article9 Source／Science／KP

## 原卷證據
- Frozen source：`SCI_G04_S1_114_MID_009`，桃園市普仁國小，康軒 114 學年度四上期中；`114_康軒_四上_自然_期中評量卷_普仁國小.pdf`。
- Google Drive PDF file ID `10wbO1FxnIVWaP-jLyivsV6vzOxhkzUPG`。實際來源 PDF：**2 頁、1,166,576 bytes**，SHA256 `6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351`，與 frozen source map 相同。兩頁已直接渲染、放大視覺判讀，來源沒有 selectable text；沒有依賴 OCR。
- 來源辨識作答位置 **54**，印刷總分 **100**；辨識到的作答位置僅能對應 **96 分**。原第二大題寫「共 42 分」，可辨識 19 個位置×2 分＝38 分，**4 分無法對應**，保留 `score_parity_certified=false`，不得補造兩個作答位置。

## 首輪完整文字單題篩選
- **27 個 source-only 完整獨立題**：S1 四選一 **15 題／全部 60 個原卷選項／30 分**；S3 第一組地震防災判斷 **6 題／6 分**；S3 第二組「**漂浮性水生植物**」判斷 **6 題／6 分**。S3 各小題連同原卷共同作答說明保存。
- **27 個來源位置延後**：S2 共用植物代號 4、沙石吹風共同實驗與圖形 5、魚身構造圖 6、動物分類結構圖 4，共 19；S3 113-04-03 地震報告表格共 5；S4 茭白筍共用閱讀 3。來源位置得分總計 54 分。另有印刷 4 分差異獨立 HOLD。
- 掃描影像上的作答框保留 `answer_marker_pdf_bbox_pts_upright_visual_estimate` **估計定位座標**；無 native PDF glyph bbox，也未通過精確逐像素驗收。不得把 raster visual estimate 認作 text layer 的 exact source bbox。

## Science 模型判斷與 KP 人工覆核
| 項目 | B22 |
|---|---:|
| 完整原卷獨立文字單題 | **27** |
| Science model preliminary pass | **26** |
| Science HOLD | **1** |
| KP strong candidate | **21** |
| KP REVIEW | **6** |
| KP nonmatch current G04S1 | **0** |
| KP strong ∩ Science provisional pass | **20** |
| 原始教師答案核驗／正式科學答案／正式 KP／網站入庫 | **0／0／0／0** |

- **Science HOLD S1 MC010**：「關於荷花的敘述，下列哪一項不正確？」原卷第③「屬於浮葉性水生植物」與第④「葉面保持平貼在水面上」都不是荷花常態，至少兩個合理不正確選項，故模型答案 `null`，不假設教師指定唯一答案。
- **Source Map 實際錯配六題**：S3 G02 的原卷共同題幹明寫「漂浮性水生植物」，但舊 frozen map 六筆指向 `sci_g04s1_02_05` **沉水性植物的適應**。依正式 `site/data/authority/science-g03-g04-selector-v2.json`，正確建議 KP family 是 `sci_g04s1_02_04` **漂浮性植物的適應**。六筆保留錯誤舊值為 lineage，新增建議值並保留 **KP_REVIEW ×6**；不可靜默改 frozen source map 或視同正式 KP 通過。

## 跨學校來源去重
- 與 v22 **672** 個歷史原卷 source occurrences，依 NFKC／忽略標點空格／相鄰字 bigram Jaccard 門檻 0.50 比較獨立題幹。
- **Exact 1 組**：新普仁 S1 MC004 與 `SCI_G04_S1_114_MID_008|S02|MC|012`。
- **Near but nonexact 1 組**：新普仁 S1 MC010 與 `SCI_G04_S1_114_MID_008|S02|MC|011`，bigram Jaccard **0.7647**。
- Source 原卷學校、位置與 ID 均保留，不跨卷刪除來源紀錄，且 MC010 的內容歧義仍 HOLD。

## v23 additive 原卷來源累積
| 指標 | v22 | B22 | v23 |
|---|---:|---:|---:|
| 原卷完整獨立文字題 occurrences | 672 | 27 | **699** |
| TF/judgment | 403 | 12 | **415** |
| MC | 269 | 15 | **284** |
| 選擇題印刷選項 | 1076 | 60 | **1136** |
| 模型科學初審 PASS | 602 | 26 | **628** |
| 模型科學 HOLD | 70 | 1 | **71** |

本輪 **24/25 份原卷有完成至少一輪獨立題來源收錄**，尚餘普仁 114 四上期末圖片型 PDF。原 25 份考卷／**1,623 個 frozen answer positions** 不變。學生網站已認證題目 **251 原作答位置／G04S1 53**，新增 **0**。模型預判不代表正式教師答案、KP acceptance、精確掃描 BBox 或學生網站入庫。

## GitHub files
- `data/source-archive/p12-art9-114-puren-g04s1-mid27-original-questions-v1.json`
- `data/review/p12-art9-114-puren-mid27-science-kp-visual-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v23.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-puren-mid27-scan-visual-science-kp.test.mjs`

Next after PR CI and main readback: `P12_STANDALONE_B23_PUREN_FINAL_IMAGE_ONLY_VisualTFMC_SourceScienceKP`。
