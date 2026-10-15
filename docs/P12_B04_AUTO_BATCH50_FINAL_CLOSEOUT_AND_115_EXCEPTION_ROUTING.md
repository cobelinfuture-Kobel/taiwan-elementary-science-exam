# P12 B04 AUTO_BATCH50｜B01–B09 正式初審 Closeout 與剩餘 115 筆例外路由

## 1. 已關閉的階段

- 原卷：114 學年四年級上學期，25 校卷、717 個獨立原卷作答位置。
- 模型初審：Science PASS 644、Science HOLD 73；其中 425 個 Science PASS + KP strong candidate 優先來源位置。
- AUTO_BATCH50 前：16 個位置已檢查（9 永安 + 6 崇德正式入庫；另 1 位置同題去重）。
- 本輪九批 **409 / 409 已初審**。B01–B07 **294 個正式來源位置入庫**；B08–B09 尚無正式入庫。
- 既有學生網站累計 **560 個作答位置**（267 是非 + 158 單選 + 135 題組小題；題組共 36 組）。
- 正式關閉的是 **B01–B09 初審、B01–B07 發布，以及 B07 31 題 Pages E2E**；**例外 115 筆尚未結案或發布**。
- 證據基準：main `7c74584095de75cda33dbe9cda382ff8db67cedd`；[Science Exam CI run 38731092543](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/actions/runs/38731092543) 與 [Pages deploy / deployed verification run 38731092771](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/actions/runs/38731092771) 均 success。

| 批次 | 初審 | 已正式入庫 | 未入庫 | 掃描 BBox 阻塞 |
|---|---:|---:|---:|---:|
| B01 | 50 | 47 | 3 | 0 |
| B02 | 50 | 41 | 9 | 0 |
| B03 | 50 | 41 | 9 | 0 |
| B04 | 50 | 47 | 3 | 0 |
| B05 | 50 | 40 | 10 | 0 |
| B06 | 50 | 47 | 3 | 0 |
| B07 | 50 | 31 | 19 | 19 |
| B08 | 50 | 0 | 50 | 50 |
| B09 | 9 | 0 | 9 | 9 |
| **合計** | **409** | **294** | **115** | **78** |

## 2. 115 筆例外分類（互斥主類型）

| 主類型 | 來源位置 | 操作處置 |
|---|---:|---|
| 掃描 PDF 尚缺可認證的原卷作答格 BBox | **78** | 先核實原卷實際頁面影像、版面旋轉及比例，重建可追溯的像素／PDF 座標證據；影像目測估值不得當作已驗證原生 glyph BBox |
| 非掃描卷：已知原題重複 | **3** | 保留 lineage，不重複發布學生題 |
| 非掃描卷：原卷選項印刷／編號問題 | **1** | 原文保留、人工判斷能否忠實呈現；不可悄悄改成不存在的原卷選項 |
| 非掃描卷：Science 唯一答案、KP 語意／範圍等疑義 | **33** | 按單題審核答案、概念範圍、課程權威 KP；確定唯一答案才能進 formal gate |
| **合計** | **115** |  |

掃描 78 筆的 **交叉阻塞** 必須繼續保留：其中 **72 筆僅有掃描 BBox 主阻塞**，另 **6 筆除了 BBox 之外，還有去重或 Science/KP 異常**（2 跨校重複 + 4 Science/KP：B07 1 與 B08 3）。這是互相重疊的品質條件，不能把「72」宣稱為已可發布。和順掃描卷來源共 **42** 筆（B07 19 + B08 23），普仁掃描卷共 **36** 筆（B08 27 + B09 9）。

機械可讀逐筆清冊：`data/review/p12-b04-auto-batch50-final-closeout-115-exceptions-v1.json`。每筆保留 frozen 批次、source ID、原卷來源、PDF SHA256、頁碼、原審查檔及所有 exception flags，不更動任何原審清冊或已發布題。

## 3. 建議續跑優先順序

**E01 掃描卷原圖幾何證據恢復**：先處理 72 個「無額外旗標」的位置，按照同一份 PDF 批次完成影像版面、旋轉、頁碼、題號與作答格座標對照；建立 `verified_bbox` 與證據方法，不能把 `visual_estimate` 改名成 certified。圖文依賴、轉錄原文及第三方內容仍須重新核實。

**E02 掃描卷複合阻塞**：剩餘 6 個掃描位置，2 個已知同題以 lineage 方式保留、不重複入庫；其他 4 個完成 Science/KP 爭議判定後才可考慮單題正式驗收。

**E03 非掃描 Science/KP 例外**：33 筆按「可修正 KP 映射但不改原題」與「原題欠唯一答案／語境模糊」分流。不得因套用新 KP 自動核准有多個合理答案的題目。

**E04 印刷瑕疵及重複題**：1 筆原卷選項印刷瑕疵獨立來源覆核；另外 3 筆非掃描重複題只保留來源 lineage。必要時另建明確標示的教學改寫題，不冒充原卷。

**E05 選擇性 Admission**：僅對證據完備的單題再執行 `SOURCE_EXACT → REAL_PDF_IMAGE_BBOX → UNIQUE_SCIENCE_ANSWER → CANONICAL_KP → DUPLICATE → RIGHTS → PR/CI → main readback → Pages E2E`。批次通過題先發布，疑義題不拖累；不得從例外清冊直接自動上架。

## 4. Scope 與不可改動項目

- 本階段僅做 **closeout + 115 例外分類與後續精準恢復**；不重新生成／編號既有 409 初審，不重寫原卷或已發布 294 題，不增加學生公開題庫。
- 學校原始標準答案 **未獨立驗證**；「模型獨立科學推理」不得寫成「原校教師答案」。
- 原卷計分說明在來源證據保留；學生展示可做經驗證的不計分投影。
- 另有 **219 個模型 Science PASS 非此優先序列候選**及 **73 個 Science HOLD**，不含於這 115，應另立後續 scope，不混進本次 115 分母。
- 靜態 closeout 資料不得使 CI 誤以為原先 frozen AUTO_BATCH50 清冊需重新切分。後續來源版本若變動，應 fail-closed。

`NEXT_RESUME_TASK = P12_B04_EXCEPTIONS_E01_ScanPDF_72BBoxOnly_SourceImagePixelGeometryRecovery_Then_ScienceKP_Dedup_SelectiveAdmission_PR_CI_Pages`
