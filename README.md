# Azure Blob Downloader – Edge Extension

Downloads files from your Azure Blob Storage container by reading file numbers from a CSV — exactly what the original Python script did, but entirely inside Microsoft Edge.

---

## How It Works

1. You drop (or select) a CSV file with a **number** column.
2. You type the **folder / prefix** inside your container (e.g. `2024-reports`).
3. The extension authenticates you to Azure via your browser login (no credentials stored locally).
4. It lists the blobs under that prefix, matches them to your CSV numbers, and downloads every match using Edge's built-in download manager.

---

## Before You Start – Azure App Registration

You need a **registered application** in Azure AD that has permission to read your storage account.

1. Go to **Azure Portal → App Registrations → New registration**.
2. Give it any name (e.g. `AziteBlobDownloader`).
3. Set **Supported account types** to whichever suits your org.
4. Under **Redirect URI**, choose **Single-page application** and add:
   ```
   chrome-extension://<EXTENSION_ID>/auth_redirect.html
   ```
   *(you'll get the extension ID after loading it – see step below, then come back and add it)*
5. Go to **API permissions → Add permission → Azure Blob Storage → User.Read** (or `Storage Blob Data Reader`).
6. Grant admin consent.
7. Note your **Client ID** and **Tenant ID** from the app overview page.

---

## Config – Two Values to Edit

Open **background.js** and replace the placeholders at the top:

```js
const AUTH_CONFIG = {
  clientId:  "YOUR_CLIENT_ID_HERE",        // ← paste Client ID
  authority: "https://login.microsoftonline.com/YOUR_TENANT_ID_HERE", // ← paste Tenant ID
  ...
};
```

---

## Install Into Edge (Sideload)

1. Open Edge and go to `edge://extensions`.
2. Enable **Developer mode** (toggle, top-right).
3. Click **Load unpacked**.
4. Select this folder (the one containing `manifest.json`).
5. The extension icon appears in your toolbar. Click it.
6. Copy the **Extension ID** shown on the extensions page and go back to finish the App Registration redirect URI (see above).

---

## Usage

| Step | What to do |
|------|-----------|
| 1 | Click the extension icon in the toolbar. |
| 2 | Click **Login** – a browser popup will ask you to sign in with your Azure account. |
| 3 | Type the folder/prefix name in the input field. |
| 4 | Drag your CSV onto the drop zone (or click to browse). |
| 5 | Click **Preview** to see which blobs will match, or **Download Files** to fetch them. |

Downloaded files land in your browser's default **Downloads** folder.

---

## File Structure

```
azure-blob-downloader/
├── manifest.json          – Extension manifest (MV3)
├── background.js          – Service worker: auth token management + download logic
├── offscreen.html         – Hidden page that runs MSAL (needs DOM)
├── popup.html             – Toolbar popup UI
├── popup.js               – Popup interactions & CSV parsing
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              – This file
```

---

## CSV Format

The extension reads the first column. A header row is optional — if present, the first cell should be one of: `number`, `numbers`, `file`, `files`. Numeric values are zero-padded to 4 digits (matching the original script's `zfill(4)`).

```csv
number
42
1234
7
```

becomes lookups for `0042`, `1234`, `0007`.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Auth timed out" | Pop-ups may be blocked. Allow pop-ups for `login.microsoftonline.com` in Edge settings. |
| "List failed: 403" | Your Azure App Registration needs the correct storage permissions and admin consent. |
| No files match | Use **Preview** to see what blobs actually exist under that prefix and compare with your CSV numbers. |
| Token expires mid-download | The extension automatically re-authenticates after 55 minutes. If a download fails, click **Re-auth** and retry. |
