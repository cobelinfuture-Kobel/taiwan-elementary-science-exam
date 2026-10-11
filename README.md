# 台灣國小自然科 Exam 考古題組卷系統

獨立 GitHub Pages 專案，參照 Math Generator 的 Exam 介面。

- 首頁：https://cobelinfuture-kobel.github.io/taiwan-elementary-science-exam/
- Exam：https://cobelinfuture-kobel.github.io/taiwan-elementary-science-exam/exam/
- Repo：https://github.com/cobelinfuture-Kobel/taiwan-elementary-science-exam

## S1 GitHub 最小可部署版本

- 三、四年級、上下學期、U01–U04 範圍切換。
- 單一單元、單一 KP、同單元多 KP、跨單元、期中／期末出題範圍。
- `DEMO_ONLY` 模擬題，包含共用閱讀題組與 SVG 示意圖。
- 題數不足時拒絕組卷；共用題組不可拆分；固定種子排序。
- A4 考券預覽、答案頁、列印／儲存 PDF。
- GitHub Actions 以 `npm test` 進行基本靜態檢查，另設 Pages workflow。

**S1 不包含任何正式自然科考古卷，也未接入正式 KP Authority。**
三年級單元名稱中標示「待正式 Authority」者不可視為教材證據。

## 執行與驗證

```bash
npm test
```

CI 通過與 Pages workflow success 是部署必要證據；瀏覽器互動、A4 列印實際頁數、溢出與答案一致性仍須做部署後 E2E 驗收。

## 與先前交付 ZIP 的關係

目前 GitHub 是較精簡的 S1 部署版，**尚未逐檔上傳先前本機 ZIP 的全部模組與 16 項測試**，不能宣稱其和本機 ZIP 完全相同。目前 GitHub 的 CI 只測試已提交的測試集合。

後續應先完成完整程式碼 parity 與真實瀏覽器回歸測試，再進入 S2 正式 KP Authority Adapter。


## S2：正式自然科 KP 選擇器

已接入 113 康軒三上、三下、四上、四下，共 **16 單元、187 KP**。年級／學期／單元／KP 由正式 V2 Authority 的公開 metadata 投影載入；原始教材敘述及來源證據不公開。

**這不代表已匯入真實考古題。** 目前所有示範題維持 DEMO_ONLY，正式題庫與 GPT-6 逐題認證屬於 S3。詳細資料與驗收界線請參閱 [S2 紀錄](docs/S2_187KP_AUTHORITY_INTEGRATION.md)。
