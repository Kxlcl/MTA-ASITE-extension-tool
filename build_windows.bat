@echo off
REM Build script for Windows executable

echo ========================================
echo   MTA ASITE Downloader - Windows Build
echo ========================================
echo.

echo [1/3] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Cleaning previous builds...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

echo.
echo [3/3] Building executable...
pyinstaller build_exe_windows.spec --clean
if errorlevel 1 (
    echo.
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Location: dist\MTA-ASITE-Downloader.exe
echo.

if exist dist\MTA-ASITE-Downloader.exe (
    for %%I in (dist\MTA-ASITE-Downloader.exe) do echo Size: %%~zI bytes
    echo.
    echo Creating distribution ZIP...
    powershell -Command "Compress-Archive -Path dist\MTA-ASITE-Downloader.exe -DestinationPath MTA-ASITE-Downloader-Windows.zip -Force"
    if errorlevel 1 (
        echo Failed to create ZIP
    ) else (
        echo ZIP created: MTA-ASITE-Downloader-Windows.zip
    )
) else (
    echo ERROR: Executable not found!
    pause
    exit /b 1
)

echo.
echo To test: dist\MTA-ASITE-Downloader.exe
echo To distribute: MTA-ASITE-Downloader-Windows.zip
echo.
pause
