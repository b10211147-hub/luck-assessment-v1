# 運勢改善健檢｜完全免費第一版

這是一個純前端、零依賴、零資料庫、零主機費的 65 題 Web App。

## 立即使用

1. 解壓縮專案。
2. 雙擊 `index.html`。
3. 使用 Chrome、Edge、Safari 或 Firefox 開啟。

不需要安裝 Node.js，也不需要任何帳號。

## 已完成

- 65 題逐題作答
- 手機與電腦版面
- 自動儲存瀏覽器進度
- 四軸 A/R、I/E、W/L、B/S 計分
- 四碼類型與比例
- 八大面向分數與排名
- 一致性檢核
- 服務適用性提醒
- 匯出 JSON
- 匯出 CSV
- 列印或另存 PDF

## 完全免費部署方式

### GitHub Pages

1. 在 GitHub 建立公開 repository。
2. 上傳本專案全部檔案。
3. Repository Settings → Pages。
4. Source 選 `Deploy from a branch`。
5. Branch 選 `main` 與 `/root`。

公開網址會是：

`https://你的帳號.github.io/專案名稱/`

GitHub Pages 適合純前端靜態網站。此專案不傳送或集中保存客戶資料，答案只存在受測者自己的瀏覽器，除非本人下載結果後交給你。

## 隱私限制

完全免費版本沒有中央資料庫，因此你無法自動在後台看到客戶答案。客人可下載 CSV／JSON 後傳給你，或列印成 PDF。

若未來要集中收件，可再加入免費額度的 Supabase、Google Apps Script 或 Formspree，但那會增加帳號設定與隱私管理工作。

## 修改題目

所有題目與計分設定都在 `app.js`：

- `pairQuestions`：第 1～32 題
- `singleQuestions`：第 33～56 題
- `checkQuestions`：第 57～60 題
- `safetyQuestions`：第 61～65 題

## 重要聲明

此工具只做近期狀態與運勢傾向盤點，不應用來直接判定祖先、靈性、因果或醫療問題，也不應保證科儀效果。
