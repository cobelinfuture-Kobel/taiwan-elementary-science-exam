# P12 B04 AUTO_BATCH50｜一次核准、九批來源位置續跑

## 凍結基線
- 114 四上 25 校卷合計 717 道已轉錄獨立原題；其中 Science model PASS 644，HOLD 73。
- `Science PASS + KP_STRONG_CANDIDATE` 初審名單是 425 個來源位置。
- 已核對 16 個位置：永安 9 個正式發布、崇德 6 個正式發布與 1 個同題但選項重排的去重位置。
- **待審 409 個原題來源位置**，非 409 題保證可發布；其餘 219 個 Science PASS 非優先候選、73 Science HOLD 另路保存。

## 分批契約
以 v25 清冊列出的 25 份檔案順序及檔內原卷題目記錄順序為唯一序列，以逐題 `source_id` 去重並排除上述已審核 16 個原卷位置。產出：

| 批次 | 來源位置數 |
|---|---:|
| B01–B08 | 每批 50 |
| B09 | 9 |
| 總計 | 409 |

執行：
- `node scripts/review/p12-b04-auto-batch50.cjs --out-dir=artifacts/p12-b04-auto-batch50`：產出 manifest 與 9 個 JSON review shards。
- `node scripts/review/p12-b04-auto-batch50.cjs --batch=1 --out-dir=artifacts/p12-b04-resume`：只重新輸出指定 batch；不改來源順序。
- `node --test tests/p12-b04-auto-batch50.test.mjs`：查驗 25/717/644/425/16/409、50×8+9、所有來源位置 ID 唯一及無自動發布。
- GitHub Actions `p12-b04-auto-batch50.yml` 在 PR 或 main 對應輸入變更時自動建立並上傳九批的可續跑審核清冊，人工不需要逐批回答「續跑」。

## 題目驗收與放行
每個來源位置都帶有原卷題幹、全部選項、PDF 頁碼、原卷 BBox 可用性、圖文依賴、原卷文字精確對照、初步 KP title、疑似重複來源及待補證據。合格來源資料 ≠ 科學答案已核准；**模型初審 PASS 與 KP_STRONG_CANDIDATE 不得直接轉正式核准**。

每題須經實際原卷文字及選項、Science 唯一答案與解析、KP 語意認證、來源圖文／印刷異常、權利、操作人總授權條件全部滿足才能以獨立 PR 發布；每批可放行的題目不必等待同批疑義題解決。疑義題保留本批的 exception flags，跨校同題只保留來源，不重複納入學生抽題池。

**安全設計**：這個 GitHub Actions 流程執行來源對照與機械 QA，不會向模型 API 發送題目、不會自動生成不存在的唯一答案，不會將缺少科學與 KP 獨立證據的題目推到學生網站。另需逐題實際科學審核與 PR／CI／Pages E2E 才會入庫；這些不可因「一次總授權」而省略。

## Release checkpoints
- 每批：`SOURCE_EXACT → PDF_PAGE_BBOX → SCIENCE_UNIQUE_ANSWER → KP → DUPLICATE → RIGHTS → ADMISSION_GATE`
- 每個發布 PR：focused regression／CI → main readback → live Pages E6。
- 發布後須使已審核來源位置計數增加，且重新產生 manifest 時全部被排除、不得重複加入。
- 如 source 版本或已發布清冊變動，使 425/16/409 不再相符，應 **FAIL-CLOSED**；更新基線前不得默默重劃已審的來源位置。

目前已完成批次規劃與機械品質核對器；九批 Science/KP 個別正式核准與發布狀態不因清冊建立而宣稱完成。
