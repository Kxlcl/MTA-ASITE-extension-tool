#!/bin/bash
# Simple build script for MTA ASITE Downloader

echo "🔨 Building MTA ASITE Downloader..."
echo ""

# Activate virtual environment
source venv/bin/activate

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/ dist/

# Build with PyInstaller
echo "📦 Building executable..."
pyinstaller build_exe.spec --clean

# Check if build succeeded
if [ -d "dist/MTA-ASITE-Downloader.app" ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📍 Location: dist/MTA-ASITE-Downloader.app"
    echo "📏 Size: $(du -sh dist/MTA-ASITE-Downloader.app | cut -f1)"
    echo ""
    echo "🚀 To run: Double-click dist/MTA-ASITE-Downloader.app"
    echo "📦 To distribute: Copy the entire .app bundle"
else
    echo ""
    echo "❌ Build failed! Check the output above for errors."
    exit 1
fi
