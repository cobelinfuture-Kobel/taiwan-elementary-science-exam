# P12 B05｜大墩國小 114 四上期中：Article 9 SourceExact TF/MC、Science 與 KP

## Operator-approved contract
沿用 PR #46 的正式學校考卷純文字原題 Article 9 公開來源庫規則，並延續 P12 的 **source archive ≠ formal learner exam bank** 隔離。非圖文單題可先完整保存原文；科學唯一答案、KP、來源印刷、全25卷審查與操作者入庫核准各有獨立閘門。

## Original binary readback
- 原 PDF：`114_康軒_四上_自然_期中評量卷_大墩國小.pdf`。
- 頁首可視內容：**臺中市南屯區大墩國民小學114學年度第一學期第一次定期評量四年級自然領域自然試卷**。此卷標示康軒，學校和期別不得與其他學校混淆。
- Drive `1e...` **不是**這份卷；實際原始檔 ID：`17mG1IAXPhDilZuwDBgEUvdCBHE_Otxe5`。
- 2頁、308426 bytes；從原始 PDF binary 重新計算 SHA256 **`8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104`**，與 frozen 原清冊 `data/review/p12-g04s1-114-kanghsuan-dadun-mid-62-source-kp-first-v1.json` 一致。
- 實際渲染、人工目視兩頁，使用原生 PDF 文字字元與座標，無需 OCR；第一頁有8題 TF 與16題四選一 MC，共 **24個純文字獨立原題／48分**。
- Source IDs 完整沿用 `SCI_G04_S1_114_MID_004|S01|TF|001…008`、`SCI_G04_S1_114_MID_004|S02|MC|001…016`；原題正文、64個選項及各題原始左/右欄作答括號 bbox 皆保留。
- 第2頁包含「三、填填看」與「四、素養題」，包括共用圖像、地震測報圖表、配合與作答格。遵照原封存 **62個原始作答位置** 分母，不將其錯拆為第一頁獨立單題或阻塞24題。
- 不複製完整掃描PDF、第三方圖片、教師原始解答詳解。沒有確認確切的校方原PDF外部下載網址，不虛構該連結。

## Source-Exact print preservation (do not silently repair)
1. **TF003 印刷錯字：「從土推上方澆水」**。原頁視覺與文字層皆如此，公開來源 JSON 保留「土推」；科學推理以受控「土堆流水搬運」實驗為意圖，但不能修改原文字。
2. **MC009 選項印刷為 ①海洋、②河流、②池塘、④草原**，第三個答案代碼真的重複 **②**，不是文字提取器錯誤。來源 `SOURCE_HOLD_DUPLICATE_OPTION_LABEL`，科學模型預期答案④；**來源印刷閘門未通過前，不得加入學生正式抽題庫**。不把重複②私自更正為③。

## Independent science and KP provisional decisions
| 檢驗 | 本卷 |
|---|---:|
| 完整、獨立純文字原題 | 24 |
| 科學模型初審暫無明顯問題 | 23 |
| 科學唯一性 HOLD | 1 |
| 科學PASS但來源選項標號HOLD | 1 |
| 同時 Science + SourcePrint 初步通過 | 22 |
| G04S1 KP 強候選 | 21 |
| G04S1 KP 待覆核 | 3 |
| G04S1 KP 不符 | 0 |
| 同時 Science + KP 強候選 | 20 |
| 同時 Science + KP + SourcePrint 初步通過 | 19 |
| 教師原題答案認證／Science正式／KP正式／網站新增 | 0／0／0／0 |

- **SCIENCE HOLD：MC001**，原卷以「礫石、沙、土壤」為粒徑嚴格排序；但土壤包含不同粒徑與有機組成，不等於固定比沙小的單一粒徑等級。③是原卷教科書常見預期，**不是可獨立認證的科學唯一答案**，故暫不公開用於練習。
- **SOURCE HOLD：MC009**，原選項標記為 **①②②④**，本卷與其他學校重複同一物理數字的題號不關聯；必須保留原始選項順序/標記，合法公開原文字並非允許自動改寫。
- **KP REVIEW：MC004** 水域環境田野調查安全、**MC008** 魚梯生態工程、**MC010** 沙丘外貌受風和雨作用；不強套於現有45KP 的其他 owner。
- **MC016** 珊瑚白化的預期答案是②熱廢水；僅在題目列出的四個選項之間成立，不宣稱全球珊瑚白化的主要成因皆為工廠熱廢水。
- **TF008** 玉山圓柏、玉山箭竹生長於高山/亞高山為主，原句「森林中常可見」模型暫判 FALSE；非原教師答案，正式科學審核仍待進行。
- 此卷19項同時通過三個**模型初步條件**者也尚不可自動正式入庫；全25來源與 operator public admission 閘門不變。
- 對既有5卷96個完整來源題幹進行嚴格正規化相等與較寬的雙字相似比對，**本批未找出完全相同或超過0.52門檻的題幹**；不代表語義概念完全不重疊。

## Updated public source-only census
| 名稱 | 原本 | 新增 | 累計 |
|---|---:|---:|---:|
| 完整獨立原題來源出現次數 | 96 | 24 | **120** |
| TF | 44 | 8 | **52** |
| MC | 52 | 16 | **68** |
| MC印刷選項文字 | 208 | 64 | **272** |
| 模型 Science prelim pass | 88 | 23 | **111** |
| 模型 Science HOLD | 8 | 1 | **9** |
| 額外獨立選項印刷 HOLD | 0 | 1 | **1** |
| 至少完成獨立題擷取的原卷 | 5 | 1 | **6/25** |

以上是**原卷來源出現次數**，不是 dedup 後不同的知識概念或正式可抽題數。25份PDF與1623原始作答位置分母不變；網站正式原抽題仍 **251 total / G04S1 53**，新增0。

## Durable assets
- `data/source-archive/p12-art9-114-dadun-g04s1-mid24-original-questions-v1.json`
- `data/review/p12-art9-114-dadun-mid24-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v5.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-dadun-mid24-source-science-kp.test.mjs`

## NEXT_RESUME_TASK
`P12_STANDALONE_B05_NextTextLayerPaper_Art9CompleteTFMC_ScienceKP`

依 frozen all25 queue 取下一份尚未 source-exact 的 text-layer 原卷，依法令正式試題之純文字原題公開來源記錄 + source print anomalies + model independent science/KP review + cross-paper lineage；不動正式學生考試題庫和25卷 operator gate。
