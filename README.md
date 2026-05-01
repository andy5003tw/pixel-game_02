# Pixel Quiz Challenge - 像素風闖關問答遊戲

這是一個基於 React + TypeScript + Vite 構建的像素風格闖關問答遊戲。遊戲透過 Google Apps Script (GAS) 作為後端，將題目存儲於 Google 試算表中，並自動紀錄玩家的得分與遊玩紀錄。

## 🎮 遊戲特色

- **復古街機視覺**：使用 2000 年代風格的像素藝術設計，包含 CRT 掃描線特效。
- **動態關主系統**：結合 DiceBear API，每一關都會根據題號自動生成獨一無二的像素關主。
- **雲端資料整合**：題目由 Google Sheets 撈取，作答結果即時回傳雲端存檔。
- **響應式設計**：支援桌面與行動裝置操作。

## 🛠️ 技術棧

- **前端**：React 18, TypeScript, Vite
- **樣式**：Vanilla CSS (像素風自定義設計)
- **後端**：Google Apps Script (GAS)
- **字體**：Google Fonts - Press Start 2P

## 🚀 詳細安裝與部署指南

### 1. 本地開發環境設定

首先確保你的電腦已安裝 [Node.js](https://nodejs.org/)。

```bash
# 1. 複製專案 (或進入專案資料夾)
cd pixel-game_02

# 2. 安裝所有依賴套件
npm install

# 3. 建立環境變數檔案
# 在根目錄建立一個名為 .env 的檔案，內容如下：
VITE_GOOGLE_APP_SCRIPT_URL=你的_GAS_部署網址
VITE_PASS_THRESHOLD=70
VITE_QUESTION_COUNT=10
VITE_USE_MOCK=false

# 4. 啟動開發伺服器
npm run dev
```

---

### 2. Google 試算表設定 (資料庫)

1. **建立新試算表**：前往 [Google Sheets](https://sheets.new) 建立一個空白試算表。
2. **設定分頁**：
   - **分頁 1：`題目`**
     - 第一列標題請務必設置為：`題號` | `題目` | `A` | `B` | `C` | `D` | `解答`
     - 「解答」欄位請填寫 A、B、C 或 D。
   - **分頁 2：`回答`**
     - 第一列標題請務必設置為：`ID` | `闖關次數` | `總分` | `最高分` | `第一次通關分數` | `花了幾次通關` | `最近遊玩時間`
3. **記錄試算表 ID**：網址中 `d/` 與 `/edit` 之間的那串字元即為試算表 ID。

---

### 3. Google Apps Script (後端邏輯)

1. **開啟指令碼編輯器**：在試算表中點擊「擴充功能」 > 「Apps Script」。
2. **貼入程式碼**：將以下代碼貼入 `代碼.gs` 中並儲存。

```javascript
const SPREADSHEET_ID = '你的_GOOGLE_SHEET_ID';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  if (action === 'getQuestions') {
    return getQuestions(data.count || 10);
  } else if (action === 'submitAnswers') {
    return submitAnswers(data.id, data.answers);
  }
}

function getQuestions(count) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('題目');
  const values = sheet.getDataRange().getValues();
  const header = values.shift();
  
  // 隨機選取題目
  const shuffled = values.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count).map(row => ({
    id: row[0],
    question: row[1],
    options: { A: row[2], B: row[3], C: row[4], D: row[5] }
  }));
  
  return ContentService.createTextOutput(JSON.stringify(selected))
    .setMimeType(ContentService.MimeType.JSON);
}

function submitAnswers(userId, userAnswers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const qSheet = ss.getSheetByName('題目');
  const rSheet = ss.getSheetByName('回答');
  
  const qValues = qSheet.getDataRange().getValues();
  qValues.shift(); // 移除標題
  
  let correctCount = 0;
  userAnswers.forEach(ua => {
    const question = qValues.find(q => q[0] == ua.id);
    if (question && question[6] === ua.answer) {
      correctCount++;
    }
  });
  
  const total = userAnswers.length;
  const score = Math.round((correctCount / total) * 100);
  
  // 紀錄到「回答」分頁 (此處邏輯可依需求增加，如更新現有使用者紀錄)
  rSheet.appendRow([userId, 1, score, score, score, 1, new Date()]);
  
  const result = {
    score: score,
    correct: correctCount,
    total: total,
    status: score >= 70 ? 'PASS' : 'FAIL'
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **部署網頁應用程式**：
   - 點擊右上角「部署」 > 「新增部署」。
   - 選取類型：「網頁應用程式」。
   - 說明：`Pixel Game Backend`。
   - 執行身分：**「我」**。
   - 誰可以存取：**「所有人」** (這很重要，否則前端無法存取)。
   - 點擊「部署」，並授權存取。
4. **複製網址**：將生成的「網頁應用程式 URL」複製到專案的 `.env` 檔案中。

## 🚀 部署到 GitHub Pages (透過 GitHub Actions)

本專案已配置好 GitHub Actions，當你推送到 `main` 分支時會自動建置並部署到 GitHub Pages。

### 設定 GitHub Secrets

由於部署過程需要使用你的專屬網址與參數，請在 GitHub 儲存庫進行以下設定：

1. 進入你的 GitHub 儲存庫頁面。
2. 點擊 **Settings** > **Secrets and variables** > **Actions**。
3. 點擊 **New repository secret** 來新增以下環境變數（對應 `.env.example` 中的變數）：
   - `VITE_GOOGLE_APP_SCRIPT_URL`：(必填) 你的 Google Apps Script 部署網址。
   - `VITE_PASS_THRESHOLD`：(選填，預設為 70) 通關門檻分數。
   - `VITE_QUESTION_COUNT`：(選填，預設為 5) 每次遊戲抽取的題目數量。
   - `VITE_USE_MOCK`：(選填，預設為 false) 是否使用模擬資料。

### 開啟 GitHub Pages 設定

1. 進入儲存庫的 **Settings** > **Pages**。
2. 在 **Build and deployment** 區塊，將 **Source** 選擇為 **GitHub Actions**。
3. 接下來，只要推送代碼到 `main` 分支，GitHub 就會自動執行建置並將成果發布至 GitHub Pages！

---

## 📜 授權

MIT License.
