# P12 B02｜崇德國小 114 四上期中：Article 9 完整原題來源庫與科學 KP 初審

## 本輪權限與範圍
前一輪經操作者核准 PR #46 以 Article 9 將依法令舉行之正式校內試題純文字原題公開保存，公開來源庫與正式學生練習題庫分離。本輪沿用 **已核准** 流程，不改舊 187-KP authority、不改網站抽題庫，且保留 114 全25原卷完成篩選後的操作者核准門檻。

## SourceExact 證據
- 原卷：`114_南一_四上_自然_期中評量卷_崇德國小.pdf`；頁首實際記載：**高雄市田寮區崇德國民小學114學年度第一學期【自然科學】期中考**，四年級。
- Connected Drive file ID `1-KKh_8kID9Y7Ua9sAltnjGy-9lftmhrY`，本輪從原始 972,168 byte PDF 重新計算 SHA-256，**`90967222348a95719ee1263240e5ae943e9d4f4d4cc15b7ea576191d0f618335`**，符合 V2 frozen source manifest；原 PDF 共2頁。
- 實際渲染第1頁並核對雙欄；僅處理**左欄是非題8 + 單選題8 = 16 題**，共32分。右欄與第2頁共用情境、圖表、閱讀、勾選與作答格全保留為另一條處理佇列。
- 原題來源 ID 完整沿用 `data/review/p12-g04s1-114-nanyi-chongde-mid-source-visual-preflight-v1.json`：`SCI_G04_S1_114_MID_003|S01|TF|001..008`、`...|S02|MC|001..008`；**並非**重新產生的來源 ID。
- 原始 PDF text-layer：每題完整題幹、全部 4 個原選項，以及原始填答括號的精確字符 bbox（PDF points/top-left）；全部16筆均有第1頁原座標，左界 `28.32pt`、右界 `60.28pt`。無須 OCR。
- **法律限定**：依法令舉行的學校正式考試原題文字，引用 Article 9(1)(5)；沒有公開掃描卷、原始教師答案詳解、額外受保護圖片或第三方閱讀文章。原始來源透過已連接 Google Drive 取得，**不虛構**已驗證的學校官方下載連結。

## 第二輪科學與 KP（模型初審，非教師解答認證）
| 檢驗 | 結果 |
|---|---:|
| 完整獨立來源單題 | 16/16 |
| 有初步唯一答案、科學無明顯問題 | 15 |
| SCIENCE HOLD | 1 |
| 四上 KP 強候選 | 8 |
| 四上 KP 不符，建議四下 U01（月亮單元） | 7 |
| KP 待覆核 | 1 |
| 強 KP 同時科學初審合格 | 7 |
| 原始教師答案認證／正式 KP 批准／正式學生題庫新增 | 0／0／0 |

- **HOLD**：`SCI_G04_S1_114_MID_003|S01|TF|007`，完整語句與永安期中是非第4題相同；後半句「生物種類較多」缺比較基準。不因前半句海洋是鹹水水域正確就直接放行全句。
- **跨校原文重複**：上題與 `SCI_G04_S1_114_MID_001|TF|S01|004`；另崇德單選第2題「荷花地下莖孔洞」與永安期中單選第10題完全相同題幹，但**四個選項排序不同、正解代號不同**（崇德②／永安①），不得以選項代號直接去重。
- KP REVIEW：崇德是非第5題「所有植物葉柄都存在明顯空隙」；雖涉及漂浮植物氣腔適應，但不強行對應特定 KP。
- 月亮與觀測程序各題皆保留**四上原卷身份**，跨四下 U01 為暫定 mapping，不動原始考卷分類。
- `MODEL_SCIENCE_PASS` 僅是本輪模型獨立初審，**不等於已取得原教師答案**；正式唯一性複核、KP 驗收和 operator admit 仍是另外的閘門。

## 累積原題來源進度
- 永安 114 四上期中20 + 期末22 + 崇德 114 四上期中16 = **58 個原始獨立單題來源紀錄**，而非58個去重後的知識概念。
- 當中 **26 是非、32 單選**（共128個原始選項）；**53 科學初審通過、5 HOLD**；跨校已識別2組題幹重複。
- 完整單題流程已涵蓋3份原卷的第一頁左欄／指定區域，並非已完成3份整卷每個題組。
- 114 frozen corpus：25份原始PDF、1623個作答位置不變。學生網站仍是251個作答位置、四上53個；本輪新增正式抽題**0**。

## 完成資料
- `data/source-archive/p12-art9-114-chongde-g04s1-mid16-original-questions-v1.json`
- `data/review/p12-art9-114-chongde-mid16-source-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v2.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`（追加16；保留25卷清冊）
- `tests/p12-art9-chongde-mid16-source-science-kp.test.mjs`（Fail-closed source/rights/science/KP/duplication/site gates）

## NEXT_RESUME_TASK
`P12_STANDALONE_B02_NextUnscreenedTextLayerPaper_Art9FullOriginalTFMC_ScienceKP`

順著 frozen 25 卷佇列選下一份有文字層原卷，先抽最容易完整收錄的獨立是非題與單選題，再獨立審科學與 KP；不得讓共用圖像題、分組作答格阻塞文字單題。
