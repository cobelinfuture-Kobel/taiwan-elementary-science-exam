# P12 Remaining 51｜科學與語義最終複核

來源：113 學年度康軒版三下自然，安和國小期中考。原始 PDF SHA-256：`372db8a4016eec03e6910b4ea617c32c7e27f14d01c12a37447b2d8f5830eb71`。

## 檢查範圍與結論

原始 51 個 source slots：TF 10、MC 11、蔬菜分類 5、水態變化 21、水耕閱讀 4。逐題交叉比對原文、獨立科學判答、修訂版、答案、canonical KP、題組依賴。完整資料參見：
- `data/review/p12-g03s2mid-remaining51-final-acceptance-v1.json`
- `data/staging/p12-g03s2mid-remaining51-staged-v1.json`

**科學答案與編輯審核 51/51 通過。** 此處的「通過」不等於取得公開發布核准，亦不等於取代原校正式答案表。

## 六個局部修訂

| 原卷位置 | 處理 |
|---|---|
| TF-005 | 密封塑膠袋增加「長時間」條件，維持 X |
| MC-003 | 鬆動澆水量歧義，改成適量澆水，維持① |
| COMPOSITE-P02-013 | 浮冰縮小補充變暖與吸熱，維持融化① |
| COMPOSITE-P02-020 | 冷凍庫白霧明確限定遇冷後形成液態細水滴，維持凝結③ |
| READ-001 | 水耕從「植物種在水面上」調整為根接觸水中養分，維持 O |
| READ-002 | 水耕營養液改為一般栽培使用，維持 O |

均保留原卷來源位置及原文備查，不改既有公開 6 題。

## 十個重複概念 watch

唯一高重合 pair：TF-008、MC-008 兩題同考海苔／餅乾受潮，答題形式不同，兩題保留來源與答案，但**建議避免同一張練習卷同時抽到兩者**。網站尚無此 51 題的公開 selection routing，待入庫時應新增同卷重複控制。

其他八個：冰飲與冰棒變軟（2）、晾衣、吹風機、魚缸水位、濕雨傘（4）、溫泉與火鍋白霧（2），均屬相同知識點的不同生活情境；可作為情境遷移，不能只因同 KP 就宣告重複或刪除。

## A4 最終排版驗收（PASS）

公開網站維持 154 題；候選的 51 個位置**僅經 localhost QA 介面測試**，沒有加入公開抽題池。\
詳見 `tools/verify-p12-remaining51-layout.mjs` 與專用 workflow `.github/workflows/p12-remaining51-layout.yml`。

已完成的實際 Chromium 驗收：

- 共 **27/27 個版面區塊、51/51 個作答位置 PASS**，含 **6 組共用情境 30 小題、10 道是非及 11 道單選**。
- 逐區塊確認每個作答位置／答案頁正確、共用選項齊全、所有小題保持同一 A4 欄位、兩欄寬度與高度無溢出。
- 已輸出 **27 份 PDF 與 27 張瀏覽器截圖**。
- 同一輪 Node `npm test` **82/82 PASS**。
- 實際證據：GitHub Actions [完整 51 題 Chromium 測試](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/actions/runs/38243750980)，artifact `science-p12-remaining51-localhost-layout`。

本輪最終驗收結果正式保存於 `data/review/p12-g03s2mid-remaining51-final-acceptance-v1.json`。此處完成的是**來源、答案、科學語義、KP、共用情境及排版**驗收；尚未取得對剩餘 51 題的公開發布核准，不得以此次 PASS 逕行增加網站題數。

## 退場與後續

公開作答位置保持 154，P12 待處理位置 326 的 status 仍是 6 公開、51 staged、269 尚未開始。科學驗收通過後，須待實際 A4 布局 PASS、操作人公開核准、跨題同卷去重選題規則及 GitHub Pages post-deploy E2E，才能增加公開題數。
