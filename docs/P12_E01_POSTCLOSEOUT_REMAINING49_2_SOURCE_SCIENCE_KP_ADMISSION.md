# P12 E01 POST-CLOSEOUT｜剩餘 49 筆逐題原卷／Science／KP 複審，2 題選擇性收錄

## 審核來源與保留邊界
- main 起點：`a5cb2ca4d8b7a9bba3fd655788eefd5893008f44`，學生正式題庫 **626 個作答位置**。
- 使用已發布 `data/review/p12-e01-postcloseout-remaining52-source-classification-v1.json`；剔除 PR #109 已核准的安和 3 個 source IDs，產生明確 **52−3＝49** 個來源位置。逐筆引用原始 frozen exception、source archive 原文與原卷 PDF SHA，保留各筆既有 exception flag、座標來源。
- 機器可讀 49 筆審核：`data/review/p12-e01-postcloseout-remaining49-science-kp-source-sweep-v1.json`，原始 source archives 完全不改。
- 先前 115 筆例外主清冊、前四批 E01 與已上線 626 題的來源均不修改。

## 49 筆來源分流
| 原始分流 | 本輪開始 | 此次可獨立證明及符合現有 canonical KP | 續留 |
|---|---:|---:|---:|
| 科學／KP 語意疑義（30 筆） | 30 | 2 | 28 |
| 掃描 BBox 已恢復，但答案／KP 尚未通過 | 9 | 0 | 9 |
| 掃描兼語意或重複等複合阻塞 | 6 | 0 | 6 |
| 完全重複的其他學校來源 | 3 | 0 | 3（lineage only） |
| 原題印刷選項標籤重複 | 1 | 0 | 1 |
| **合計** | **49** | **2** | **47** |

- 所有未通過者仍維持 HOLD，不會僅因 PDF 可讀、BBox 存在或模型可猜出答案便升格。
- 例如：東光國小四上期中 `S01|TF|004` 的水蘊草題同時談水位變化與水流衝擊，科學語意分類仍有討論，保留原有 source／science HOLD。
- 其餘特殊情形如聲音是否可在太空被聽見、漂浮根的定義、溪流睡蓮、無直接 KP 的芮氏規模題、舊卷③標成②，均不自行改寫原卷取得唯一答案。
- 完全重複的 3 個 source IDs 只留 lineage，不再增加學生作答題。

## 本輪 2 道完整原題

### ① 明義國小｜四上期中｜S01 TF 003
- 原卷全文：**「著名的地形景觀『風吹砂』，代表只有風會改變墾丁國家公園海邊沙丘的樣貌，雨水不會。」**
- 獨立科學答案：**X**。句子以「只有」「雨水不會」排除水作用，實際雨水造成地表逕流也能改變沙土分布；原有 KP `sci_g04s1_01_05` **「流水搬運地表物質」**可直接涵蓋水如何影響沙土，不必擴寫風力新 KP。
- 原始 PDF：`114_康軒_四上_自然_期中評量卷_明義國小.pdf`，SHA256 `65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6`，322600 bytes，2 頁。
- 原生 PDF text layer、頁 1 題號／答格 glyph box `[54.60,267.65,108.39,281.69]` pts；1.6px/pt raster 1348×1905，page RGB SHA `788ebae1f026028f3322494441a89947031a9c767c5429369ea88fe0e7cbef71`。

### ② 桃子腳國小｜四上期末｜Q06 001
- 原卷全文包含印刷計分父題：「下列關於『光的反射』敘述，正確畫○，不正確打〤。(9 分)」及子題 **「萬花筒能看到對稱圖案，是因為光的反射。」**
- 學生題面不保留成績標記 `(9 分)`；原卷印刷 parent prompt 不被刪改，完整保留在證據 JSON，採以前審核過的無分數投影。
- 獨立科學答案：**O**。萬花筒多個鏡面反射光線，顯示重複與對稱圖樣；正式 KP 採 `sci_g04s1_03_07` **「光的反射與方向改變」**，修正原先提案 `sci_g04s1_03_08` 的泛生活應用範圍；僅修正 release 對映，不改來源原卷或 frozen proposed KP。
- 原始 PDF：`114_翰林_四上_自然_期末評量卷_桃子腳國小.pdf`，SHA256 `1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987`，376368 bytes，2 頁。
- 頁 1 原生 glyph answer-mark box `[388.18,302.93,416.03,317.88]` pts；1.6px/pt RGB raster 1166×1651，page RGB SHA `b5d46ac4f0bd6c7713ac20f883b5c1f14f8885c3f50508ce192b860587c7e815`。

## 驗收與發布保護
- 不依賴原校教師答案鍵：目前僅能誠實標示 **模型獨立科學答案**，不可稱原校教師答案已取得。
- 不上傳／不公開原始考卷掃描圖片、PDF 或含個人資料的圖像；入庫只有原始題目純文字、必要選項與可追溯 bbox／SHA。
- 已對照現有 15 份公開 question-bank JSON 共 447 個獨立 blocks；本批兩份題幹 **0 exact-stem 重複**。
- `data/review/p12-e01-post49-mingyi-taozijiao-two-source-exact-science-kp-acceptance-v1.json`：來源全文、原生 bbox、頁影像 SHA、模型 science reasoning、原 KP、修正 KP、權利與未來入庫門檻。
- `site/data/question-bank/p12-e01-post49-source2-public-v1.json`：恰好 2 個 TF。
- `site/assets/js/p12-e01-post49-source2-release.mjs`：immutable expected map；如任何 source ID、原句、答案、KP、PDF SHA、BBox、著作權 metadata 被竄改，即拒絕整批載入。
- 完整測試 `tests/p12-e01-post49-source2-release.test.mjs`：舊 52→49 lineage、兩張實際原卷 native PDF box、student scoreless 字句、science+KP、測試防竄改及 public duplicate。
- 須 PR CI + A4 + main readback + GitHub Pages deploy/test/verify-deployed 全部成功，方可由 **626→628** 作答位置（307 是非＋186 單選＋36 組情境內 135 子題）。
- 成功後原始 49 例外剩 **47 個**，其中 28 科學／KP、9 掃描座標已恢復但科學／KP 待審、6 掃描兼複合阻塞、3 重複題、1 原卷印刷。
- 下一步僅續審 47，不對既有合格題二次產出：`P12_E01_POSTCLOSEOUT_Remaining47_NonUniqueAndScopeAuthority_OriginalPDF_ExceptionOnlySelectiveAdmission`。
