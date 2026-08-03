# Codex 後續任務指令

請先閱讀 README.md，再檢查 index.html、styles.css、app.js。

目前專案是零依賴純前端 Web App。請維持以下原則：

1. 不加入任何付費服務。
2. 不要求 API key。
3. 不加入追蹤器或廣告。
4. 所有資料預設只存在 localStorage。
5. 不改變原始 65 題的題號與計分對應；首頁需保留感情、事業、財運、家運四種 17 題短版與 65 題完整版。
6. 所有宗教與科儀結果只能表達為「建議進一步評估」，不得直接斷定靈性、祖先或因果問題。
7. 客人結果頁只顯示主要類型、目前困境與初步改善建議。
8. 八大面向排名、優先改善順位與檢核提醒屬內部資料，不直接顯示給客人。
9. 推薦科儀項目只寫入 Google Sheet 作為內部初步參考，不直接顯示給客人，也不得保證效果。
10. 不提供客人下載 JSON、CSV 或另存 PDF 的按鈕，除非後續明確改回。
11. Google Sheet 收件網址只填在 `app.js` 的 `GOOGLE_SCRIPT_URL`，不要放 API key 或機密資訊。

優先檢查：

- 65 題是否全部可作答。
- 四種短版是否各為 17 題，且包含四軸核心題與三個相關面向。
- 各版本重新整理後答案是否分開保留。
- 四軸總分是否各為 8～40。
- 八大面向是否各為 3～15。
- 完整版四碼是否依 8～22、23～25、26～40 正確判定；短版是否依相同比例門檻換算。
- 內部資料是否仍保留於 `buildResult()`，方便未來串接收件。
- 推薦科儀項目是否保留於 `buildResult().recommendedRituals`，並只寫入 Google Sheet。
- 若 `GOOGLE_SCRIPT_URL` 已設定，結果頁送出按鈕是否可將完整結果送到 Google Sheet。
- Google Sheet 是否寫入測驗版本與題數。
- 手機版是否容易操作。

可選擇的免費後續功能：

- 增加深色模式。
- 增加題目總覽與返回修改。
- 增加離線 PWA。
- 加入品牌 Logo 與自訂文案。
- 產生單頁可分享結果圖。
# LINE／LIFF 驗證防呆（修改與部署前必查）

預約頁需要取得 LINE 暱稱時，必須遵守以下規則，避免再次出現驗證失敗或 400 Bad Request：

1. 對外提供的客人入口一律使用 LIFF 官方網址：`https://liff.line.me/2010747679-nNL4BQhG/booking/`，不可直接把 GitHub Pages 原始網址當作 LINE 登入入口。
2. 不同官方帳號以 `src` 參數分流；`@764catfn` 使用 `https://liff.line.me/2010747679-nNL4BQhG/booking/?src=764catfn`，重新導向時必須完整保留 `src`。
3. 前端 `LIFF_ID` 必須是完整值 `2010747679-nNL4BQhG`，後端驗證用的 LINE Login Channel ID 必須對應 `2010747679`，不可混用 Messaging API 的 Channel ID。
4. 使用者未登入時，必須重新導向官方 LIFF 網址；不可使用 GitHub Pages 或 Sites 原始網址作為 `liff.login()` 的 `redirectUri`。
5. LIFF Console 的 Endpoint URL 必須維持 `https://b10211147-hub.github.io/luck-assessment-v1/`。若更換網域、路徑或 LIFF ID，要同時更新前端、後端與 LINE Developers Console。
6. 每次發布後至少測試：LINE App 內開啟、手機外部瀏覽器開啟、LINE 暱稱是否取得、`/api/identity` 是否成功，以及網址是否仍保留正確的 `src`。
7. 若出現 400 或驗證失敗，先檢查入口是否為 `liff.line.me`、LIFF ID／Channel ID 是否配對、Endpoint URL 是否正確，再檢查快取；不可先改成繞過驗證。
8. LIFF 從子路徑登入後會以 `liff.state` 回到 Endpoint 根目錄；首頁必須把 `/booking/...` 的 `liff.state` 導回預約頁，且保留查詢參數。
9. 身分驗證以 ID Token 為主、Access Token 驗證後取得 Profile 為備援；兩者皆須在後端確認屬於 Channel ID `2010747679`，不可直接信任前端傳來的 LINE 姓名或 User ID。
