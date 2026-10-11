# S2 自然科 187 KP Selector 接入與來源驗收

## 已核准的 Authority

來源 ZIP：`elementary_science_kp_authority_g03_g04_v2_schema_aligned.zip`（操作人核准）。

| Semester | Source file | KP | Original JSON SHA-256 |
|---|---|---:|---|
| G03-S1 | `science_g03_s1_kanghsuan_kp_authority_v2.json` | 47 | `258a1b1f3ba78a419d41a75de60d88806a6fbba738d66c4c2b43663acb449fe8` |
| G03-S2 | `science_g03_s2_kanghsuan_kp_authority_v1.json` | 49 | `bba745c03edf23999129184a63ef8be4eb8df9e94bc1524180af64bb41652500` |
| G04-S1 | `science_g04_s1_kanghsuan_kp_authority_v1.json` | 45 | `ac2122b09caa56afec373303c8a6169b57353bff06794831b508c3a3f5b5e4d5` |
| G04-S2 | `science_g04_s2_kanghsuan_kp_authority_v1.json` | 46 | `93f7bcc65bbf4fa18e5f6516cf3f3cd31a51b327ab1ce276b15685971d094f46` |

全部 187 個 `title`、`kp_id`、`canonical_kp_id` 逐筆比對來源 ZIP，跨學期凍結雜湊另由 `tests/authority-adapter.test.mjs` 固定驗證。原始 ZIP 並未發布到 public GitHub；公開資料僅包含 unit/KP metadata。

## S2 操作規則

- 年級 3/4、上下學期、U01–U04，全部由正式 Authority 提供單元名稱。
- 單一 KP、同單元多 KP、跨單元 KP 可以選擇正式 canonical ID。
- 跨單元至少兩個單元，每單元至少一個 KP。
- 期中 U01＋U02；期末 U03＋U04。
- `DEMO_ONLY` 題庫與真實已認證考古題分離；目前所有可產生題目仍只是示範題。沒有題目、資料量不足或不合法的選擇必須 fail closed，不能生成替代題目。
- A4 雙欄列印和閱讀題組原子性保留不變。

## 來源界線與後續

本次 S2 不包含考古題擷取、GPT-6 逐題分類、答案驗證或正式抽題池。三上 canonical ID 是本專案對齊 V2 生成的內部識別碼，非出版社來源編號。

後續 S3 才可引入已通過逐題認證的考古卷題目，還需另外建立閱讀文章／圖片／數據來源的可用權限與答案驗證。

S1 完整 ZIP 與 GitHub 精簡版的原始碼 parity 是獨立待辦，不在此次 S2 聲稱完成。
