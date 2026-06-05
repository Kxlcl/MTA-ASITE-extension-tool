# 🪟 Building Windows Executable

You have **two options** to build the Windows executable:

---

## Option 1: GitHub Actions (Recommended - No Windows Required!)

### ✅ Automatic builds for both Windows AND Mac

This is already set up! Just push your code to GitHub and it builds automatically.

### Step-by-Step:

1. **Push to GitHub** (if you haven't already):
   ```bash
   git add .
   git commit -m "Add Windows build support"
   git push origin main
   ```

2. **GitHub automatically builds** Windows + Mac versions
   - Go to your repo on GitHub
   - Click "Actions" tab
   - See the build progress

3. **Download the executables**:
   - Click on the latest workflow run
   - Scroll down to "Artifacts"
   - Download:
     - `windows-executable` → Contains Windows .exe
     - `macos-executable` → Contains Mac .app

### To Create a Release:

Create a version tag and GitHub will automatically create a release with both executables:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

Then go to your GitHub repo → Releases → You'll see both executables ready to download!

---

## Option 2: Build Locally on Windows

If you have access to a Windows machine:

### Requirements:
- Windows 10/11
- Python 3.7 or later

### Steps:

1. **Clone the repository**:
   ```cmd
   git clone <your-repo-url>
   cd MTA_Tools_Extension
   ```

2. **Install Python dependencies**:
   ```cmd
   pip install -r requirements.txt
   ```

3. **Build the executable**:
   ```cmd
   pyinstaller build_exe_windows.spec --clean
   ```

4. **Find your executable**:
   ```
   dist/MTA-ASITE-Downloader.exe
   ```

5. **Distribute**:
   ```cmd
   # Zip it up
   powershell Compress-Archive -Path dist\MTA-ASITE-Downloader.exe -DestinationPath MTA-ASITE-Downloader-Windows.zip
   ```

---

## 🎯 Recommended Workflow

**Use GitHub Actions!** Here's why:

✅ No need for Windows machine
✅ Builds both Mac and Windows automatically
✅ Consistent builds every time
✅ Free for public repos
✅ Easy to create releases

### Quick Setup:

1. **Make sure your repo is on GitHub**
2. **Push the workflow file** (already created at `.github/workflows/build-executables.yml`)
3. **That's it!** Builds happen automatically

### Manual Trigger:

You can also manually trigger a build:
1. Go to GitHub repo → Actions
2. Click "Build Executables" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait ~5 minutes
5. Download from Artifacts

---

## 📦 What You Get

### Windows Build:
- **File:** `MTA-ASITE-Downloader.exe`
- **Size:** ~30-40 MB
- **Requires:** Windows 10/11 (no Python needed!)

### macOS Build:
- **File:** `MTA-ASITE-Downloader.app`
- **Size:** ~18-20 MB
- **Requires:** macOS 10.13+ (no Python needed!)

---

## 🐛 Troubleshooting

### GitHub Actions Not Running

**Check:**
- Actions are enabled for your repo (Settings → Actions → Allow all actions)
- Workflow file is in `.github/workflows/` folder
- File has `.yml` or `.yaml` extension

### Build Fails on GitHub

1. Check the Actions logs for errors
2. Common issues:
   - Missing dependencies in `requirements.txt`
   - Syntax errors in spec file
   - Python version incompatibility

### Windows .exe Shows Security Warning

This is normal for unsigned executables. Users will see:
> "Windows protected your PC"

**Users should:**
1. Click "More info"
2. Click "Run anyway"

**To avoid this warning:** Sign the .exe with a code signing certificate (~$100-$400/year)

---

## 🔄 Updating the Build

When you update your code:

### For GitHub Actions:
```bash
git add .
git commit -m "Your update message"
git push origin main
```
→ Automatically rebuilds!

### For Local Build:
```cmd
pyinstaller build_exe_windows.spec --clean
```

---

## 📊 Comparison

| Method | Pros | Cons |
|--------|------|------|
| **GitHub Actions** | Free, automatic, both platforms | Requires GitHub, 5-10 min wait |
| **Local Windows** | Immediate, full control | Need Windows machine |

---

## 🎉 You're All Set!

**Your setup includes:**
- ✅ Automatic Windows builds via GitHub Actions
- ✅ Automatic macOS builds via GitHub Actions
- ✅ Manual build scripts for both platforms
- ✅ Automatic release creation with tags

**Next steps:**
1. Push to GitHub
2. Check the Actions tab
3. Download your Windows .exe from Artifacts!

---

## 💡 Pro Tips

1. **Use tags for versions:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   → Creates a release with both executables!

2. **Test locally first** before pushing (use the local Mac build)

3. **Check Actions logs** if build fails - they're very detailed

4. **Free for public repos** - unlimited builds!

---

**Current Status:**
✅ GitHub Actions workflow created
✅ Windows spec file ready
✅ macOS spec file ready
✅ Ready to push and build!
