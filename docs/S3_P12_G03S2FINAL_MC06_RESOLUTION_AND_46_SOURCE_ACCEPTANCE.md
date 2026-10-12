# P12｜G03-S2-FINAL MC06 閱讀來源收束與 46 題 FinalSourceAcceptance

## 來源與答案依據

原卷：113 學年度臺中市南屯區大墩國小三下自然第二次定期評量。原始兩頁 PDF Google Drive ID `1ZHd40JKh33dvKIJELGrYqbJU_Ksy9gzV`，SHA-256：`078806660f9673fd3e677c25afb348e0e3e9cc97fe866d94c91f1a370a33b793`。

原選擇第 6 題：考「科學閱讀雲的說明，哪項錯誤」，但原 PDF 未附指定閱讀全文。本輪追得國教署中央團自然科學領域「110 學年度自然領域：科學＋跨領域科學閱讀課程計畫」，其中第 19–20 內容頁（PDF 實際第 23–24 頁），收錄〈奇形怪狀的雲〉及圖形組織參考答案。文件明載參照康軒 111 年 2 月初版三下自然第四單元〈天氣變變變〉課本第 136–137 頁並改寫。

原始外部佐證：[國教署中央團科學閱讀文件（PDF）](https://padlet-uploads.storage.googleapis.com/1385116055/0c15bbb18a10b4e189f04c104243e2fb/__110_______________________30___1110302_.pdf)。

四個原卷選項與此文件描述逐項高度一致：①高積雲像魚鱗可見於晴朗穩定時，與原選項「表示快下雨」相牴觸；②雷雨後或不穩定可見下垂袋子狀乳狀積雲；③高山可能有飛碟般莢狀雲；④寒流來襲海邊可能有弧狀雲。因此依這份教學文本，**答案①**。

但**不能推定出題教師確實把同一份閱讀文件發給學生**，也未取得教師答案表。這份證據屬 `STRONG_TEXTUAL_MATCH_CITED_READING_NOT_PROVEN_EXAM_ATTACHED_ARTICLE`，不是 `TEACHER_KEY_AUTHENTICATED`。

## 改寫方式

保留原卷來源、原選項與答案推定紀錄；在 `data/review/p12-g03s2final-mc06-referenced-reading-resolution-v1.json` 另建自主可作答之候選：

- 題幹：下列關於雲的外形和出現情況，哪一項不正確？
- ①高積雲呈魚鱗狀，就一定表示馬上會下雨。
- ②天氣不穩或雷雨後可能有袋狀乳狀積雲。
- ③高山附近可能有飛碟般莢狀雲。
- ④寒流時海邊可能有弧狀雲。
- 答案：①。並非所有魚鱗狀高積雲皆預示立即降雨。
- 此修訂自成一題，**不再依賴沒有附上的指定閱讀文本**；未將第三方完整原閱讀文章搬進 Exam。

來源科學答案階段解除舊 `BLOCK`：附上 `START` + `CERTIFY_STAGED`，原 272 筆事件不覆寫；事件總數 274。無公開核准事件。

## 46 題 FinalSourceAcceptance 結論

原卷共 **54 個來源作答位置**；已在 P11 公開 8 道是非，避免重複處理。其餘 **46** 個位置，本輪答案／canonical KP／來源對位 **46/46 PASS**：

| 題型 | 來源位置 | SourceAcceptance | 下一階段 |
|---|---:|---|---|
| 是非 | 6 | PASS | learner-facing 檢核 |
| 單選 | 14（含 MC06） | PASS | 文字排版檢核 |
| 配合／圖形 | 22（6 組） | PASS | **原圖獨立重繪、維持比例與共用圖形完整性、A4 雙欄實測** |
| 閱讀 | 4（2 組） | PASS | **共用閱讀短文改寫及答案依賴實測** |
| **合計** | **46** | **46/46** | **28 個候選區塊待材料化／排版** |

風向的四小題在原始來源圖中分別解為 B 西風、A 東風、D 北風、F 弱風，屬**已核對的原圖判讀**。原圖及第三方圖像均不直接公開嵌入；圖片素材之正確重繪、比例縮放和印刷效果尚無 PASS，不可把本輪 SourceAcceptance 等同網站視覺驗收。另保留 MC1、MC7、MC8、MC13、MC14 五題的條件／語義修訂提醒，後續正式題目才能發布。

正式可重播的結果：`data/review/p12-g03s2final-46-final-source-acceptance-v1.json`，全部 46 `source_slot_id` 一對一連結原卷審核檔。保留既有歷史審核與解題備註，不改原卷原文，不冒充教師原始答案。

## 治理收束

- 來源庫 P12 原待審分母仍為 326：**57 已公開、46 已初審待公開、223 尚未開始、0 阻擋**。
- **公開 Exam 仍為 205 作答位置**（原 P11 148 + 三下期中 P12 57）。不得以 46 直接加到 205。
- 三下期末本批 46 個候選 source slots 已取得審核結果；master 預期本期末原卷 `pending_remaining=0`，下個未審來源轉到 `G04-S2-MID`。
- 尚待另行取得的門檻：**46 題正式文字及圖片材料化 → 28 區塊 A4 雙欄 PDF ActualVisualAcceptance → 操作人公開核准 → PR／CI／Pages／E2E**。

NEXT_RESUME_TASK = `P12_G03S2FINAL_46_LearnerQuestionAssetsAndFigureReconstruction_Then_A4DoubleColumnVisualAcceptance`。
