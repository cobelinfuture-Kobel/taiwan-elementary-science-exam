# P12 E01 POST CLOSEOUT｜52 例外重新分類 + 安和四上期末 3 題來源／KP 修復

## 凍結分母與本輪起點
- 先前 B04 初審有 115 筆 `EXCEPTION_HOLD`，正式不可修改清冊：`data/review/p12-b04-auto-batch50-final-closeout-115-exceptions-v1.json`。
- E01 來源原圖／答案／KP 四個批次逐題入庫，共 **63** 個唯一 source positions：普仁期末 16、普仁期中 13、和順期中 15、和順期末 19。
- 以完整 `source_slot_id` 集合差集核對 **115－63＝52**，並保留每筆原始 batch、flags、original PDF SHA、source archive、review 證據與正式未入庫狀態。分類清冊：`data/review/p12-e01-postcloseout-remaining52-source-classification-v1.json`。

| 本輪來源例外分類 | 開始筆數 | 處置 |
|---|---:|---|
| 科學／KP 語意與範圍疑義 | 33 | 只復核能靠原卷＋現有 KP title 唯一支持者；3 筆安和題列優先 |
| 已恢復掃描 BBox、但 Science／KP 仍待審 | 9 | 保留既有 E01 新證據，不當作仍缺 BBox |
| 掃描 PDF + 複合阻塞 | 6 | BBox 和重複／語意皆需各自過關 |
| 與已公開題庫完全重複 | 3 | 僅保留 source lineage，不上架第二份 |
| 原卷印刷選項標籤重複 | 1 | 不能私自將重複的②改成③ |
| **總計** | **52** | |

## 選擇性修復／第一批 3 題
- 來源：`114_康軒_四上_自然_期末評量卷_安和國小.pdf`，Google Drive source ID `1dRJk3FJ_Ua_FFl8tla30iMbMzgcQfbGz`。
- 檔案實際下載且 raw SHA256 核對：`5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2`，原卷兩頁，第 1 頁 text layer 可取得原生作答記號 `(    )`／`（  ）`，source archive 的原生 BBox 與原 PDF 擷取一致。
- 第 1 頁以 PyMuPDF 1.6 倍渲染，RGB SHA256：`437a99121f2a33ecc378e1f2caeb88dd369f2cbc3ec8362cd10ccdff0562a15e`；逐字視覺比對原卷與封存文字／選項。
- **既有 canonical KP**：`sci_g04s1_03_09` = **「聲與光的警示和指示用途」**，完整包含聲音警示與光的安全提示；以此矯正舊例外把該 KP 誤認為「只有警示光」的疑義，並未建立新 KP，亦不改原題。
- `SCI_G04_S1_114_FINAL_007|S01|TF|002`：「一氧化碳偵測警報器是一種具有警示功能的物品。」→ **O**；警報器以聲音或燈光警示。
- `SCI_G04_S1_114_FINAL_007|S01|TF|014`：「地震時，手機會用警報聲來提醒民眾注意，這是利用聲音來警示危險。」→ **O**；手機聲響提示危險。
- `SCI_G04_S1_114_FINAL_007|S02|MC|002`：「腳踏車加裝什麼物品可以增加騎乘的安全性?」→ **④ 以上皆是。**；原選項完整保留：①反光板、②車鈴、③車燈、④以上皆是。
- 三題原文全文未與既有已發布的 standalone bank stem 重複，來源文字本身無共用圖形依賴，不包含學校原圖裁切或個人資料。
- 僅是模型獨立判定科學唯一答案；**未取得原校教師答案鍵**，不可稱教師答案已驗證。

## 禁止「修復」的捷徑
- 另 49 筆並未自動升格正式通過：30 科學／KP、9 掃描 BBox 已恢復但 KP／答案未通過、6 掃描兼複合阻塞、3 重複 lineage、1 原卷印刷選項。
- 對含糊語境、缺少精確 KP、無唯一答案、選項異常、與公開題庫完全重複的原題，一律 HOLD；不得改原題字句或重新解釋為選擇題簡化題而取代原卷。
- 不改既有 294+63 公開題目、不覆寫 115 snapshot、不修改原校 source archive、不改 canonical Authority、不要在公開 site 放掃描原圖。

## 驗收 Gate
- 首批 3 個 public blocks：`site/data/question-bank/p12-e01-post52-anhe-final3-public-v1.json`。
- Source-exact QA：`data/review/p12-e01-post52-anhe-final3-directkp-nativepdf-acceptance-v1.json`。
- 網站 fail-closed runtime：`site/assets/js/p12-e01-post52-anhe3-release.mjs`；凍結原卷 ID、stem、選項、答案、KP、PDF SHA、作答框、權利。
- PR branch CI + A4 PDF acceptance + main readback + Pages deploy + verify-deployed **全部 PASS** 才能標記入庫完成。
- 成功後：**623 → 626** 個公開作答位置（**305 TF + 186 MC + 36 組情境／135 answer slots**），剩餘 52 → **49** 個 source exceptions。
- 續跑 `NEXT_RESUME_TASK=P12_E01_POST_CLOSEOUT_Remaining49_SemanticAndKP_OperatorEvidenceSweep_Then_SourcePDFSelectiveAdmission_PR_CI_Pages`，exception-only stop。
