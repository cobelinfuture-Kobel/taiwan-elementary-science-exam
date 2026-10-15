# P12 B04 B07｜31 題正式 Source／Science／KP 驗收與公開入庫

- 以 PR #100 的 50 題初審清冊為 immutable 來源，逐題二次核對獅湖期末 16、桃子腳期末 15 的原題題幹／選項／PDF SHA／頁碼／作答格 BBox。
- 以模型獨立科學推理確認 25 個是非與 6 個四選一唯一建議答案，對應四上 U03 canonical KP，未冒稱原校教師標準答案。
- 15 個桃子腳原卷位置有原本「(9 分)」父指示，證據 `full_original_stem_exact` 保留原卷全文，學生 `student_scoreless_stem` 另作不計分投影。
- 對既有 B01–B06、永安／崇德已發布來源進行重複題幹比對，31 個候選無完整同題幹衝突。
- 19 個和順掃描來源不具原生 answer BBox，繼續保留 HOLD；本次不因有建議科學答案而公開。
- 新增 `p12-b04-b07-31-release.mjs` 逐題 fail-closed answer／KP／PDF／BBox／rights gate，與 `historical-bank-ox-v6.mjs` 的題庫整合。
- 公開題庫預期 529→560，最終發布仍以 PR CI、merge 後 main 回讀、Pages deploy 與站點 E2E 為準。

此 PR 的來源核准依既有 P12 B04 AUTO_BATCH50 operator bulk authorization；如 CI／Pages 未過，不宣稱已正式公開。
