# P12 E01 和順四上期末｜21 原始掃描答案位置，19 科學/KP 入庫、2 題保留

## 原卷與正向幾何來源
- `114_南一_四上_自然_期末評量卷_和順國小.pdf`，來自已連接 Google Drive `1iZisyIpcQ0b_TzEue8YA2h_TRyc6GLJ9`。
- 原始 PDF SHA256：`b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e`，351361 bytes，2 個掃描頁。
- PDF /Rotate=90。以 PyMuPDF `get_pixmap(Matrix(1.6,1.6),alpha=False)` 渲染取得 1651×1166 RGB，再用 Pillow `rotate(90,expand=True)` 校正為 1166×1651 upright raster。
- 正向頁 RGB SHA256：P1 `7a6677faafa73e58110a89462af361a89ad9710d08845acfc3fe9822aaf9935a`，P2 `bfe6e03f8c9aa1ca1ed7e31010cd72631e06c4128927772d168484924775777d`。
- 模型逐題檢視原始 21 個作答記號框，記錄 source ID、頁面、像素矩形及正向 PDF top-left points（每點 1.6px）。嚴禁把歷史視覺估計框當成原生 PDF glyph BBox；此原卷無文字層。

## 正式 Science/KP 分流
- 原卷凍結 `21/21` 完成像素級原圖位置復核，學生題幹、四選一印刷選項、答案（模型獨立推理而非原校答案鍵）及 canonical KP 逐項驗證。
- `19` 題允許進入 fail-closed 正式發布：`12` 是非題、`7` 四選一，僅文字原題，不含原校圖片或 PDF 裁切。延續 B04 狀態限制；具圖依賴之題組不在這條入庫路線。
- **2 題保留 `SCIENCE_KP_EXCEPTION_HOLD`，即使像素 BBox 已恢復也不直接上架**：
  - `SCI_G04_S1_114_FINAL_002|S2|MC|003`：「哪些不會運用到太陽的光與熱？」答案 ② 可以獨立推理，但 `sci_g04s1_03_04`「看見物體需要光進入眼睛」並非直接測驗此題的太陽光熱與電池能源比較能力。
  - `SCI_G04_S1_114_FINAL_002|S2|MC|013`：「下列哪個使用電池的方式是錯誤的？」答案 ② 不混用新舊電池合理，但 `sci_g04s1_04_11` 是「廢電池回收」，並非直接測驗電池混用安全；需 operator 另行審定 canonical KP，不得自行改動 Authority。
- 來源圖像與學生答案的真實性範圍需區分：**原校教師答案鍵未認證**。已核對模型科學推理、原卷內容與題型，但不稱原校答案。
- `S2|MC|002` 根據原題「窗簾無法形成清楚反射影像」將舊錯置 KP `sci_g04s1_03_06` 校正為 `sci_g04s1_03_07`「光的反射與方向改變」，不改原題文字、選項或原始 review frozen 版本。
- 全文 exact-stem 比對既有公開題庫，並保留權利與無圖依賴檢查。實際原始 PDF/完整掃描圖不進入公開 student-bank。
- `data/review/p12-e01-heshun-final21-raster-pixelbbox-science-kp-admission-v1.json` 是前置 20 題候選的歷史檢視，不可當作 release authority；**正式入庫依 `v2`** `data/review/p12-e01-heshun-final21-raster-pixelbbox-science-kp-admission-v2.json` 的 19/2 分流。
- `site/data/question-bank/p12-e01-heshun-final21-public-v1.json` 僅含合格 19 題；`site/assets/js/p12-e01-heshun-final19-release.mjs` 凍結來源 ID、全文、選項、答案、KP、PDF hash 與像素 BBox，嚴格排除兩個 HOLD source IDs。

## 發布條件與查核點
- 發布必須通過 PR head CI（含 focused 21-proof tests）、列印 A4 gate、主幹 main readback、GitHub Pages deploy 與 verify-deployed。
- 發布前學生公開站維持 **604** 個作答位置（291 TF、178 MC、135 context subanswers in 36 groups）。
- 全部成功後為 **623** 個作答位置（303 TF、185 MC、135 context subanswers／36 groups）。原 71 例外在本批 19 題成功後剩 **52**，其中 2 題延續本卷 Science/KP HOLD，不得視為已解決。
- 截止確認前的回報不得把 `19` 題候選稱為「已公開」，也不得把 CI 綠燈代替實際 Pages 使用者畫面驗證。
