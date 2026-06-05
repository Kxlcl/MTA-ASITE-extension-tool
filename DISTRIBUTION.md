# 🚀 Distribution Guide

## ✅ What You Have

A **standalone macOS application** at:
```
dist/MTA-ASITE-Downloader.app
```

- **Size:** 18MB
- **Platform:** macOS (Apple Silicon/Intel)
- **No installation required** - Users just double-click!

---

## 📦 How to Distribute

### Option 1: Direct File Sharing (Simplest)
1. Compress the app:
   ```bash
   cd dist
   zip -r MTA-ASITE-Downloader.zip MTA-ASITE-Downloader.app
   ```
2. Share the ZIP file via:
   - Email
   - Google Drive / Dropbox
   - USB drive
   - Company file server

### Option 2: DMG Installer (Professional)
Create a drag-and-drop disk image:
```bash
# Install create-dmg if needed
brew install create-dmg

# Create DMG
create-dmg \
  --volname "MTA ASITE Downloader" \
  --window-pos 200 120 \
  --window-size 600 400 \
  --icon-size 100 \
  --app-drop-link 425 120 \
  "MTA-ASITE-Downloader.dmg" \
  "dist/MTA-ASITE-Downloader.app"
```

---

## 👤 User Installation Instructions

### For Mac Users (Your Distributed Package)

1. **Download** the ZIP/DMG file
2. **Extract** (if ZIP) or open (if DMG)
3. **Copy** `MTA-ASITE-Downloader.app` to Applications folder (optional)
4. **Double-click** the app to run

### First-Time Security Warning ⚠️

macOS will show a security warning on first run:
> *"MTA-ASITE-Downloader.app can't be opened because it is from an unidentified developer"*

**Tell users to:**
1. **Right-click** (or Control-click) the app
2. Select **"Open"**
3. Click **"Open"** in the dialog
4. App will run and won't ask again

**Alternative:**
1. Go to **System Preferences → Security & Privacy**
2. Click **"Open Anyway"** for MTA-ASITE-Downloader

---

## 🔐 Removing the Security Warning (Optional)

To avoid the security warning, you need an **Apple Developer account** ($99/year):

### Steps:
1. **Join Apple Developer Program**
   - https://developer.apple.com/programs/

2. **Get Developer ID Certificate**
   - In Xcode or Developer Portal
   - Download and install certificate

3. **Sign the app**
   ```bash
   codesign --force --deep --sign "Developer ID Application: Your Name" \
     dist/MTA-ASITE-Downloader.app
   ```

4. **Notarize with Apple** (required for macOS 10.15+)
   ```bash
   # Create zip
   ditto -c -k --keepParent dist/MTA-ASITE-Downloader.app MTA-ASITE-Downloader.zip

   # Submit for notarization
   xcrun notarytool submit MTA-ASITE-Downloader.zip \
     --apple-id "your@email.com" \
     --password "app-specific-password" \
     --team-id "YOUR_TEAM_ID" \
     --wait

   # Staple notarization ticket
   xcrun stapler staple dist/MTA-ASITE-Downloader.app
   ```

---

## 🪟 For Windows Users

The current build is **Mac-only**. To create a Windows version:

1. **Build on Windows machine** (or use GitHub Actions):
   ```cmd
   pip install pyinstaller azure-identity azure-storage-blob
   pyinstaller build_exe.spec --clean
   ```

2. **Distribute** the `.exe` file from `dist/` folder

3. Windows Defender might flag it - users need to:
   - Click "More info" → "Run anyway"
   - Or add exception in Windows Security

---

## 📊 What Users Get

When they run the app:
1. **GUI window opens** with simple interface
2. Enter folder name
3. Select CSV file
4. Click "Start Download"
5. Browser opens for Azure login (one-time)
6. Files download automatically

---

## 🛠️ Rebuilding

If you update the code:
```bash
./build.sh
```

Or manually:
```bash
source venv/bin/activate
pyinstaller build_exe.spec --clean
```

---

## 📝 User Requirements

**What users need:**
- ✅ macOS 10.13+ (High Sierra or later)
- ✅ Internet connection
- ✅ Azure account with access to the storage

**What users DON'T need:**
- ❌ Python installation
- ❌ Terminal/command line knowledge
- ❌ Any dependencies or libraries

---

## 🐛 Troubleshooting

### "App is damaged and can't be opened"
This happens if the app was downloaded and quarantined by macOS.

**Solution:**
```bash
xattr -cr /path/to/MTA-ASITE-Downloader.app
```

### App doesn't open / crashes immediately
Check Console app for crash logs:
1. Open Console.app
2. Search for "MTA-ASITE-Downloader"
3. Look for error messages

### Browser login doesn't work
- Check firewall isn't blocking port 8400
- Try disabling VPN temporarily
- Ensure network allows Azure login

---

## 📋 Testing Checklist

Before distributing, test:
- [ ] App opens without errors
- [ ] GUI displays correctly
- [ ] Can select CSV file
- [ ] Azure login works
- [ ] Files download successfully
- [ ] Works on different Mac (if possible)

---

## 💡 Pro Tips

1. **Version your builds:**
   - Rename: `MTA-ASITE-Downloader-v1.0.app`
   - Track what changed in each version

2. **Include a README with distribution:**
   - What the app does
   - How to run it
   - How to handle security warnings
   - Who to contact for support

3. **Test on a clean Mac:**
   - Ask a colleague to test
   - Ensures it works without your development environment

---

## 📬 Distribution Checklist

- [ ] Build app with `./build.sh`
- [ ] Test the built app works
- [ ] Compress to ZIP or create DMG
- [ ] Write instructions for users
- [ ] Include contact info for support
- [ ] Distribute!

---

**Current Status:**
✅ Your app is ready at: `dist/MTA-ASITE-Downloader.app`

**To distribute right now:**
```bash
cd dist
zip -r MTA-ASITE-Downloader.zip MTA-ASITE-Downloader.app
# Share MTA-ASITE-Downloader.zip with users!
```
