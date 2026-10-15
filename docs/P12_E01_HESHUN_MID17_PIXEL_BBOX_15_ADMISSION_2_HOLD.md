# P12 E01｜和順四上期中 17 來源位置：掃描 PDF 旋轉幾何恢復、15 題入庫／2 題保留

- 原始校卷：`114_南一_四上_自然_期中評量卷_和順國小.pdf`，SHA256 `3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f`，經使用者已連接的 Google Drive 取得原始掃描 PDF。
- 原 PDF 2 頁，頁面 rotation=0，但內容是橫置印刷畫面；PyMuPDF 1.6 倍先渲染成 1650×1166 pixels，再以 Pillow `rotate(270,expand=True)` 轉為 1166×1650 正向頁面。
- 正向頁面的 RGB SHA256：P1 `3fdba6bdca23ca017da18f19a3267543c9f7abe02e1b67f36d62a313228c5ff0`；P2 `91d994d369d446d20745a3e32183d0fa167b721e0094524235eb1f7b0b4047a4`。每一來源位置記錄人工視覺逐題框選的 **original raster upright pixel BBox**，用 1.6 像素每 point 換算正向 top-left PDF geometry，明確標為 **not native glyph bbox**。
- 模型視覺已比對全部 17 筆印刷題號、原卷題幹、原始四選一選項及作答格。
- 15 個 Source／Science／KP 過關（9 是非 +6 選擇），無圖文依賴；已檢查舊公開題庫完整題幹不重複，無掃描裁圖發布，不冒充原校教師答案。
- 2 題例外 **不可先發布**：
  - `SCI_G04_S1_114_MID_002|S2|TF|007`：水生動植物的交互影響不直接對應 `sci_g04s1_02_02`「水域環境條件差異」，欠穩定 canonical KP。
  - `SCI_G04_S1_114_MID_002|S2|TF|011`：凍結 JSON 原文含「太陽的位置貼水面置隨時間而變化」，與原卷印刷內容不一致；需單題 source-exact 修復，不得靜默更改原卷或直接上架。
- 機械可讀 source geometry + QA ledger：`data/review/p12-e01-heshun-mid17-pixel-bbox-15accept-2hold-v1.json`。獨立學生 JSON `site/data/question-bank/p12-e01-heshun-mid15-public-v1.json`，immutable runtime gate `site/assets/js/p12-e01-heshun-mid15-release.mjs`。
- 若 PR CI、main readback 與 Pages live E2E 全部通過，累計網站 **589→604 作答位置**，**291 是非、178 單選、36 情境組共 135 小題**；累計例外 86→71。和順期末 21 個來源位置另批處理，不受此批阻塞。
- 後續 `NEXT_RESUME_TASK=P12_E01_HESHUN_FINAL21_RotatedPDF_RasterExactBBox_ScienceKP_Dedup_SelectiveAdmission_PR_CI_Pages`。
