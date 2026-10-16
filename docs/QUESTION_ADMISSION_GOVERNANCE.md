# 自然科題庫正式驗收與入庫執行準則

> **操作人核准寫入：2026-10-16。**
>
> 本文件是既有 Frozen Authority／Admission Gate 的**執行摘要與防偏移約束**，不是取代既有合約的新准入標準；不回溯修改已發布題目、歷史審核結論、來源原卷或 frozen queue。
>
> 所有年級、學期及考別依各自已核准的 scope-specific Frozen Contract、KP Authority 與發布授權執行。如本摘要與具體專案 Frozen Contract 發生衝突，應停止受影響動作並提出差異供操作人確認，**不得自行覆寫任何一方**。

## A. 權威與不可擅改事項

1. 保留原有 [全域內容／不計分規範](../data/governance/science-global-no-scoring-authority-v1.json) 與 [正式運作入口](../data/governance/science-active-content-only-routing-v1.json)；印刷配分僅作原始證據，不以得分／配分設學生題庫收錄門檻。
2. 沿用已驗證的 [P12 B04 AUTO_BATCH50 Frozen Contract](P12_B04_AUTO_BATCH50_EXECUTION_CONTRACT.md) 和各年級、學期的 canonical KP Authority；不改已凍結的來源、題幹、選項、source slot、BBox、science decision 或已發布題目。
3. 執行者（含 AI／Codex）**不得擅自新增必經複核輪次**，例如 `SECOND_PASS`、`THIRD_PASS`、`FINAL_RECHECK`；不得擅自刪除既有 Admission Gate。若特定題有疑義，僅補查缺失的證據。歷史檔案中出現上述名稱，只視為既有證據／工作紀錄，不因此形成新的強制階段。
4. 任何必經流程、正式指標、權威 KP、來源範圍、原題使用權利或核准門檻的變更，都須**先提出原條文、擬修改條文與影響範圍，獲得操作人明確核准後**才可修改。不得以「效率優化」、「下一階段」或新命名自行修改規則。

## B. 既有 Admission Gate（同一正式驗收，不是七輪審核）

```text
SOURCE_EXACT
→ PDF_PAGE_BBOX
→ SCIENCE_UNIQUE_ANSWER
→ CANONICAL_KP
→ DUPLICATE
→ RIGHTS
→ ADMISSION_GATE
→ PR / focused CI
→ main readback
→ live Pages E2E
```

逐題最低條件：

| Gate | 必要證據／處置 |
| --- | --- |
| SOURCE_EXACT | 原始 PDF SHA-256、原卷全文、完整選項、題號、父題指示及共用情境依賴的可追溯性；學生顯示若移除原卷配分，需保存原文並驗證無分數投影。 |
| PDF_PAGE_BBOX | 原始 PDF 頁碼與實際作答格座標或已驗證 raster pixel geometry；不把目測估算當原生文字 BBox。 |
| SCIENCE_UNIQUE_ANSWER | 依原題、選項及合理前提獨立推導唯一答案與說明；不能把模型建議答案寫成已取得原校教師標準答案。 |
| CANONICAL_KP | 直接對應當前適用的 Frozen KP 與單元／考別範圍，不以「最接近的主題」冒充直接映射；不為了收題擅改 KP。 |
| DUPLICATE | 比對已公開題庫與相關跨校、跨年度原卷，包含選項重排與實質語意相同題；只新增一個學生抽題項，保留所有來源 lineage。 |
| RIGHTS | 依既有 [S3-P03 原卷／著作權核查](S3_P03_ANSWER_KP_AND_TAIWAN_ART9_RIGHTS.md) 判定；符合要件的依法舉行考試試題文字可走既有 Article 9 路徑；不等於可直接公開整份 PDF、第三方圖片或教師解答。 |
| ADMISSION_GATE | 完成前述全部驗收及**該批／該 scope 既有**操作人核准要求後，始列 `ADMISSION_READY`。未有必要授權時不得自行發布。 |

CI 通過不等於科學答案通過；PR 合併也不等於 Pages live E2E 驗收通過。只在證據完全具備時依既有正式發布契約宣告 `PUBLISHED`。

## C. 批次作業與例外

- 沿用之前 114 四上已正式入庫的作法：**固定來源批次／可追溯初審 → 各題一次完成既有正式 Admission Gate → 合格題選擇性入庫與發布**。初審、正式驗收、PR／CI 是不同工作性質，**不是無限疊加的 Science／KP 審核輪次**。
- 一份來源題可能已具備部分條件：繼承已驗證證據，**只補欠缺 Gate**，不得無故重做已經驗收的項目。
- 有唯一答案、KP、來源／圖形、去重、權利等疑義者，逐題 `HOLD` 或 `REJECT`，記錄原因、責任證據及最小補救；**不阻塞同批其他合格題**。
- 明確重複題只保留來源 lineage，不能重複增加學生抽題池；課本範圍外與欠缺直接 KP 的題不因科學上有解而收錄。
- 批次啟動前沿用既有總授權，不因進度報告、每完成 50 題或每次 PR／CI 成功就要求重複授權；**涉及規則／範圍變更，或原合約要求的最終清冊核准時，仍須操作人核准**。
- AI 聊天回覆結束不代表可持續背景執行。進度應寫入 GitHub durable ledger／checkpoint；不得把「可續跑」誤稱為「已自動持續執行」。

## D. 正式進度必須優先回報三個指標

| 指標 | 定義 | 不得混用 |
| --- | --- | --- |
| `FORMAL_SCIENCE_KP_APPROVED` | 已有正式獨立科學唯一答案與直接 canonical KP 完整證據、經適用正式驗收規格接受的**不重複原題數**。 | 不等於 `MODEL_SCIENCE_PASS`、初審／二審模型判斷、`KP_STRONG_CANDIDATE`。 |
| `ADMISSION_READY` | 同時通過 Source、BBox、Science、KP、Duplicate、Rights 與適用 Operator Gate，尚待正式發布的不重複題數。 | 不等於只有科學／KP 通過的候選。 |
| `PUBLISHED` | 已正式合併、main readback 與 Pages live E2E 驗證的新增學生作答位置數。 | 不等於已建立 PR、CI success 或本機檔案。 |

所有數字都需標明**批次／學年度／年級學期、截至 commit、計數單位和來源去重基準**。尚無逐題可核實的正式證據時，數值必須是 0／待核實，不能以抽樣推估「已核准」。

來源 PDF 數、原卷頁數、題目區塊數、作答位置、模型初判、BBox 完成數與 `HOLD` 均可作**輔助診斷**，不得取代上述三個主指標。

## E. 既有歷史流程的驗證範例（不是新的門檻）

- [B01 正式入庫 PR #82](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/pull/82)：50 來源位置，47 正式入庫、3 留 `HOLD`。
- [B06 正式入庫 PR #99](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/pull/99)：50 來源位置，47 正式入庫、3 留 `HOLD`。
- [B07 初審 PR #100](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/pull/100) → [正式入庫 PR #102](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/pull/102)：50 來源位置中 31 正式入庫、19 掃描與 KP 等疑義留 `HOLD`。
- [B01–B09 歷史 closeout](P12_B04_AUTO_BATCH50_FINAL_CLOSEOUT_AND_115_EXCEPTION_ROUTING.md)：B01–B07 294 題已入庫，其餘 exception 分流。

## F. 當前 113 四上自然執行要求

- 沿用已核准的康軒四上 **48 KP Authority** 和同一 Source／Science／KP／Dedup／Rights Admission Gate；不將 114 年另一份 45 KP projection 偷換成 113 年 authority。
- 已產生的來源、原題與模型審核資料留存，但不得自動升格為正式核准；對先前 43 題 Science/KP 模型第二輪資料，**補齊缺的正式 Gate**，不增列第三輪、第四輪模型審核。
- 本階段以正式科學／KP 驗收、`ADMISSION_READY`、已發布數為主，不把來源位置增加視作正式入庫成功。
- 繼續按已核准的 corpus batch 自動跳過例外、集中保存問題和來源，不因單一題或單一原卷疑義停住其他合格題。

**變更控制**：本文件僅釐清既有規則及進度顯示優先順序；若將來要調整任何 Frozen 規格，須另提變更申請並取得明確 operator 核准。
