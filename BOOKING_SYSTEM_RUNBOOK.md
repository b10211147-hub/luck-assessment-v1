# 奉母宮 LINE 預約系統施作基準

> 狀態：正式維護文件  
> 最後更新：2026-08-03  
> 適用範圍：奉母宮主官方、`@764catfn`、客人預約頁、LINE LIFF、預約 API、管理後台與 Telegram 通知。

## 1. 修改前必讀

所有預約系統相關修改都必須先閱讀本文件。修改登入、網址、來源參數、部署方式或 LINE 驗證流程時，必須同步更新本文件並完成第 7 節的測試。

## 2. 正式架構

| 項目 | 正式設定 |
|---|---|
| LIFF ID | `2010747679-nNL4BQhG` |
| LINE Login Channel ID | `2010747679` |
| LIFF Endpoint URL | `https://b10211147-hub.github.io/luck-assessment-v1/` |
| 預約前端 | `https://b10211147-hub.github.io/luck-assessment-v1/booking/` |
| 預約 API | `https://fengmugong-registration-api.b10211147.chatgpt.site` |
| 舊入口／轉址入口 | `https://fengmugong-registration-api.b10211147.chatgpt.site/booking` |

LINE Login Channel ID、LIFF ID 與 Messaging API Channel ID 是不同用途，不可混用。前端使用完整 LIFF ID；後端驗證 Token 時使用 LINE Login Channel ID。

## 3. 兩個官方帳號的正式連結

### 奉母宮主官方 `@248ysvwi`

主要連結：

`https://liff.line.me/2010747679-nNL4BQhG/booking/?via=liff&src=main`

相容舊連結：

`https://fengmugong-registration-api.b10211147.chatgpt.site/booking?src=main`

### 第二官方 `@764catfn`

主要連結：

`https://liff.line.me/2010747679-nNL4BQhG/booking/?via=liff&src=764catfn`

相容舊連結：

`https://fengmugong-registration-api.b10211147.chatgpt.site/booking?src=764catfn`

官方帳號的圖文選單、歡迎訊息、QR Code 與人工傳送連結，優先使用主要 LIFF 連結。相容舊連結只用於既有連結無法立即更換時。

## 4. 2026-08-03 LINE 閃退／反覆跳轉事件

### 使用者症狀

- 手機 LINE 開啟後畫面閃退或反覆重開。
- 停留在「正在連接 LINE 身分」。
- 一般網址、GitHub Pages Endpoint 與 LINE 登入頁之間重複跳轉。
- 部分環境曾出現 `400 Bad Request`。

### 根本原因

客人進入帶有子路徑的 LIFF 網址後，LINE 會先把使用者送到 Endpoint 根目錄，並以 `liff.state` 保存 `/booking/` 與來源參數。舊版根頁面在 `liff.init()` 完成前自行呼叫 `window.location.replace()`，跳過 LINE 規定的 primary redirect 初始化，也可能遺失登入狀態。這會讓手機 LINE 在 Endpoint、登入頁與預約頁之間重複開啟，表現成閃退或反覆跳轉。

### 已採用修正

1. 所有正式 LIFF 入口必須帶上 `via=liff`。
2. Endpoint 根頁面收到 `liff.state` 時，不可在 `liff.init()` 完成前以 `location`、History API 或伺服器 301／302 改變網址。
3. 根頁面必須先執行 `liff.init()`，由 LIFF SDK 將 primary redirect 正常轉成 `/booking/` 的 secondary redirect。
4. `/booking/` secondary redirect 必須再次執行 `liff.init()`；完成後若仍未登入，才使用 `liff.login({ redirectUri: window.location.href })`。
5. GitHub Pages 預約頁若沒有 `via=liff`，只保留所有參數並轉到 LIFF 官方入口一次。
6. Sites 的舊入口必須合併原查詢參數、強制加入 `via=liff`，再轉到 LIFF 官方入口。
7. `src` 必須在全部轉址中保留，避免主官方與 `@764catfn` 來源混淆。

## 5. 不可破壞的實作規則

1. 不可把 GitHub Pages 原始網址當作官方帳號的主要入口。
2. 不可移除 `via=liff`，也不可用 `target.search = ...` 覆蓋既有 LIFF 必要參數；應逐項合併參數。
3. Endpoint 根頁面出現 `liff.state` 時，必須先等待 `liff.init()`；初始化完成前嚴禁自行改寫或轉址。
4. `src=main` 代表奉母宮主官方；`src=764catfn` 代表第二官方。
5. LINE 身分以後端驗證為準，不信任前端自行傳入的 LINE 名稱或 User ID。
6. 身分驗證以 ID Token 為主，Access Token Profile 驗證為備援；兩者皆失敗才回傳 401。
7. LINE API 網路或 JSON 解析錯誤必須捕捉，不能讓 `/api/identity` 產生空白 500。
8. LIFF Endpoint 必須維持在專案根路徑；子路徑由 LIFF SDK 依 `liff.state` 導回，不能在初始化前自行拼接或改寫 `/booking/`。
9. 發布前端 JavaScript 後必須更新資源版本參數，避免手機沿用舊快取。
10. 舊入口要維持可用，但正式宣傳一律使用第 3 節的主要 LIFF 連結。

## 6. 主官方與第二官方的隔離

- 兩個官方可共用同一個預約前端與 API，但必須用 `src` 分流。
- Telegram 與管理後台必須顯示正確來源官方。
- `@764catfn` 的品牌、服務項目、預約須知與後台權限可獨立調整，不得改壞主官方畫面。
- 未帶 `src` 時一律視為 `main`，確保主官方的舊連結相容。

## 7. 每次發布後的最低測試

### 主官方

- 開啟主官方主要 LIFF 連結。
- 確認沒有 400、沒有反覆跳轉、沒有停在連接畫面。
- 確認 LINE 暱稱成功取得。
- 確認來源為 `main`／`@248ysvwi`。

### `@764catfn`

- 開啟 `@764catfn` 主要 LIFF 連結。
- 確認顯示 `@764catfn` 專屬品牌與內容。
- 確認 LINE 暱稱成功取得。
- 確認 Telegram 與後台來源為 `@764catfn`。

### 共通

- LINE App 內測試一次。
- 手機外部瀏覽器測試一次。
- 舊 Sites 入口測試一次，確認只轉址一次。
- GitHub Pages 直連測試一次，確認會轉到 LIFF 入口。
- 檢查 `/api/identity`、時段載入與送出預約。
- 確認網址中的 `via=liff` 與 `src` 在登入後仍存在。

## 8. 發布順序

1. 修改前先閱讀本文件並確認不破壞第 5 節規則。
2. 先完成前端與後端建置檢查。
3. 發布 GitHub Pages 預約前端。
4. 若改到 API 或舊入口，再發布 Sites 後端。
5. 等待 GitHub Pages 與 Sites 正式版本生效。
6. 依第 7 節完成兩個官方帳號的測試。
7. 若本次問題產生新規則，先更新本文件再結案。
