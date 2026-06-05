# MTA ASITE File Downloader - User Guide

## 📥 Installation

1. Download `MTA-ASITE-Downloader.zip`
2. Double-click the ZIP to extract
3. Copy `MTA-ASITE-Downloader.app` to your Applications folder (optional)

### First-Time Security Warning

When you first open the app, macOS may show a security warning:

**If you see: "Can't be opened because it is from an unidentified developer"**

1. Right-click (or Control-click) the app icon
2. Click "Open"
3. Click "Open" again in the dialog
4. The app will now run (you only need to do this once)

---

## 🚀 How to Use

### Step 1: Open the App
Double-click `MTA-ASITE-Downloader.app`

### Step 2: Enter Folder Name
In the "Folder Name" field, type the name of the Azure folder containing your files.

Example: `2024-reports` or `project-photos`

### Step 3: Select Your CSV File
1. Click the **"Browse..."** button
2. Navigate to your CSV file with file numbers
3. Select it and click "Open"

### Step 4: Start Download
1. Click **"Start Download"** button
2. A browser window will open for Azure login
3. Sign in with your Microsoft account
4. Close the browser window after successful login
5. The app will automatically download your files

### Step 5: Monitor Progress
Watch the log area to see:
- Which files are being found
- Which files are downloading
- Any files that couldn't be found

### Step 6: Get Your Files
When complete, your files will be in:
```
~/Downloads/[YourFolderName]ASITEFiles/
```

For example, if your folder was "2024-reports", look in:
```
~/Downloads/2024-reportsASITEFiles/
```

---

## 📄 CSV File Format

Your CSV file should have file numbers in the first column:

**Example CSV:**
```
number
42
1234
7
567
```

**Notes:**
- First row can be a header (like "number", "files", etc.) - it will be skipped
- Numbers are automatically padded to 4 digits (7 becomes 0007)
- One file number per row

---

## 📋 Requirements

You need:
- macOS 10.13 or later
- Internet connection
- Microsoft/Azure account with access to the storage
- CSV file with file numbers

---

## 🎯 Supported File Types

The app automatically searches for these file types:
- Images: `.jpg`, `.jpeg`, `.png`
- Documents: `.pdf`, `.txt`, `.docx`
- Data: `.csv`, `.xlsx`

---

## ❓ Troubleshooting

### "Download already in progress"
Wait for the current download to finish before starting a new one.

### "Please enter a folder name"
Make sure the folder name field isn't empty.

### "Please select a CSV file"
You must browse and select a CSV file before downloading.

### "No valid numbers found in CSV"
Check that your CSV file has numbers in the first column.

### Files not found
- Verify the folder name is correct (case-sensitive!)
- Check that files exist in Azure with those numbers
- Confirm file extensions are supported

### Browser login doesn't open
- Check your firewall settings
- Make sure port 8400 isn't blocked
- Try disabling VPN temporarily

### "Authentication failed"
- Ensure you're using the correct Microsoft account
- Verify you have access to the Azure storage account
- Try logging out and back in

---

## 🔒 Security & Privacy

This application:
- ✅ Only downloads files (read-only access)
- ✅ Cannot delete or modify files
- ✅ Cannot upload files
- ✅ Uses Microsoft's secure authentication
- ✅ Does not store your credentials

Your login is handled securely by Microsoft Azure's authentication system.

---

## 💬 Support

If you encounter issues:

1. **Check the log area** in the app for error messages
2. **Try these steps:**
   - Restart the app
   - Check your internet connection
   - Verify your Azure access
   - Confirm the folder name and CSV format

3. **Contact your IT support** with:
   - Screenshot of the error
   - The CSV file you're using
   - The folder name you entered

---

## 📊 Understanding the Log

The log shows real-time progress:

```
✅ Found: 2024-reports/0042.pdf
   ⬇️  Downloaded
```
= File was found and downloaded successfully

```
❌ Not found: 9999
```
= File with that number doesn't exist in the folder

---

## 🎓 Quick Tips

1. **Organize your CSV files** - Keep them in a dedicated folder for easy access

2. **Check folder names** - They're case-sensitive! `Reports` ≠ `reports`

3. **Be patient** - Large file lists may take time to process

4. **Multiple downloads** - You can run the app multiple times for different folders

5. **Downloaded files location** - Remember they go to your Downloads folder with a special name

---

## ✅ Quick Start Example

1. Open app
2. Enter folder: `project-files`
3. Select CSV: `file-list.csv`
4. Click "Start Download"
5. Login to Azure in the browser
6. Wait for completion
7. Find files in `~/Downloads/project-filesASITEFiles/`

Done! 🎉

---

**Need Help?**
Contact your system administrator or IT support team.
