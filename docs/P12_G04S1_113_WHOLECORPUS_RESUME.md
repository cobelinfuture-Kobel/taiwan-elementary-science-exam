# 113 四上自然｜29 卷 WHOLE_CORPUS_BATCH 續跑

這是 Draft PR #124 的 **來源工作排程與斷點**，不是新入庫契約，不增加 Science/KP 複核輪次。48 KP、原始題目、權利判準、既有 Admission Gate 與已發布資料全部不變。

## 已驗證的範圍

- 29 份 PDF／72 頁已 SHA 核對；其中 5 份掃描型。
- 113 年來源已公開 114 個 source slot；主站現有 750 個作答位置，Pages E2E 成功。
- 三份來源細項清冊（421／199／155）合計 775 筆；與已發布精確對位 63 筆、明確疑義 3 筆、待續跑 709 筆。這些清冊覆蓋 14 份考卷，其餘 15 卷須再納入細項清冊。
- 709 筆之中，301 筆是獨立是非／單選編號位置；408 筆為其他或共用情境位置。這是初步來源位置分類，不是正式可入庫題數。
- 原有 1,755 個全卷位置仍是暫估量，不是 29 卷精確作答位置的結案分母。

## 可執行命令

在 repository root：

    node scripts/review/p12-g04s1-113-wholecorpus-resume.cjs --summary
    node scripts/review/p12-g04s1-113-wholecorpus-resume.cjs --batch=NATIVE_TFMC_B01
    node scripts/review/p12-g04s1-113-wholecorpus-resume.cjs --batch=OTHER_OR_DEPENDENT_B01
    node --test tests/p12-g04s1-113-wholecorpus-resume.test.mjs

由原始 29 卷 registry 排序，50 個來源位置為一組工作清冊，**不是收錄或發布門檻**：

- NATIVE_TFMC_B01～B07：301 筆（50×6＋1）。
- OTHER_OR_DEPENDENT_B01～B09：408 筆（50×8＋8）。
- 15 卷未涵蓋於這三份清冊的來源位置，維持 paper-level inventory gap，須依原卷與既有 stage/411/311 證據補回。新增來源資料與已發布 suppression 變動時，先顯式更新凍結快照及 fail-closed 計數，不能靜默重劃已處理資料。

## 沿用同一個正式 Gate

SOURCE_EXACT → PDF_PAGE_BBOX → SCIENCE_UNIQUE_ANSWER → CANONICAL_KP → DUPLICATE → RIGHTS → ADMISSION_GATE → PR / CI / A4 → main → live Pages E2E。

任何題目已驗證的 Gate 直接引用證據，只補欠缺環節。有疑義時記 HOLD／原因／最小補查，繼續處理其他題；未取得完整題文、選項或相依圖像，**不能憑來源 ID 產生正式答案**。跨年語意去重仍需執行，不因已排除 114 個 published ID 而免除。

## 禁止逐題發布迴圈

- 全卷工作證據保留在 Draft PR #124，不直接把來源分支合併進學生網站。
- 依已核准的 29 卷 corpus／合格題整合交付，連續累積合格題，不為 1～3 題重開新學生發布 PR。
- 完整收斂 29 卷來源與例外清冊後，符合既有 Admission Gate 與 operator 授權的合格題集中建立正式發布 PR；不能擅自省略原規則要求的最終清冊核准。
- 主要正式進度：FORMAL_SCIENCE_KP_APPROVED、ADMISSION_READY、PUBLISHED；本次建立排程並未新增上述任何核准題／公開題。
- 主站出現後續新增題時，更新 Draft PR #124 的 suppression 快照並驗證全量來源去重，再續跑。發現來源清冊與凍結統計不符時 fail-closed，不默默修改分母。

## 第一批斷點

從 NATIVE_TFMC_B01 的 50 個原生編號來源位置開始，對照完整原卷、既有 operator ZIP、真實 PDF BBox、科學唯一答案、直接 48 KP、跨 113／114 年語意去重和權利。已認證的項目繼承證據；有缺口的只記缺口。第一批完成後順序處理下一批，直到全卷集中入庫。
