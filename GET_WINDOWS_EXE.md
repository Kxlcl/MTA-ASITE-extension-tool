# 🪟 Getting Your Windows Executable

## 🎯 Two Ways to Get It

---

## Method 1: GitHub Actions (EASIEST - No Windows Needed!)

### Setup (One Time):

1. **Make sure your code is on GitHub**

   If not already there:
   ```bash
   git add .
   git commit -m "Add Windows build support"
   git push origin main
   ```

2. **GitHub automatically builds Windows + Mac versions!**

   - Go to your GitHub repository
   - Click the **"Actions"** tab at the top
   - You'll see "Build Executables" running
   - Wait ~5-10 minutes for build to complete

3. **Download Your Windows .exe:**

   - Click on the completed workflow (green checkmark)
   - Scroll down to **"Artifacts"** section
   - Click **"windows-executable"** to download
   - Extract the ZIP → You have `MTA-ASITE-Downloader.exe`!

### Manual Trigger:

You can trigger a build any time:
1. Go to **Actions** tab
2. Click **"Build Executables"** on the left
3. Click **"Run workflow"** button (right side)
4. Click **"Run workflow"** in the dropdown
5. Wait for it to complete
6. Download from Artifacts!

---

## Method 2: Build Locally on Windows

If you have a Windows machine:

1. **Install Python 3.7+** (if not already installed)
   - Download from python.org

2. **Clone this repository**:
   ```cmd
   git clone <your-repo-url>
   cd MTA_Tools_Extension
   ```

3. **Run the build script**:
   ```cmd
   build_windows.bat
   ```

4. **Get your executable**:
   - Location: `dist\MTA-ASITE-Downloader.exe`
   - ZIP file: `MTA-ASITE-Downloader-Windows.zip`

---

## 🎉 Creating a Release (Automatic Windows + Mac)

Want a proper release with download links?

```bash
# Create a version tag
git tag -a v1.0.0 -m "First release"
git push origin v1.0.0
```

GitHub will automatically:
- Build Windows .exe
- Build macOS .app
- Create a GitHub Release
- Attach both files to the release
- Give you shareable download links!

Then go to your repo → **Releases** → You'll see v1.0.0 with both executables ready to download!

---

## 📦 What You'll Get

### Windows Executable:
- **File:** `MTA-ASITE-Downloader.exe`
- **Size:** ~30-40 MB
- **Requirements:** Windows 10/11 (no Python needed!)
- **Distribution:** Share the .exe file directly

### macOS Executable:
- **File:** `MTA-ASITE-Downloader.app`
- **Size:** ~18-20 MB
- **Requirements:** macOS 10.13+ (no Python needed!)
- **Distribution:** Share the .app bundle (as ZIP)

---

## ⏱️ How Long Does It Take?

- **GitHub Actions:** ~5-10 minutes (builds both platforms)
- **Local Windows build:** ~2-3 minutes

---

## 💡 Recommended Workflow

1. **Test your code locally** (macOS build)
2. **Push to GitHub**
3. **Let GitHub Actions build Windows version** automatically
4. **Download both from Artifacts**
5. **Distribute both executables** to users!

---

## 🐛 If Build Fails on GitHub

1. **Check the logs:**
   - Click on the failed run
   - Click on the job (Windows or macOS)
   - Read the error messages

2. **Common issues:**
   - Missing dependencies → Update `requirements.txt`
   - Typo in spec file → Check `build_exe_windows.spec`
   - Python version → Workflow uses Python 3.11

3. **Fix and retry:**
   ```bash
   git add .
   git commit -m "Fix build issue"
   git push origin main
   ```
   → Automatically rebuilds!

---

## ✅ Current Status

You have:
- ✅ Mac executable built locally (`dist/MTA-ASITE-Downloader.app`)
- ✅ GitHub Actions configured for automatic Windows builds
- ✅ GitHub Actions configured for automatic Mac builds
- ✅ Build scripts for both platforms
- ✅ Release automation ready

**Next step:** Push to GitHub and get your Windows .exe from Actions!

---

## 🎓 Step-by-Step Visual Guide

### Getting Windows .exe from GitHub Actions:

1. **Go to your repo on GitHub.com**
2. **Click "Actions" tab** (between "Pull requests" and "Projects")
3. **See the workflow running** (yellow dot) or completed (green checkmark)
4. **Click on the workflow run**
5. **Scroll to bottom → "Artifacts" section**
6. **Click "windows-executable"** → Downloads ZIP
7. **Extract ZIP → You have your .exe!**

That's it! 🎉

---

## 📋 Quick Checklist

To get Windows executable via GitHub Actions:

- [ ] Code is pushed to GitHub
- [ ] `.github/workflows/build-executables.yml` file exists
- [ ] Actions are enabled in repo settings
- [ ] Wait for build to complete (~10 min)
- [ ] Download from Artifacts section
- [ ] Extract and test the .exe

Done! Your Windows executable is ready to distribute! 🚀
