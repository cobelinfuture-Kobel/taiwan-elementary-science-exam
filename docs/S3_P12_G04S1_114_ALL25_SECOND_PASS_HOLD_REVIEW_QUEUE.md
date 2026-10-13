# P12 · G04-S1 · 114 25/25 source FIRST-PASS 後之第二輪驗收佇列

此階段不是公開 admission，也沒有獨立科學答案判定。沿用四上 U01–U04 共 45 個 frozen canonical KP、原始 PDF、已合併的 V17 原卷題位權威；不重跑或默改 1,623 個來源位置。

## 批次清冊

- 主清冊：`data/review/p12-g04s1-114-secondpass-all25-hold-and-kp-review-queue-v1.json`。
- 五個實際 source slot 佇列：`data/review/p12-g04s1-114-secondpass-acceptance-queue-b15-part01.json` ～ `part05.json`。
- 25 份原卷全部存在於這五個 shard，按 V17 原卷順序各五卷，防止跨卷重複。
- 歷史永安期末 V2 中四個 `SCORE_POINT_GAP_NOT_A_CERTIFIED_SOURCE_POSITION` 假題位（未證實配分占位）明確過濾，沒有拿來補題或多算。

| 來源題位分類 | 全 114 題位 | 後續處理 |
|---|---:|---|
| KP_MATCH_CANDIDATE | 845 | 待原題逐選項科學答案、來源證據驗收 |
| KP_MATCH_SOURCE_EVIDENCE_HOLD | 325 | 逐題補原圖、題意、科學判定或來源計分 |
| REVIEW_KP_UNCERTAIN | 115 | 確認 45 KP 範圍、題目實際能力與每選項語義 |
| NONMATCH_G04S1_KP_ARCHIVE | 338 | 只歸檔，勿因出現在原考卷而硬映射 |
| **所有來源題位** | **1,623** | 未新增公開入庫 |
| **第二輪 HOLD + KP 人工複審佇列** | **440** | 有 source slot ID 的可逐筆驗收佇列 |

## 科學與版面正式入庫 gate

每個候選可公開之前，必須逐題留下：

1. 原始 PDF 及原文題組脈絡、來源 SHA（其中三份歷史原卷尚未核證）；題位可追溯，含複選、文字、相依小題、圖像。
2. 適用現行四上 **45 KP** 並具備個別題目/選項層級語義；不是僅根據原卷期中期末或出版商名稱。
3. 獨立科學答案與每個選項的合理性驗收；來源卷中印出的答案不能直接視為教師核准正解；無法唯一判定則 HOLD/REWRITE/REJECT，不能擅改事實。
4. 對必要來源原圖有**完整圖文可讀、比例正確、雙欄與 A4 列印驗收**；不得未經權限使用原卷圖片，必要時重新繪圖。
5. 原卷配分不等於原卷題數。本次 114 學年度尚有 **21 分**來源配分換算疑點；勿以分數補造作答框。
6. Source rights / learner output rights / operator public admission / website readback 各別有獨立證據。未通過時 `public_release_approved=false`。

## 下階段最短工作

`P12_G04S1_114_ALL25_ScienceAnswerVerdictAndFigureEvidence_Batch01`

先以 source slot ID 從 440 佇列按原卷分批提取原文/原圖，對高優先的「來源原圖題」與「KP 邊界」做 **FULL_PASS / CORRECTABLE / HOLD / REJECT** 語義及答案判決。同時將 845 一般 KP 候選投入科學答案驗收；經過同樣的圖形與權利 gate 才能進正式候選區。不可直接從 440 佇列或 845 項目增加公開題庫。

## 保持不變

Public site：所有年級答題位置 **251**、G04-S1 **53**，本輪新增 **0**。此文件僅提供第二輪實際工作清單和驗收門檻。
