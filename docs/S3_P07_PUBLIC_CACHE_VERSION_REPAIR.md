# P07：修正公開 Exam 題庫版本快取失配

發現的公開網站失敗症狀：年級／學期可選，但單元與 KP 空白，底部報錯「歷屆題目題型／答案不完整」。

根因分析：現行 main 中內建資料已統一 O/X，與讀取器一致；但公開網站可因 HTML / JS / JSON 快取錯位而載入 **新 O/X JSON 搭配舊正確／錯誤 JS**。沒有直接取得問題當下的瀏覽器 network trace，所以將其列為 `LIKELY_MIXED_CACHE_VERSION`，不是已證明唯一根因。

修正：
1. Version-pinned immutable new paths `historical-bank-ox-v2.mjs` / `approved-historical-ox-v2.json`，adapter 和資料使用 `SCIENCE_S3_P06_OX_V2` 雙向綁定。
2. 即使題庫讀取出錯，先由 KP Authority 建立 16 單元與 187 KP 下拉選單；禁止組卷但不隱藏教材範圍。
3. 新版可視標記 `O/X V2`，同時 GitHub Pages 部署後額外由 **部署主機外部** 執行 Chromium 檢查，確認正式 URL 本身能載入內建題庫。
4. 答案仍維持 5 O / 2 X，7 道原題不變；不改 187 KP、圖文題組或雙欄排版。
