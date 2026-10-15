# P12 B04｜AUTO_BATCH50 B07 原始來源 Science/KP 初審

- 沿用 v25 frozen 409 筆來源位置佇列，B07 50 筆依序來自桃子腳期末 15 題、獅湖期末 16 題、和順期中 18 題、和順期末 1 題。
- 桃子腳／獅湖 PDF 具文字層，可對照原卷；**和順兩卷為掃描 PDF，無可用文字層**，既有原卷 archive 來自視覺轉錄，和順期中 BBox 明確標記 `VISUAL_ESTIMATES_ONLY_REQUIRE_MANUAL_PIXEL_EXACT_ACCEPTANCE`。和順來源**不得**因具 archived stem 就直接宣稱 PDF 像素座標驗收成功。
- 本輪對 50 題均記錄模型獨立科學建議答案與原因，學生網站未新增。來源、配分父題指示與學生不計分版本分開保存。
- **可直接進正式 Science/KP/權利/去重驗收：31 題**；其餘 **19 個來源位置**因掃描 PDF 缺正式 answer BBox，先隔離 HOLD，不影響 31 題。第 42 題另有睡蓮（浮葉性）誤對應漂浮性植物 KP 的語意問題。
- 原卷原始配分父指示有 15 個來源位置可做不計分顯示投影；原文保存在 immutable source archive 與 B07 review 的 `full_original_stem_including_parent_instructions`，不把配分傳到 learner bank。
- 和順掃描件後續必須基於實際 PDF 圖像頁完成人工或可驗證像素精準的 BBox 覆核，才可由 HOLD 進入正式准入，不能用推測座標放行。

本 PR **不是學生題庫發布 PR**；31 題後續正式入庫另跑 unique Science／canonical KP／跨卷 duplicate／rights／PR CI／Pages E2E。

截至本批：B01–B07 已初審 350/409 個來源位置，B08–B09 仍有 59 個位置未初審。
