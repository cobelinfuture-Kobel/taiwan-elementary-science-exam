# P12 B04 AUTO_BATCH50｜B06 首批 50 道來源題 Science/KP 審核

- 依 v25 frozen source ID 清冊固定處理 50 個來源位置：大華國小期中 3、桃子腳國小期中 14、獅湖國小期中 11、大華國小期末 10、桃子腳國小期末 12。
- 五份 Google Drive 原卷文字、原始來源 SHA、全部選項、原始 PDF 頁碼與答題 BBox 已讀回並比對。
- 第一輪若逐字比對桃子腳期末 Q03/Q05/Q06，發現 12 筆與 raw archive 不同：**僅原卷父指示包含 `(8 分)`／`(7 分)`／`(9 分)`**，題幹及作答語意完全相同。已正式記錄 `original_complete_stem_including_scoring_instruction` 與 `scoreless_original_stem_projection_verified`；只在學生不計分投影中省略配分，絕不擅改原卷。
- 正確的 model 審核統計：**47 題可進入正式 Science/KP 驗收；3 題獨立 HOLD**。HOLD：第 5 題珊瑚礁歷史建材利用與現行保護規範；第 6 題森林開發未必形成堰塞湖；第 50 題萬花筒所提 KP 偏向反光材料但主命題為多重鏡面反射，待確認 canonical KP。
- 本 PR **新增公開題數 0**。47 題都不表示已獲教師標準答案或正式 operator source admission；下一步需 Science 唯一正解、KP 直接對應、重複、圖文、權利、PR/CI、main、Pages E2E。
- 合格與有疑義題分流執行；疑義不得阻塞同批其餘來源。
- 截至 B06：409 個 frozen 待審位置，已執行 B01–B06 共 300 個位置；B07–B09 剩餘 109 個位置未初審。
