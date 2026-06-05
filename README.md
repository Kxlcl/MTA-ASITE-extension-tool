# MTA ASITE File Downloader – Python GUI App

A simple desktop application with graphical interface for downloading files from Azure Blob Storage. Built with Python's tkinter (no external GUI libraries needed).

---

## Features

- ✅ **Simple GUI** – No command line needed
- ✅ **Azure AD Authentication** – Secure browser-based login (same as Azure CLI)
- ✅ **CSV Input** – Load file numbers from CSV
- ✅ **Real-time Progress** – See files being downloaded live
- ✅ **No CORS Issues** – Works as a native desktop app
- ✅ **Read-Only** – Cannot delete or modify files, only download

---

## Requirements

- Python 3.7 or later
- Azure Python libraries:
  ```bash
  pip3 install azure-identity azure-storage-blob
  ```

---

## Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   pip3 install azure-identity azure-storage-blob
   ```

3. **Run the app:**
   ```bash
   python3 asite_downloader_gui.py
   ```

---

## How to Use

1. **Launch the app:**
   ```bash
   python3 asite_downloader_gui.py
   ```

2. **Enter folder name** – Type the Azure blob folder/prefix (e.g., `2024-reports`)

3. **Select CSV file** – Click "Browse..." and choose your CSV file with file numbers

4. **Click "Start Download"** – The app will:
   - Open a browser window for Azure login
   - Authenticate you securely
   - Search for files matching your CSV numbers
   - Download them to `~/Downloads/[folder]ASITEFiles/`

5. **Monitor progress** – Watch the log area for real-time updates

---

## CSV Format

The CSV should have file numbers in the first column. A header row is optional.

**Example:**
```csv
number
42
1234
7
```

- Numeric values are automatically zero-padded to 4 digits
- Becomes lookups for: `0042`, `1234`, `0007`
- First row skipped if it contains: `number`, `numbers`, `file`, or `files`

---

## Configuration

The app is pre-configured to connect to:
- **Storage Account:** `asitemta`
- **Container:** `asite-mta-data`

To change these, edit the constants at the top of `asite_downloader_gui.py`:

```python
STORAGE = "asitemta"
CONTAINER = "asite-mta-data"
```

---

## Authentication

The app uses **Azure CLI's public client ID** for authentication, which means:
- ✅ No Azure app registration needed
- ✅ Same authentication as Python's `InteractiveBrowserCredential`
- ✅ Works with any Azure AD tenant
- ✅ Secure browser-based login (no credentials stored in the app)

---

## Download Location

Files are downloaded to:
```
~/Downloads/[YourFolderName]ASITEFiles/
```

For example, if your folder is `2024-reports`, files go to:
```
~/Downloads/2024-reportsASITEFiles/
```

---

## Supported File Types

The app automatically searches for files with these extensions:
- Images: `.jpg`, `.jpeg`, `.png`
- Documents: `.pdf`, `.txt`, `.docx`
- Data: `.csv`, `.xlsx`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **"No module named 'azure'"** | Run: `pip3 install azure-identity azure-storage-blob` |
| **Browser login doesn't open** | Check your firewall settings, ensure port 8400 is not blocked |
| **"Authentication failed"** | Make sure you have access to the Azure storage account with your Microsoft account |
| **Files not found** | Verify the folder name matches exactly (case-sensitive) and files exist in that folder |
| **Window appears blank** | Try running with `python3 -u asite_downloader_gui.py` for unbuffered output |

---

## Security

This application is **read-only** and:
- ❌ Cannot delete files
- ❌ Cannot modify files
- ❌ Cannot upload files
- ✅ Can only list and download files

Your Azure AD credentials are handled securely by Microsoft's authentication libraries and are never stored in the application.

---

## Comparison with Original Python Script

| Feature | Original CLI Script | This GUI App |
|---------|-------------------|--------------|
| Interface | Command line | Graphical window |
| File selection | Manual typing | Browse button |
| Progress visibility | Text output | Live scrolling log |
| Azure auth | Interactive browser | Interactive browser (same) |
| Functionality | ✅ Identical | ✅ Identical |

Both use the exact same Azure libraries and authentication methods!

---

## Technical Details

- **Language:** Python 3
- **GUI Framework:** tkinter (built into Python)
- **Azure Libraries:** `azure-identity`, `azure-storage-blob`
- **Authentication:** InteractiveBrowserCredential (Azure CLI public client)
- **Threading:** Background thread for downloads to keep UI responsive

---

## License

MIT
