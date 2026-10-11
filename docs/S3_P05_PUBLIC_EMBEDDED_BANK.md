# P05｜公開網站單一內建考古題庫

- 所有經來源、科學答案、KP 和圖文完整性認證的學校歷屆考古題，直接加入 `site/data/question-bank/approved-historical-v1.json`，公開 Pages 自動載入，不要求使用者下載、上傳、切換私人／正式題庫。
- 第一批 7 題來自 S3-P04 使用者核准的 V1 JSON：5 個 TRUE、2 個 FALSE；2 題使用最近 KP（但不是精確命中），保持來源及判答前提。
- 目前其餘 33 題答案未獲核准，不可假稱已內建。學校試題文本依合格定期評量第 9 條規則處理，第三方文章、圖片和非試題著作仍須分別核對。
- 考古題組卷即時依 `certificationGate` 驗證每題，並由 187 KP Authority 限制單元及範圍。不足題數必須 fail-closed，不借用 DEMO_ONLY。
- 示範題僅允許在 localhost / 127.0.0.1 搭配 `?qa=1` 進行 Chromium 版面回歸驗收，不會在公共 Pages 上曝光為抽題選項。
- 正式網站網址：`https://cobelinfuture-kobel.github.io/taiwan-elementary-science-exam/exam/`
- A4 雙欄、單一題組原子性、科學答案依據和條件說明保持不變。
