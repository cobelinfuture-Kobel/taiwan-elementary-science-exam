# P12 E01 普仁四上期中｜18 個原卷掃描位置視覺恢復，13 題選擇性收錄／5 題保留

## 原卷身分與幾何
- 來源：`114_康軒_四上_自然_期中評量卷_普仁國小.pdf`，原卷 SHA256 `6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351`，2 頁掃描卷。
- 對照 `data/source-archive/p12-art9-114-puren-g04s1-mid27-original-questions-v1.json`，凍結的 18 個原題 ID 與 PDF 原始全文及選項。
- 使用 PyMuPDF `get_pixmap(Matrix(1.6,1.6),alpha=False)`：每頁呈現 1166 × 1651px，頁面 /Rotate 0，實際圖像確認每個答案格位置。
- 頁面 1 RGB SHA256 `0c3ec6dd81476068b43d7844697c480e1364bbf0456482d5d64ac7b7f41b0bb9`；頁面 2 `fe57caf2381bfc66e9353a4c0608c4554de9cafdee9afe76032f1baf0fe4643f`。舊視覺估計座標不自動升格為正式座標，重建來源像素框與換算 PDF points；非文字原生 glyph BBox。
- 不將掃描原卷、圖片裁切、學生姓名等放入公開網站。保留原卷計分父指示 `(每個答案1分)` 在審核證據；學習者只呈現經驗證的不計分投影。

## Science/KP 二次複核
- **13/18 通過**：8 個四選一、5 個是非，原卷題幹、全部選項、模型獨立科學答案、課綱 canonical KP、跨已發布題庫 exact-stem 去重均驗證，無圖文共用依賴。
- **5/18 HOLD，不得直接入庫**：
  - `S1|MC|001`：日曬、風吹等岩石風化問題未直接對應 `sci_g04s1_01_05`「流水搬運地表物質」。
  - `S1|MC|002`：地震規模定義的概念粒度不符合 `sci_g04s1_01_08`「地震造成地表變動與災害」的直接 KP。
  - `S1|MC|011`：「不是水生植物特徵」選項含非通用的葉柄儲氣／葉面防水等敘述，存在多項合理疑義。
  - `S1|MC|013`：土壤、砂、岩石觸感受樣本性質左右，原題缺少可判定的材料條件。
  - `S3|G01|005`：地震時「大聲尖叫可舒緩緊張」沒有客觀的唯一科學安全判準。
- 原校教師答案鍵未核實，不可冒稱已比對教師標準答案。任何科學/KP 疑義與恢復座標的成功分開審核。

## 發布與 fail-closed
- `data/review/p12-e01-puren-mid18-raster-pixelbbox-13accept-5hold-v1.json` 完整追蹤 18 個 source slots／原卷 SHA、每頁像素 hash、原始/學生全文與選項、science/KP／額外 HOLD。
- `site/data/question-bank/p12-e01-puren-mid13-public-v1.json` 僅 13 個合格位置，`site/assets/js/p12-e01-puren-mid13-release.mjs` 以 immutable expected map 執行強制原題、答案、KP、PDF、BBox、權利及 operator 授權檢查。
- 發布需 PR CI／main readback／Pages E2E 皆成功，否則保留前版網站 **576 題**。
- 成功後累積 **589 個作答位置（282 是非、172 單選、36 組情境共 135 小題）**；原 99 筆未入庫來源轉為 **86 筆**：和順兩卷 38 個尚缺 BBox，普仁本卷 5 個新增 Science/KP HOLD，加上原先其它 43 個例外。不可將初審清冊重新切分或抹去例外 lineage。

## 下一步
`NEXT_RESUME_TASK = P12_E01_HESHUN_MID17_Then_FINAL21_RotatedOriginalScanPixelBBoxRecovery_ScienceKP_Dedup_SelectiveAdmission_PR_CI_Pages`
