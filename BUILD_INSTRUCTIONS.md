# Building Standalone Executable

## Quick Build (Mac)

```bash
source venv/bin/activate
pyinstaller build_exe.spec --clean
```

The app will be created in `dist/MTA-ASITE-Downloader.app`

## Distribution

### For Mac Users
1. Copy `dist/MTA-ASITE-Downloader.app` to the user
2. User double-clicks to run (no Python installation needed!)

### For Windows Users
You'll need to build on a Windows machine:

1. Install Python 3.7+ on Windows
2. Install dependencies:
   ```cmd
   pip install pyinstaller azure-identity azure-storage-blob
   ```
3. Modify `build_exe.spec`:
   - Remove the `BUNDLE` section at the bottom (Mac only)
   - Change `console=False` to `console=True` for debugging
4. Build:
   ```cmd
   pyinstaller build_exe.spec --clean
   ```
5. Executable will be at `dist/MTA-ASITE-Downloader.exe`

## File Size
- Mac: ~18MB (includes Python runtime + Azure libraries)
- Windows: ~25-30MB expected

## First Run Notes

### macOS Security Warning
When users first run the app on Mac, they may see:
> "MTA-ASITE-Downloader.app can't be opened because it is from an unidentified developer"

**Solution:**
1. Right-click the app → "Open"
2. Click "Open" in the dialog
3. Or go to System Preferences → Security & Privacy → Click "Open Anyway"

### Trusted Distribution
To avoid this warning, you can:
1. Sign the app with an Apple Developer certificate ($99/year)
2. Notarize it with Apple
3. Or just distribute with instructions above

## Troubleshooting Build Issues

### Missing Azure modules
If build fails with Azure import errors:
```bash
pip install --upgrade azure-identity azure-storage-blob
```

### Tkinter not found
On Linux:
```bash
sudo apt-get install python3-tk
```

### Build takes too long / fails
Try cleaning cache:
```bash
rm -rf build/ dist/
pyinstaller build_exe.spec --clean
```

## Cross-Platform Builds

**Important:** PyInstaller builds are platform-specific:
- Build on Mac → Mac .app
- Build on Windows → Windows .exe
- Build on Linux → Linux binary

You cannot build a Windows .exe from Mac. Use:
- GitHub Actions for automated multi-platform builds
- Virtual machines (Parallels, VirtualBox, etc.)
- Cloud CI/CD (GitHub Actions, CircleCI, etc.)
