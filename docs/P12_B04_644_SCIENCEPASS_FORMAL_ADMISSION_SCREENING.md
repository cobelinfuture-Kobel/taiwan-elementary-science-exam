# P12 B04｜644 題 Science PASS 正式入庫篩選

## 原始來源盤點（讀回 25 份 active content-only 檔案）
- 25 卷／717 道完整獨立題目來源；644 個 `MODEL_SCIENCE_PASS`、73 個 Science HOLD。
- 其中 12 卷／284 題：Science PASS 259、Science PASS 且 `KP_STRONG_CANDIDATE` 205。
- 其餘 13 卷／433 題：Science PASS 385、Science PASS 且 `KP_STRONG_CANDIDATE` 220。
- 因此 644 道 Science PASS 中，**425 道符合第一層「Science PASS + KP strong」的優先來源查證條件**；其餘 **219 道 Science PASS** 尚需 KP 或來源條件處理。以上 425 仍非正式 KP 認證。
- 這 25 個 content-only 投影的 717 題**均沒有答案欄位**；來源投影不能取代經覆核的正確選項、解析、PDF 區域、圖文依賴與人工核准。
- 本輪以此證據不能直接放行任一題；本批新增正式准入與公開題目仍是 **0**，不是主張 644 題都有錯。

## 下一批作業優先序
1. 以 `node scripts/review/p12-b04-screen-644.cjs /tmp/p12-b04-screening.json` 生成 **逐題 source_id** 的 priority/hold ledger。腳本讀取 repo 內 frozen v25 指向的 25 份檔案，不依照題號猜測。
2. 優先處理 `PRIORITY_EXACT_REVIEW`：逐題原文、完整選項、PDF 頁碼及 BBox、共用刺激／圖片依賴、科學唯一答案與解析、正式 45 KP authority、原題權利範圍。
3. 另路保存 Science HOLD 73 題、Science PASS 但未符合優先條件的題目；彼此可重疊 KP 審核，不能混同。
4. 只有完成逐題人工作業核准後，才以正式答案及 KP 契約送出 learner bank PR、跑 focused tests／CI、merge／main readback／Pages E2E；不由模型的 `PASS` 自動放行。
5. 既有 251 個網站作答位置（其中四上 53）不在這次 717 題新增准入計數內。原卷歷史紀錄保持唯讀，全域不採任何配分或得分門檻。

## Release gate
`SOURCE_EXACT && OPTIONS_COMPLETE && PDF_GEOMETRY_AND_DEPENDENCIES_VERIFIED && SCIENCE_UNIQUE_ANSWER_WITH_EXPLANATION && CANONICAL_KP_VERIFIED && RIGHTS && OPERATOR_APPROVAL`

**本次 PR 限制**：僅新增唯讀篩選腳本和本報告，不修改題庫、來源或正式審核狀態；禁止將優先候選解讀為已正式入庫。
