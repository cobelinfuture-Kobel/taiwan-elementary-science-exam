# 113 四上自然｜來源 1,762 後的正式 Admission 主線：18 題既有 Gate 與跨年去重（證據追加）

> 專案既有 README／QUESTION_ADMISSION_GOVERNANCE 為最高準則。本文件只接續已有 Source Exact、PDF 原生 BBox、Science/KP 舊記錄；**不是另設 Science 二審／三審**，不撤銷既有操作人核准，也不修改已發布 333 個來源學生題。

## 本輪來源與數據

- 正式 main SHA：`d7f909327771dc309dd324bcc81d1165de454003`。
- 29／29 原卷 **來源工作位置** 1,762／1,762 已有可追溯位置，**不等於**正式獨立原題數量。
- 原卷逐題 Admission 仍 **0／29 全卷 CLOSED**。
- 在 main 原始來源閱讀證據 `data/review/p12-g04s1-113-missing15-native88-original-text-sci-g04-s1-113-mid-005-v1.json` 與 PR124 既有 `data/review/p12-g04s1-113-p04b-existingformal-yonganfinal-6-source-science-kp-dedup-rights-candidates-v1.json` 的基礎上，本輪處理**大墩 MID005 12 個、永安 FINAL005 6 個**未發布獨立 TF/MC 來源位置。
- 對比**114 全 25 卷 717 題原始來源**、**113 正式公開 26 JSON／320 個頂層 question blocks**、**114 正式公開 9 JSON／309 個頂層 question blocks**；部分 113 原生共用題組含數個子題，頂層 blocks 不等於 333 個來源子題；333 的正式 source-linked 公開位置完全不變。
- 本輪已確認**5 個**跨學年度或跨校原題與正式學生題庫全文完全相同，或題幹相同且四選項僅調序，改分流到 `ALIAS`；僅在本 Draft PR 所屬來源清冊分類，不新增學生題庫，不直接改動主線公開 lineage。

## 五個確定的學生題庫同題／來源別名

| 本輪來源位置 | 相同公開學生題 ID | 正式來源 | 去重證據 |
|---|---|---|---|
| MID005 S01 TF007 | `P12_B04_G04S1_B01_TF_039` | 114 大墩 MID004 TF005 | 題幹完全相同 |
| MID005 S02 MC007 | `P12_B04_G04S1_B01_MC_046` | 114 大墩 MID004 MC006 | 題幹及全部四個選項相同 |
| MID005 S02 MC010 | `P12_113_G04S1_B03_NATIVE27_026` | 113 明義 MID010 MC006 | 題幹及全部四個選項相同 |
| FINAL005 S01 TF008 | `P12_B04_G04S1_B04_TF_049` | 114 FINAL007 TF012 | 題幹完全相同 |
| FINAL005 S02 MC007 | `P12_B04_G04S1_B05_MC_007` | 114 FINAL007 MC006 | 題幹相同，四個選項僅重排 |

## 必須保留的實質不同問法／答案

- **MID005 S01 TF001**：大墩 113 原卷五種水域包含「潮間帶」，五種中四種自然形成，原題陳述「三種」為 **X（模型獨立科學判斷）**。113 年永安 MID008 的已公開 `P12_113_G04S1_B02_NATIVE21_018`，五種中改為「水田」，天然形成為三種，已核准公開答案 **O**。本輪不得因句型相近而合併，更不能繼承 O 作為大墩原題答案。
- **MID005 S01 TF013**：與 114 年東光 MID008 原始來源文本完全相同；該 `data/content-only/` 來源紀錄之 `student_site_admitted=false`，已查 114 正式學生題庫，**目前沒有相同公開題**。記錄原卷完全重複來源證據，但不冒稱「已發布別名」；原句對岩石風化、土壤形成的科學前提仍待 Source/Science 直接處置。
- **MID005 S01 TF002**：114 民權 MID005 原卷有「蟹／螃蟹」、「能／可以」不同用語；本輪不以單一 KP 或相似科學結論直接合併，仍須依 2026-10-19 實質問法／語義之正式去重規則判斷。

## Frozen 48KP、科學與權利的確切界線

- 兩份原卷真實 PDF SHA／原生 BBox 已具備。對應的 Source全文、完整選項或共用父題必須沿用已有原卷證據，**不得把 BBox 完成直接升格為 SOURCE_EXACT Gate 全過**。
- 大墩 MC001 的「溼潤泥土會讓西瓜更甜」、MC009 礫石沙和土壤搬運遠近等題存在科學語境／唯一答案前提疑義，分別保留 HOLD；震央、各地地震規模、荷花地下莖、地震烈度級別等題，若 Frozen48KP 無直接知識點，不得強制塞入最相近標題。
- 永安 TF007、MC009、MC010 既有歷史清冊記載 3 個 Science／KP 初審候選，不等於正式通過。尤其 TF007 舊證據曾提 `sci_g04s1_04_12`、較近 source-only 快照提 `sci_g04s1_04_05`，KP 提議不一致；需依原題與 Frozen48KP 本義處理，**不能任選一個直接變成正式 KP**。節約用電／市電用品也不得自動等同 U04_12「市電與用電安全」。
- 學校依法舉行考試題目文字依既有 Article 9 路徑繼續審；原卷 PDF、教師原答案、來源第三方圖片、共用材料及未經核准改編仍不得公開。
- **精確操作人 Eligible 清冊本輪 0**；沒有整批完整 Source＋Science＋KP＋113／114 所有原卷語意去重＋Rights＋操作人 Admission 的不重複新題，故不可產生偽造的 learner PR 或宣稱 Pages E2E。

## 本輪互斥來源工作位置更新

| 分類 | v6 | 新增已證明同題別名 | v7 |
|---|---:|---:|---:|
| PUBLISHED | 333 | 0 | 333 |
| HOLD | 269 | 0 | 269 |
| ALIAS | 10 | +5 | 15 |
| UNREVIEWED | 1,150 | -5 | 1,145 |
| **互斥來源工作位置總數** | **1,762** | **0** | **1,762** |

**上表是 source-WORK 去重對帳，並非正式獨立題總數。** 本輪 `FORMAL_SCIENCE_KP_APPROVED_new=0`、`ADMISSION_READY_new=0`、`PUBLISHED_new=0`。其他 29 卷尚待完成的原卷全文/父題與全卷去重不能因本 18 位檢視就算成結案。

## 後續固定接續（直接縮短正式 Admission 距離）

`P12_G04S1_113_ALL29_POST_SOURCE1762_POST18_5ExactPublicAliases_Then_113OtherOriginal24Native5Scan_FullStemOptionsParent_ExistingScienceUnique_DirectFrozen48KP_113114ExactSemanticDedup_Rights_ExactOperatorEligibleOnly_SelectiveStudentPR_CI_Main_PagesE2E_No333Reopen`

- 先從現成原卷文字、每卷 Source Exact 與原始圖表權利清冊挑出完全獨立、非已公開、明確同 KP 卻不同問法的題；接續既有 Gate，例外獨立 HOLD。
- 只有符合全部適用 Gate 與 exact Operator Approval 的題，才進學生題庫選擇性 PR；其餘不可假裝因 CI PASS 就 Admission Ready。
- 不能自行把 PR183 Source/Audit Draft 視為正式全 29 卷 Admission closeout 或學生題庫發布合併。

## 本輪憑證

- `data/review/p12-g04s1-113-all29-mid005-final005-18-existing-gate-dedup-source-review-v1.json`
- `data/review/p12-g04s1-113-all29-known-atomic-disjoint-source-ledger-v7.json`
- `tests/p12-g04s1-113-all29-post-source1762-dedup18-5-public-alias-v7.test.mjs`
