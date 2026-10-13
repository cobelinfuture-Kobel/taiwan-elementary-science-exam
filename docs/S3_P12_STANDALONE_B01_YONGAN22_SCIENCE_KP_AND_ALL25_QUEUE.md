# P12 Standalone B01 — 永安 22 題獨立科學判答／45-KP 第二輪與全 25 卷佇列

## 本輪實際執行（2026-10-13）

重新讀取連接 Google Drive 的原始 `114_南一_四上_自然_期末評量卷_永安國小.pdf` 可選取文字，不只依賴 V17 摘要；原 PDF 身分採 PR #43 已實際驗算的 SHA-256 `88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf`，本輪**未重新計算原始 PDF binary SHA**。

- **22/22**：只評核第 1 頁真正可獨立作答的 8 是非與 14 四選一，沿用 PR #43 私有來源全文和作答框幾何。所有原題幹、選項與原圖仍只存在 user-private corpus，**不放進公開 GitHub**。
- **20**：模型獨立找到一致的科學答案；`MODEL_SCIENCE_PASS` 是尚待最終科學／操作人覆核的判斷，**不是教師原答案、正式入庫或公開許可**。
- **2**：`SCIENCE_HOLD`，`TF|S01|005` 「目前臺灣核能發電為主」有統計時點依賴，`MC|S02|004` 「選錯誤敘述」同時存在 ③、④ 兩個錯誤，單選題不能有唯一答案。兩題保留原文、保留問題，不使用暫定 MC004 ④ 作為正式單選答案。
- **四上 45 KP 第二輪（尚非正式簽核）**：**11** 題有較直接的 canonical KP；**6** 題不屬這 45 KP（其科學答案是否正確與 KP 範圍分開判斷）；**5** 題尚需教材知識點精確性複核。
- 特別修正建議：`MC|S02|001` 原 V17 對應光源（`03_05`），但原題核心是「看見物體需要光」（`03_04`）；`TF|S01|008` 只考電池供電用途，不能因提到電池就視為已明確命中電池「正負極」的 `04_01`。**V17 舊版 mapping 不覆寫。**
- 全 25 卷 B01 SOURCE-FIRST 執行順序已建立：**21 份文字層原卷先行**，**4 份純圖片卷另行視覺擷取**；總原始作答位置維持 1,623。只算已確實完成私有全文試產的 22 題，其餘 24 卷不偽稱已完成。

## 結果檔案

- `data/review/p12-standalone-yongan22-science-kp-secondpass-v1.json`：22 個原 Source ID、非原題重製的科學答與理由、HOLD、canonical KP 建議及出版門檻。
- `data/review/p12-standalone-all25-source-first-queue-v1.json`：全 25 卷可追溯的素材/文件序列，僅 1 卷前 22 題已有私有完整來源。
- `tests/p12-standalone-b01-science-kp-and-all25-queue.test.mjs`：雙重答案、KP 跨範圍、25 卷總數與 no-public 維護測試。

## 入庫分離門檻

`SOURCE_PRIVATE_COMPLETE` → `INDEPENDENT_SCIENCE_UNIQUE_ANSWER` → `CANONICAL_KP_SCOPE_FINAL` → `SOURCE_USE_RIGHTS/REWRITE` → `LEARNER_PRINT` → `ALL25_FINAL_CANDIDATE_LIST` → `USER_EXPLICIT_PUBLIC_APPROVAL`。

即使來源完整也不得跳過科學判答；科學正確但不符合四上 45 KP 的題目，也不能進四上入庫池。其他年級學期可以另做語意轉投影，但不可竄改來源卷原始身分。

**本輪正式 KP 簽核 0、教師答案表驗證 0、公開入庫 0。網站總數維持 251 作答位置，其中四上 53。**

## NEXT_RESUME_TASK

`P12_STANDALONE_B01_NextTextLayerPaper_FirstPageTFMC_OriginalFullSourceAndBBoxThenScienceKP`

先依已凍結 queue 讀下一份文字層原卷，逐題抽取完整私有原文/選項、頁次、作答框幾何與唯一作答，再跑科學判答與 45 KP 分流；不要等複雜圖題、也不要假設來源初審已完成公開審核。
