# P12｜自然科考古卷來源總表與斷點續跑

已建立「已登記考卷總表」，位於 `site/review/master/`。它由 P11、P11R1 原卷對位資料、P12 待審清單及獨立 GitHub 覆核事件日誌自動生成。

## 來源分母與檢查層級
- 共 **8 份已登記 PDF**，對應 477 個暫列原卷作答位置。
- 72 個原卷 O/X 位置及 79 個改編來源位置已連結到現有公開內容。
- 326 個位置尚需個別確認；不是 326 道可獨立入庫的題目。
- 全部 8 份皆是「來源已登記及分段清冊已建立，但全卷未逐題完成」。
- 其他學校／出版社未登記考卷的總數 **UNKNOWN**，不可報成「0 份」。出版社為可選 metadata，入庫依 187 Canonical KP 和題目證據判定。

## 永久身份
- 每張考卷以來源 PDF SHA-256 為主要去重身份。
- source_id (`G03-S2-MID`) 是舊系統批次代號，**不具跨學校唯一性**；新發現考卷不得只以這個代號取代現有來源。
- stable paper_uid 使用 `SCI-113-<source_id>-<sha12>`，完整 SHA 仍存於 JSON。
- 每個待審原卷位置使用 `source_slot_id` 精確續跑。

## 斷點紀錄規則
1. 讀 `p12-master-progress.json` 中的 `resume_checkpoint`，核對來源 SHA 及原卷位置。
2. 逐一核對原始題幹、答案、KP、圖文依賴。
3. 每次狀態轉移寫入 `site/data/governance/p12-review-events.json` 的 append-only events，**提交 GitHub commit 後才視為保存**。
4. 更新事件可使用 `START`, `BLOCK`, `CERTIFY_STAGED`, `REJECT`, `REOPEN`。後四者必須符合證據與合法狀態轉移要求。
5. GitHub CI 執行 `npm run p12:master:build` 與 `npm run p12:master:check`，頁面自動重新產生全卷狀態與下一個斷點。
6. `CERTIFY_STAGED` 僅完成候選認證，不會自行新增題目或解鎖未審題目公開。

## 故障恢復
如果中斷，先核對 GitHub main 最新 commit SHA、Events 最後 event_id 及原卷 SHA。若某項覆核尚未提交 commit，視為尚未完成，不根據聊天訊息推定已保存。已決議來源位置絕不重複評估，除非新增有理由的 `REOPEN` 事件。使用本頁「複製續跑指令」續接下一個位置即可。

下載：`site/data/governance/p12-master-progress.csv` (UTF-8 BOM) 或 JSON。

本變更為**純治理與監看**，不新增考卷、不修改題目、答案、KP 或舊版學習者呈現。
