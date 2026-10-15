# P12 B04｜425 Science/KP strong 原題逐題驗收進度

## Frozen 母體
- 四上 25 卷：717 獨立文字題來源；644 model Science PASS，73 Science HOLD。
- 644 中有 425 同時具初步 `KP_STRONG_CANDIDATE`；其餘 219 仍另路待審。
- 425 是**來源題出現次數**，不是去重後可公開題數，也不是經正式 Science／KP 核准的題數。

## 逐題 QA
- PR #77（已合併）：永安國小 114 四上期中 9 題（TF4／MC5），原卷來源文字、選項、作答 BBox、科學判答與 canonical KP 完整驗收；網站增量 9。基線 251 → 260。
- 本 PR（待 CI／合併）：崇德國小 114 四上期中 7 題 source-review；其中六題獨立可用（TF3／MC3），一題與永安「荷花地下莖孔洞」**題幹完全相同、選項重排**，保留來源，公開題庫不重複收錄。擬增量 6。合併後預計 260 → 266。
- 完成精確來源 QA 的 425 候選：16 個來源位置；其中 15 個發布題目、不重複來源位置 1。
- **尚未逐題正式驗收：409 個優先來源位置**。
- 其他 Science PASS 219 與 Science HOLD 73，不得視為已核准或已公開。
- 所有網站資料均無原卷配分；教師標準答案未認證。科學判答由獨立理由與限定條件支持。

## 機械式續跑
在 main 用 `node scripts/review/p12-b04-screen-644.cjs /tmp/p12-b04-screening.json` 建立來源位置 screening ledger。
依 source_id 排除已發布或重複來源，下一批只處理未審單題：來源 PDF、完整題幹與選項、作答位置 BBox、Science 單一正解、KP 定義、圖文依賴、權利與操作人授權。
每次獨立發布 1 個小批次，使用 fail-closed validator、CI、main readback、Pages A4/E2E；絕不為題數而放行未驗收題。
