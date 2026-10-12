# P12 G03-S2-FINAL｜46 題公開入庫前最終驗收

## Operator 科學裁定（正式登記）

使用者明確核准 **配合（三）③：曲面小魚缸 O → X**，原圖必須維持窄口鼓肚的曲面容器。來源位置 `G03-S2-FINAL|COMPOSITE|P03|003`，canonical KP `sci_g03s2_04_06`。

- 原始 GPT 科學初審答案 **O** 不變、不刪除，仍可在來源 FinalSourceAcceptance V1 查到。
- 候選 learner-facing 題目與答案採已核准 **X**；六組 SVG 渲染器維持原卷曲面魚缸的形狀與等比例縮放。
- `data/review/p12-g03s2final-fishbowl-operator-science-adjudication-v1.json` 是唯一獲核准的差異憑據；**不是教師答案表，也不是整批題目的公開核准**。

## 精確 PrePublic 驗證契約

`node tools/verify-p12-g03s2final-46-prepublic.mjs`

此指令會自動 **fail-closed** 驗證：54 原來源位置中已有 8 道 P11 公開是非題不得重複；剩餘 46 個 `source_slot_id` 唯一、題目完整且答案／canonical KP 與來源審核 V1 一致，只有魚缸第③題可憑上述核准檔例外 O→X。

- 28 個候選區塊 = 20 單題 + 六組圖形（22 小題）+ 兩組閱讀（4 小題）。
- 所有圖形使用可再生 SVG（統一 `viewBox=0 0 460 236` 和 `xMidYMid meet`），不可擷取、裁剪或拉伸原卷圖片。
- 風向組維持 B／A／D／F；雲類 MC06 使用已自成一題的修訂版；閱讀保留完整 passage/choices/answers。
- 題目層級的教師原始答案**未認證**，不得宣稱來源出題者已簽認。
- A4 真實 Chromium：題目與答案 28／28 blocks、46／46 slots、雙欄無溢出、圖形寬高比例正確。
- 禁止將 staging JSON 接到公開 bank loader；公開題數仍為 **205**，P12 journal 維持 **274 events**，三下期末只有 46 staged、0 public。
- 本輪核准只有 source-science correction，沒有新增 `PUBLIC_ADMIT`。

## 驗收證據與結果

- PR #9 的 source+science prepublic test（截至本輪）：<https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/pull/9>
- Chromium A4 實際 28-block 重播：<https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/actions/runs/38266093847>。
- 原始魚缸造型的獨立人工圖形檢視 + 28 PDF/PNG：<https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam/actions/runs/38262035029>。
- 可機讀完整 acceptance：`data/review/p12-g03s2final-46-prepublic-acceptance-v1.json`。
- 來源驗收 V1、圖形契約、閱讀素材以及原有公開 205 題都保留。

**結論：PrePublic 科學／來源／A4 驗收完成，具備另行申請整批公開入庫核准的條件。**

下一個（尚未核准）工作單：
`P12_G03S2FINAL_46_PublicAdmission_OperatorAuthorization`

只有取得明確整批公開核准後，才能建立 release approval + 46 `PUBLIC_ADMIT`、增量載入網站（預期由 205 → 251）、再以 CI／Pages 線上 E2E 完成 closeout。
