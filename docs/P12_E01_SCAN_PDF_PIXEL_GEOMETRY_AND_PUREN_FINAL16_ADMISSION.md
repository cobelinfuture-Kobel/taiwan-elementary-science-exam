# P12 E01｜掃描 PDF 原圖像素幾何恢復與普仁期末 16 題選擇性 Admission

## 可驗證的原圖取得
從使用者已連接的 Google Drive 讀取四份封存原始掃描 PDF。逐檔計算 SHA256，與 main 原卷 source-archive 相符：
- 和順四上期中 2 頁：`3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f`。原始畫面橫向，正向閱讀需將渲染像素順時針旋轉 90°。
- 和順四上期末 2 頁：`b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e`。PDF 標記 /Rotate 90，正向閱讀需將目前呈現的畫面逆時針旋轉 90°。
- 普仁四上期中 2 頁：`6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351`。正向直式。
- 普仁四上期末 3 頁：`2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690`。正向直式。

四份來源皆為掃描影像、無 native text glyph BBox；絕對不可把先前 `*_visual_estimate` 改名作為正式證據。圖像僅用於私人來源認證，**不附原卷影像或擷取圖片於公開網站**。

## 首批可入庫的 16 筆（普仁期末）

- 凍結清冊原有普仁期末 **16 個 BBox-only source positions**；各筆是原卷題幹及完整選項可獨立解答的 10 是非 + 6 單選，沒有與原本已發布清冊的完整題幹相同題。
- 直接渲染原始 PDF 像素，PyMuPDF `get_pixmap(Matrix(1.6,1.6),alpha=False)`；來源畫面 1166 × 1651 px，面向正確，頁碼皆 1 或 2。
- 對這 16 筆**逐題人工目視式模型檢查原始圖像疊框**，獨立重新框定作答標記。每筆同時保存 `answer_marker_bbox_upright_render_px`、映射至 PDF top-left 點的 `answer_marker_bbox_pts_top_left`、PDF SHA、完整原文、印刷選項、模型 Science 唯一答案、canonical KP 和每頁 raster RGB SHA256。
- 原校教師答案並未認證，科學答案為模型獨立重審；不得向學生宣稱原校教師答案。16 筆權利類別限於 `SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES`。
- 正式證據：`data/review/p12-e01-puren-final16-pixel-bbox-formal-science-kp-acceptance-v1.json`。
- 學生題庫：`site/data/question-bank/p12-e01-puren-final16-public-v1.json`，搭配 `p12-e01-puren-final16-release.mjs` immutable fail-closed 驗證與跨庫去重測試。
- 來源證據原卷 Pixel geometry 皆用模型視覺核對；**不得宣稱這些是 PDF 文字原生 glyph BBox**。

## 凍結分母與後續作業

| 項目 | 執行前 | 本 PR 成功發布後 |
|---|---:|---:|
| 本輪 originally held source positions | 115 | 99 |
| 掃描 BBox-only 尚未正式入庫 | 72 | 56 |
| 掃描+BBox 及其他語意／去重障礙 | 6 | 6 |
| 其他非掃描 HOLD | 37 | 37 |
| 累計學生公開作答位置 | 560 | 576 |
| 是非／單選／題組小題 | 267／158／135 | 277／164／135 |

其他 56 個 BBox-only 仍為 HOLD；包含和順期中 17、和順期末 21、普仁期中 18。這些來源畫面已取回核對 SHA，但尚未產生可公布的原卷標記位置，不准僅以舊估計盒放行。

### 下一階段
`NEXT_RESUME_TASK=P12_E01_REMAINING56_HESHUN_MID17_HESHUN_FINAL21_PUREN_MID18_PixelBBoxRecovery_ScienceKP_Dedup_SelectiveAdmission`

**放行硬條件**：PR Science Exam CI；原卷 source-ID／SHA／選項／像素框／KP；重複控制；合併後 main readback；Pages 部署及線上 E2E。未通過前不得宣稱這 16 題已在公開網站。
