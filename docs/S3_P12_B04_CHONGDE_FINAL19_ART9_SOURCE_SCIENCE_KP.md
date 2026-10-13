# P12 B04｜崇德國小 114 四上期末 Art9 原題來源與 Science/KP 第二輪

## Freeze and original source readback
- Original PDF: `114_南一_四上_自然_期末評量卷_崇德國小.pdf`，connected Drive id `1MVDJoRVSqpN4s1FPNp_nWSy5G5knc2-l`.
- 原卷頁首：高雄市田寮區崇德國民小學114學年度第一學期【自然科學】期末考；**2 頁、461199 bytes**。
- **SHA256**: `8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84`，本輪從原始 PDF binary 重算，與 frozen `data/review/p12-g04s1-114-nanyi-chongde-final-65-source-kp-first-v1.json` 一致。
- 原卷實際 render 並視覺檢驗第1頁，文字層 `fitz` 逐字 readback：**是非8、單選11，共19個單題**，皆為純文字無附圖依賴，完整選項44個；紙本每題2分。二欄原卷不按閱讀欄切分而改寫 source ID；右欄 MC09～MC11 作答框原始 x = 371.71pt、左欄其餘 x = 35.40pt，19個原作答括號原始 PDF 字元 bbox 均已擷取。
- 原卷第三部分總62分、涵蓋閱讀文章、二頁圖形、勾選/題組；保留歷史原卷作答位置不變、另線處理，**本批不把第三部分拆成獨立單題**。

## Article9 safe public source scope
- 依臺灣著作權法第9條第1項第5款，正式依法令舉行的學校試題之**純文字題幹與選項**進入 GitHub `data/source-archive`，保留原題號、字元、順序及原始 provenance。
- **不**連帶重製完整原始 PDF、未另取得使用條件的第三方圖片/文章、教師原始答案或詳解；沒有獨立核對這份 PDF 在學校網站的 exact public download URL，故保留 connected Google Drive 取得的原卷證據，不虛構學校網址。
- `data/source-archive` 只代表來源可公開保存，**不是** `site/data/question-bank` 中正式學生可抽題項。

## 本卷 Science + Canonical KP provisional review
| 指標 | 件數 |
|---|---:|
| 原文完整 TF / MC | 8 / 11 |
| 科學模型初審無明顯問題 | 18 |
| 科學 HOLD | 1 |
| G04S1 45 KP 強候選 | 11（科學初審無明顯問題10） |
| KP REVIEW | 3 |
| NONMATCH_G04S1 / 可能其他學期 | 5 |
| 正式教師答案驗證／科學核准／KP核准／網站新增 | 0 / 0 / 0 / 0 |

- **SCIENCE HOLD: S02 MC003**。②「實驗前先在盒子裝滿石頭或土壤」是錯誤的；但①原文寫「雷射光是一種光源」，將**光線**與**發光的物體（雷射筆）**混為一談，科學上也不精確，故可能形成不只一個錯誤選項。保留來源原文，不出現在正式組卷。
- 另外 TF004 雷射安全題、MC001 電池座功能、MC007 長期不用電器取出電池分屬 `KP_REVIEW`，不把相近主題硬塞進特定45KP。
- 原卷內容中 TF006/MC002/MC005/MC009/MC010 主要涉及石油、能源或減碳和污染來源，不強迫當成四上45KP；僅為部分提出四下 U04 暫定對應，其餘保留 `NONMATCH_G04S1`。
- 學科 model answer 全為**獨立暫定**，未經教師原始解答核准；不在公開來源 JSON 中附原教師解答。

## Cross-school duplicates
| 崇德 FINAL source | 既有永安 FINAL source | 關係 |
|---|---|---|
| S02 MC002 | S02 MC005 | 相同題幹；選項換序，崇德④、永安② |
| S02 MC006 | S02 MC010 | 相同題幹；選項相同，均① |
| S02 MC009 | S02 MC004 | 高相似能源題，**煤炭數百萬年** vs **數百年**；永安版本科學HOLD而崇德版本模型可唯一判答 |
| S02 MC010 | S02 MC006 | 相同題幹；選項換序，崇德③、永安① |

保留雙方完整原卷 source ID、原選項及正解選項編號，先做來源相同與近似辨識，不改既有題幹、不強迫合併。

## Cumulative frozen positions and gates
- 永安 MID20 + 永安 FINAL22 + 崇德 MID16 + 東光 FINAL19 + 崇德 FINAL19 ＝ **96個原卷純文字獨立單題來源**，44 TF、52 MC、選項208。
- 累積 **88 模型初審暫無明顯問題，8 SCIENCE HOLD**；開始逐卷獨立單題取證 **5/25**，並不表示這5卷每一個共用情境題組都已驗收。
- Frozen 114 25卷與1,623原始作答位置不變。正式學生網站仍維持251個作答位置，四上53；本輪新增0。
- 公開原題來源不免除正式 Science unique answer → Canonical KP → Source/figure QA → all25 full screening → operator admission 閘門。

## Durable files
- `data/source-archive/p12-art9-114-chongde-g04s1-final19-original-questions-v1.json`
- `data/review/p12-art9-114-chongde-final19-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v4.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-chongde-final19-source-science-kp.test.mjs`

## NEXT_RESUME_TASK
`P12_STANDALONE_B04_NextTextLayerPaper_Art9CompleteTFMC_ScienceKP`

依 frozen all25 佇列下一個未完成 text-layer 原卷，優先獨立完整 TF/MC 及各選項原始 PDF bbox，模型逐題 Science/KP，附同題/近似題來源 lineage；分開處理圖形與共用情境，不調整已核准的正式學生抽題庫門檻。
