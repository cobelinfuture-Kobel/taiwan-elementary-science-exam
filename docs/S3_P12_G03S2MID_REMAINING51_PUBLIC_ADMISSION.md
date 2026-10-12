# P12 G03-S2-MID Remaining51 PublicAdmission

## 原始來源與不變量
- 113 學年度三下康軒自然安和國小期中考原卷 SHA-256 `372db8a4016eec03e6910b4ea617c32c7e27f14d01c12a37447b2d8f5830eb71`。
- P11 公開基線：148 個作答位置；P12 前六題：6；本次逐題核准：51。
- **公開累積數：148 + 6 + 51 = 205 個作答位置。**
- P12 原先待認證位置 326：目前 57 已公開，269 尚未逐題處理；待公開 0，阻擋 0。
- 原卷初審記錄與最終驗收 V1 保留原貌，既有 P11 與六題不覆寫。

## 已核准資料
- `site/data/governance/p12-g03s2mid-remaining51-operator-public-approval-v1.json`：本輪明確核准 51 個精確 `source_slot_id`、答案、canonical KP、對應發布區塊。
- `site/data/question-bank/p12-g03s2mid-remaining51-public-v1.json`：21 道單題（10 是非、11 選擇）與 6 組情境（30 小題），共 27 區塊、51 作答位置。
- `site/assets/js/p12-remaining51-release.mjs`：fail-closed 比對源 PDF SHA、核准清冊、答案、KP、權利聲明與題組依賴；缺一不可。
- `site/data/governance/p12-review-events.json`：維持原 129 筆事件且只追加 51 個 `PUBLIC_ADMIT`，total 180；網站進度由事件讀取。
- `data/review/p12-g03s2mid-remaining51-final-acceptance-v1.json`：保存先前全量 27 區塊／51 作答位置的 A4 雙欄、正反答案及 PDF 實際檢測 PASS。
- `data/staging/p12-g03s2mid-remaining51-staged-v1.json`：維持作為原候選不變版本，不再當最新網站資料。

## 同卷重複控制
TF 第 8 題及 MC 第 8 題均考查海苔受潮。兩題皆進入題庫，但以 `same_worksheet_exclusion_group=SEAWEED_MOISTURE` 標記；`chooseExactBlocks` 在作答位置數精確選題時維持互斥，測試不得同卷並列。

其他 8 道相似 KP 不誤刪，保留融化、蒸發、凝結的不同生活情境供遷移練習。

## 發布門檻
1. 對 P11+P12 原檔案 checksum、51 認證及跨源 source slot identity 做測試。
2. Chromium A4 雙欄驗證 205 累積內容；既有 27 區塊 PDF 驗收保留為前置證據。
3. PR CI 與網站部署後 Playwright live readback PASS 才 closeout。
4. 不增補其餘 269 個尚未逐題審核的考卷位置。
