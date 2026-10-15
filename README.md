# 台灣國小自然科 Exam 考古題組卷系統

## 全域內容題庫規範（2026-10-15 起）

自然科題庫採 **題目數量與內容正確性** 管理，不採分數、每題配分、總分、加權或計分門檻。所有年級、學期、考卷模式、學生組卷、答案解析及 Science/KP 覆核均使用同一規則。

- [全域內容規範](data/governance/science-global-no-scoring-authority-v1.json) 與 [正式運作入口](data/governance/science-active-content-only-routing-v1.json)。
- 114 四上 25 卷首輪來源改使用 [v25 內容清冊](data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json) 與 [v2 待審清單](data/review/p12-standalone-all25-source-content-only-queue-v2.json)。717 個來源題的 active projection 均位於 `data/content-only/`。
- 作圖題仍可藉由正確電路參考圖人工核對，但沒有數字評分規則。
- 原始 PDF、歷史 frozen Source Maps 和既有審核快照**不修改**，僅作原始證據保存；其印刷配分不得流入新資料、學生網站或阻塞未來題目收錄。


獨立 GitHub Pages 專案，參照 Math Generator 的 Exam 介面。

- 首頁：https://cobelinfuture-kobel.github.io/taiwan-elementary-science-exam/
- Exam：https://cobelinfuture-kobel.github.io/taiwan-elementary-science-exam/exam/
- Repo：https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam

## S1 GitHub 最小可部署版本

- 三、四年級、上下學期、U01–U04 範圍切換。
- 單一單元、單一 KP、同單元多 KP、跨單元、期中／期末出題範圍。
- `DEMO_ONLY` 模擬題，包含共用閱讀題組與 SVG 示意圖。
- 題數不足時拒絕組卷；共用題組不可拆分；固定種子排序。
- A4 考券預覽、答案頁、列印／儲存 PDF。
- GitHub Actions 以 `npm test` 進行基本靜態檢查，另設 Pages workflow。

**S1 不包含任何正式自然科考古卷，也未接入正式 KP Authority。**
三年級單元名稱中標示「待正式 Authority」者不可視為教材證據。

## 執行與驗證

```bash
npm test
```

CI 通過與 Pages workflow success 是部署必要證據；瀏覽器互動、A4 列印實際頁數、溢出與答案一致性仍須做部署後 E2E 驗收。

## 與先前交付 ZIP 的關係

目前 GitHub 是較精簡的 S1 部署版，**尚未逐檔上傳先前本機 ZIP 的全部模組與 16 項測試**，不能宣稱其和本機 ZIP 完全相同。目前 GitHub 的 CI 只測試已提交的測試集合。

後續應先完成完整程式碼 parity 與真實瀏覽器回歸測試，再進入 S2 正式 KP Authority Adapter。


## S2：正式自然科 KP 選擇器

已接入 113 康軒三上、三下、四上、四下，共 **16 單元、187 KP**。年級／學期／單元／KP 由正式 V2 Authority 的公開 metadata 投影載入；原始教材敘述及來源證據不公開。

**這不代表已匯入真實考古題。** 目前所有示範題維持 DEMO_ONLY，正式題庫與 GPT-6 逐題認證屬於 S3。詳細資料與驗收界線請參閱 [S2 紀錄](docs/S2_187KP_AUTHORITY_INTEGRATION.md)。


## S3-P05：公開網站直接內建考古題

不需額外匯入 JSON 或切換題庫。第一批 7 題學校考古題（採科學判答及原 KP 追溯）已內建，後續經認證的題目同樣直接加入。見 [P05 範圍](docs/S3_P05_PUBLIC_EMBEDDED_BANK.md)。


## S3-P08 累積 40 道原卷是非題

保留第一批 7 題操作人核准的科學答案，另外 33 題逐題建立 GPT-6 科學判答理由及 KP 關聯，採 O/X 格式直接內建網站。四份考卷的來源與頁碼保留；無教師原答案表，請勿將模型覆核稱為原校答案。現有 187 KP 未改動。


## P08 來源情境題組

在原先 40 題 O/X 外，另有 9 組完成可作答性、科學答案與 KP 重新驗證的原卷情境，採自撰情境文字和表格呈現，不直接發佈原卷裁切圖；合計 **86 個可作答小題**。原始 20 題組中其餘 11 組仍需圖形或材料權利處理。


## S3-P09：20 組情境整合閉環

在 P08 既有 9 組之外，補齊 11 組來源情境：新作 7 組 SVG 圖形或作圖區、三組獨立改寫閱讀、1 組原圖選項文字化。20 組總計 76 個情境作答欄位；與 40 題 O/X 合計 **116 題**，全部在同一公開網站組卷，不需本機 JSON 匯入。使用者可在 [P09 驗證清冊](site/review/p09/) 確認各題組身分與重建型態。作圖題只提供人工閱卷五分規準。


## S3-P10：三下、四下首批來源

依原有 187 KP Authority，完成 113 學年度三下／四下期中、期末共四份來源 PDF 的完整 SHA-256 與首頁視覺核對，從每卷擷取並獨立科學審核 8 題 O/X，共 32 題。與原有 40 題 O/X、20 組 76 小題情境合併，累計 **148 個作答欄位**。其餘選擇、閱讀與圖片題尚待下一批逐題認證，並非全部 4 份考卷完成。教師答案表未驗證，保留非原校答案之標記。


## P11｜逐題可追溯與 187 KP 覆蓋報表

新增 SHA-256 問題指紋、8 份 PDF 的暫列全卷 477 作答位置清冊與 187 KP 覆蓋分析。**未新增題目**：仍為 72 道 O/X 及 20 組 76 小題，合計 148 作答欄位；71/187 KP 有主要知識點直接題目。來源不是非題完整逐小題對位仍待人工覆核，不得將暫列 477 宣稱已認證。參見 [P11 查核頁](site/review/p11/)。


## S3-P11R1｜Exact Source Slot Reconciliation

20 組改編情境、共 76 個公開子題，已核對至 **79 個原卷作答位置**（四上光反射的 4 個原始勾選框合成 1 個改編複選題）；72 題原卷 O/X 仍維持精確來源身分。原卷暫列 477 作答位置，目前 326 個位置待後續逐題認證。三下期中水形態題是「20 個印刷編號／22 個作答空格」，而非確定的計分錯誤。新設 [R1 對位報表](site/review/p11r1/)。恢復 P12 候選篩選，但**未核准的原卷題仍禁止直接入庫公開**。


## S3-P12 SourceAuthorityPreflight

依 P11R1 的 477 原卷位置對位產生 **326 個待審原卷位置**的完整續跑佇列，三、四年級下學期優先。首個批次為 `G03-S2-MID` 原卷完整候選篩選。尚未新增題目、未解除答案與 KP 逐題認證，148 公開小題不變。


## P12 考卷總表與斷點續跑

[公開總表](site/review/master/) 顯示 8 份已登記考卷、477 原卷位置、151 已連結位置與 326 個待審位置。採 PDF SHA-256、逐題 source_slot_id 與 append-only GitHub 事件作為可持久化續跑依據，並提供 CSV／JSON、學期考別篩選、下一位置。來源蒐集範圍尚未遍及全雲端資料，未登記考卷數量未知；本功能不新增任何公開題。
