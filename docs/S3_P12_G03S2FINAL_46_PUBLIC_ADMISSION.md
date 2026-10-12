# P12 G03-S2-FINAL｜46 PublicAdmission 實作與部署驗收

## 明確授權與來源封存

2026-10-12 使用者直接核准 `P12_G03S2FINAL_46_PublicAdmission`，將先前已驗收的 28 個候選區塊／46 個來源作答位置增量加入公開 `Exam`。

- P11 148 公開作答位置完全保留。
- P12 三下期中已核准 57 個來源位置保留。
- 三下期末原始 54 個來源作答位置中，8 道 P11 已公開是非不重複新增；本批只增量接入 46 個。
- 公開題庫計數：**148 + 57 + 46 = 251**。
- 來源 PDF SHA-256：`078806660f9673fd3e677c25afb348e0e3e9cc97fe866d94c91f1a370a33b793`。
- 原卷教師答案表**未認證**；原學校題目、GPT 科學初審、修訂候選與公開內容分別保存。

## 28 Blocks 詳細範圍

- 是非 6：三下 U03/U04。
- 選擇 14：含 MC06 原卷未附雲類閱讀而改寫之自成一題的學習版。
- 六組圖形題 22：原圖由本專案 SVG 獨立重繪，`viewBox="0 0 460 236"`、等比例雙欄縮放、無掃描裁切、共用題組不拆。
- 兩組閱讀題 4：赤腹松鼠、西北雨，附完整自編短文、選項、答案。
- **特例**：配合（三）③ 小魚缸之原模型獨立判答 O 保留於 `data/review/p12-g03s2final-46-final-source-acceptance-v1.json`；使用者核准曲面窄口魚缸 **X** 作 learner-facing 答案，來源為 `data/review/p12-g03s2final-fishbowl-operator-science-adjudication-v1.json`。正式發布不冒充原卷教師判答。

## 新增正式核准與入庫路由

- `site/data/governance/p12-g03s2final-46-operator-public-approval-v1.json`：46 source slot ID × 答案 × canonical KP × block ID × 魚缸單一科學修訂憑據。
- `site/data/question-bank/p12-g03s2final-46-public-v1.json`：正式公開題庫資料，28 區塊／46 作答位置。
- `site/assets/js/p12-g03s2final-46-release.mjs`：逐位置嚴格比對、KP、題組、共用圖形、閱讀、教師答案未認證標記、魚缸 X、保留已公開 8 道 P11 來源去重。
- `site/assets/js/historical-bank-ox-v6.mjs`：只增加此 46 題經逐題核准的 release；原 P11／P12 題庫路由及同卷海苔受潮的互斥策略不改。
- `site/data/governance/p12-review-events.json`：原 274 筆保留，追加 46 `PUBLIC_ADMIT` → 320 筆。
- `tools/p12-master-progress.mjs`：source ledger 對帳 103 個 P12 公開來源位置，公開總數 251；剩餘未審 223；本批 certified-staged 清空。

## 正式驗收

- 題庫累積載入 Node 自動化；重複來源、無認證答案、KP 漂移、圖形錯誤等必須 fail-closed。
- 新 46 題版面與原有 51 題 A4 Chromium 回歸並行，禁止為上線改壞原有 PDF／雙欄排版。
- Pages E2E 實際存取 46 release JSON／operator approval；產生三下 U04 雨量器題組並確認圖像為曲面小魚缸、SVG 等比例與答案頁第 3 小題為 X。
- 舊公開 205 題皆保留（最新公開 251，包含其原本集合），既有其他三／四年級單元仍可正常組卷。
- 由 GitHub Actions 實際記錄 PR Gate、merge、Pages Deploy、post-deployment Live E2E，再完成 D0 Closeout。

## 最終凍結

只發佈本批已驗收 46 題；下一個待審 paper 仍是 `G04-S2-MID`，P12 其餘 223 個尚未完成來源逐題審核的位置，不得自動進入公開抽題池。
