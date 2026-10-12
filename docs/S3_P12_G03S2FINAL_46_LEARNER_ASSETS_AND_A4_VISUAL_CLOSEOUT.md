# P12 G03-S2-FINAL｜46 Learner Assets + Actual A4 Acceptance Closeout

## 本輪成果

- **來源**：113 學年度三下期末大墩國小自然原卷，PDF SHA-256 `078806660f9673fd3e677c25afb348e0e3e9cc97fe866d94c91f1a370a33b793`。
- 既有 P11 已發布 8 道是非不重複匯入。
- 本輪 46 個原卷來源位置全部建立 learner-facing 改寫候選：**20 單題（6 TF + 14 MC）＋6 圖形配合組（22 小題）＋2 共用閱讀組（4 小題）＝28 blocks / 46 slots**。
- 所有 candidate `source_slot_id`、科學擬答與 canonical KP 均與前輪 FinalSourceAcceptance 一對一對應。
- MC06 依可追溯的雲類教材比對重寫成獨立選擇題；保留原教師答案與指定閱讀資料未認證的註記。

## 來源圖形與科學判答的差異（公開前必須裁定）

在實際對照原卷第二頁配合題（三）時，發現 **③「小魚缸」畫成窄口、鼓肚、側面彎曲的魚缸**。過去 46 題來源初審將它判為適合做雨量器（O），當時本專案的候選 SVG 也不正確地改畫成「直壁小魚缸」。原卷形狀和先前的模型推定並不吻合。

本輪已作**待核准的候選科學修訂**：

- 原初審科學答案 O **原樣保留**在 `data/review/p12-g03s2final-fullpaper-candidate-screening-v1.json` 及 `data/review/p12-g03s2final-46-final-source-acceptance-v1.json`；
- 修訂候選圖③重新畫成源圖的曲面小魚缸；候選題答案提出 **X**，理由是容器的截面積隨高度變化，不宜直接以水深刻度量測雨量；
- 修訂提案詳見 `data/review/p12-g03s2final-composite-p03-q03-science-correction-v1.json`，明確 `operator_adjudication_required`；
- 經修訂後 Chromium **28/28 區塊、46/46 位置 A4 排版技術驗收仍為 PASS**，重新產出 28 PDF＋28 PNG，證據在 [CI run 38262035029](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/actions/runs/38262035029)。

因此本輪 FinalVisualAcceptance 的最精確狀態為 **A4 技術驗收 PASS、科學修訂 1 題待操作人裁定**，不可宣稱 46 題已全部取得公開許可。

## 後續操作人科學裁定：已核准 X（尚未公開）

使用者於 2026-10-12 明確核准 `G03-S2-FINAL|COMPOSITE|P03|003` 的候選科學答案由 **O 改為 X**，並要求維持原卷曲面小魚缸圖。正式裁定紀錄：`data/review/p12-g03s2final-fishbowl-operator-science-adjudication-v1.json`。

本次核准**只限這一題的科學判答與候選素材**；不代表取得原教師答案表，也不是 46 題的公開入庫核准。原先 O 判答保留在 V1 來源審核檔，候選答案和獨立 SVG 維持 X 與曲面魚缸。A4 專用測試已於 run 38262035029 驗收，入庫前實際讀回另由 `tools/verify-p12-g03s2final-46-prepublic.mjs` 執行。

目前需要通過的是 **46/46 source identity、答案及 canonical KP、來源修正例外、8 組共用情境、原始 8 題去重、A4 證據與未公開 205 題基線**；正式 PublicAdmission 為下一個獨立操作。

## 六組自製 SVG 圖形

1. ①鴿子、②麻雀、③野鴨、④青蛙：飛行能力 O/X。
2. ①鳥、②象龜、③魚：樹上／陸地／水中配對。
3. ①方形直筒、②曲線杯、③曲面小魚缸、④圓筒：雨量器適用性。
4. ①往東伸展風向袋、②箭頭指東風向標、③北向南氣流、④微微下垂風向袋：答案 **B、A、D、F**。尤其②左側寬片是尾翼、右端尖部指東；**不得把寬片當箭頭**。
5. ①搭船遠遊、②到瑞士旅行、③曬棉被：氣象預報種類。
6. ①北極熊、②黃帶箭毒蛙、③雨傘節、④樹蛙：警戒色。

所有圖形為本專案的可再生 SVG 線描示意圖，不挪用原 PDF 點陣圖片或第三方圖片。統一 `viewBox=0 0 460 236`、`preserveAspectRatio=xMidYMid meet`、`width:100%;max-width:100%;height:auto;max-height:none`。此處 `max-height:none` 是必要的；它覆蓋舊版共用樣式強加的 38mm 最大高度，避免縮小時寬高比例改變。

## 兩組閱讀

- 赤腹松鼠：樹上活動、兼食植物與動物；答案 ③、①。
- 西北雨：暖濕空氣快速上升、夏季午後雷雨；保留來源引用的春季 12.4% 與夏季 41.4%，明確註明**僅為原卷引用資料，不代表每年固定比例**；答案 ②、④。
- 兩組均只採自撰短文、各兩道選擇題；不拆開文章與題目。

## 實際 A4 雙欄與答案頁驗收

GitHub Actions [P12 G03 S2 Final 46 A4 Learner Review — science correction rerun](https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/actions/runs/38262035029)：

- Node tests：**104 PASS、0 FAIL**（圖形修訂後）。
- Chromium: **28/28 個候選區塊 PASS**，來源作答位置 **46/46 PASS**。
- 每一區塊保留原來源題組，核對答案與代號，精確檢查螢幕及印刷模式的 A4 兩欄溢出。
- 每組 SVG 完整顯示，實測圖片寬高比誤差小於 3.5%，寬度不超過欄位。
- CI 產物 `science-p12-g03s2final-46-a4-proof`：**28 PDF、28 PNG**。實際解壓檢查共 56 個檔案；每份 PDF **2 頁**（題目 + 答案），總計 56 PDF pages。
- 亦實際查看六組圖形和兩組閱讀的截圖；未觀察到圖案被裁切或擠出欄位。

本輪首跑曾出現舊版 `max-height:38mm` 導致比例不一致。修正專用 SVG 後，第二輪已 **PASS**，且未放寬原有測試的比例容差。

正式報告：`data/review/p12-g03s2final-46-a4-visual-acceptance-v1.json`。

## 治理邊界

**本輪結案只針對 staged learner materials 和 A4 版面技術驗收；魚缸第③題已在後續單獨獲得科學裁定，但尚未取得全批 PublicAdmission。**

- 原 P11 148 + P12 三下期中 57 = **公開仍為 205 作答位置**。
- G03-S2-FINAL **46 個 source slots 仍處於 CERTIFIED_STAGED_NOT_PUBLIC**，沒有 `PUBLIC_ADMIT`。
- 其餘 P12 未逐題審核 **223**；無新阻擋。
- 原卷來源記錄、教師答案「未認證」、之前的檔案及 205 個公開題目全數保留。
- 魚缸第③題 O→X 已獲科學裁定。待獨立預入庫驗收通過並取得全批公開核准後，下一階段才做 `P12_G03S2FINAL_46_PublicAdmission_SourceIdentityAndLivePagesE2E`：精確 46 源位置核准清冊 → 題庫增量載入 → 來源/KP/答案 fail-closed → CI → Pages live readback。公開後理論總數 **251**，不在本輪直接調整。

## 主要產物

- `data/staging/p12-g03s2final-46-learner-blocks-v1.json`
- `data/review/p12-g03s2final-figure-reconstruction-v1.json`
- `data/review/p12-g03s2final-reading-groups-v1.json`
- `site/assets/js/p12-g03final-figure-reconstruction.mjs`
- `tools/verify-p12-g03s2final-46-layout.mjs`
- `data/review/p12-g03s2final-46-a4-visual-acceptance-v1.json`
