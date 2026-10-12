# P12 G04-S1 114 年｜25 份原卷逐檔讀取／範圍初篩

承接 `data/source-registry/p12-g04s1-108114-drive-discovery-v1.json`。本輪**僅對 114 年所有 25 份檔名候選原始 PDF 做 selectable-text readback**，先排查實際主題及圖表/文字是否可讀。非「全卷逐題科學答案完成」，也未公開新增任何題目。

## 讀回結果

| 114 考試別 | 來源 PDF | 文字可讀 | 文字未取得，需 binary/visual | 範圍 |
|---|---:|---:|---:|---|
| 四上期中 | 12 | 10 | 2 | 現行康軒 U01、U02 |
| 四上期末 | 13 | 11 | 2 | 現行康軒 U03、U04 |
| **合計** | **25** | **21** | **4** | **45 canonical KP** |

檔案確實存在 Google Drive，四份無法從連接器提取文字的原卷仍是非零大小的 PDF，**不可直接判定為空白卷或排除**：

- 114 南一四上期中和順國小，Drive ID `1UxbTZOQo6gMXexzs57V26ycUmcSwjcaO`（1,071,058 bytes）
- 114 康軒四上期中普仁國小，ID `10wbO1FxnIVWaP-jLyivsV6vzOxhkzUPG`（1,166,576 bytes）
- 114 南一四上期末和順國小，ID `1iZisyIpcQ0b_TzEue8YA2h_TRyc6GLJ9`（351,361 bytes）
- 114 康軒四上期末普仁國小，ID `1OuMQNYZJSnE8ZdVcYdrNE4aCLH7Bg0B0`（1,335,789 bytes）

讀回全表位於：
- `data/review/p12-g04s1-114mid-text-readback-preflight-v1.json`
- `data/review/p12-g04s1-114final-text-readback-preflight-v1.json`

每一份存來源 ID、文字字數、實際可讀狀態、單元主題提示及可能需要完整圖形的標記。**關鍵字只作診斷**，並未因此把某卷判成 FULL 或認證任何一個 source answer slot。

## 科學／範圍差異，已實際逐題抽核

`data/review/p12-g04s1-114-exact-text-science-screening-examples-v1.json` 記錄了 **9 個由原卷文字可查證的範例**：

- **114 南一，永安，期中**：月相和農曆的判斷雖科學上為真，但不符合本版期中；「改變光源影子位置」為四上期末 U03，應判為 `WRONG_PERIOD` 而不是硬塞入期中；「布袋蓮壓到水下再放開會浮起」可作 U02 漂浮植物適應候選。
- **114 翰林，桃子腳，期末**：第一大題的紫色高麗菜酸鹼反應，與本版四上期末 U03/U04 範圍不符，整組九個小題不得自動公開；但「聲音來自物體振動」符合 U03；另有水蒸氣凝結等跨單元內容需排除。
- **114 康軒，大墩，期末**：小馬達調換電池極性改變轉向及聲音透過固體傳播的題目有明確 KP；另有一題依賴「如下圖」的燈泡電路判讀，**必須讀取原圖而不是只看印在 PDF 文字中的標示答案**。

初判分布：`POTENTIAL_IN_SCOPE=4`、`OUT_OF_SCOPE=3`、`WRONG_PERIOD=1`、`HOLD_SOURCE_FIGURE_REQUIRED=1`。這些不是 9 份已完成考卷，而是 3 份原卷中的 9 個具體範例。

## 與原題庫既有成果的邊界

- G04-S1 現有公開 **53** 個作答位置、**22/45** KP 有公開覆蓋；未公開的候選不得進抽題池。
- 已做過部分 P11 來源清冊的 113 明義期中/期末原卷不可重複發行；其他 114 年需逐卷/逐題 source identity。
- 本輪沒做 114 全部題目的 exact answer-slot inventory、source PDF SHA-256、原教師標準答案真實性、圖形重建、A4 實際版面驗收；它們仍是下一 gate。

## 下一步：直接續跑 114 的 FullPaperScreening

`NEXT_RESUME_TASK = P12_G04S1_114_25Papers_FullPaperSourceAndItemScreening_Then_113To108`

先處理四份無文字 PDF 的 binary visual readback；其餘 21 份按來源題號逐題對照 U01–U04 canonical KP，明確標出可用題、不適用題、跨考期、印刷瑕疵、圖形依賴與重複題。**所有 108～114 均在七年度正式來源清冊內**，按 114→113→112→111→110→109→108 持續處理，直到完成整體原卷去重和可用題 closeout。除有科學疑義和公開入庫授權外，不把年別切換當成需要反覆確認的關卡。
