# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec file for MTA ASITE Downloader

block_cipher = None

a = Analysis(
    ['asite_downloader_gui.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=[
        'azure.identity',
        'azure.identity._credentials',
        'azure.identity._credentials.browser',
        'azure.identity._internal',
        'azure.identity._internal.decorators',
        'azure.identity._internal.get_token_mixin',
        'azure.storage.blob',
        'azure.storage.blob._blob_client',
        'azure.storage.blob._container_client',
        'azure.storage.blob._blob_service_client',
        'azure.core',
        'azure.core.credentials',
        'azure.core.pipeline',
        'msal',
        'msal.application',
        'msal.authority',
        'cryptography',
        'cryptography.hazmat.backends',
        'cryptography.hazmat.primitives',
        'jwt',
        'certifi',
        'urllib3',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='MTA-ASITE-Downloader',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # Set to False to hide console window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

# For macOS, create .app bundle
app = BUNDLE(
    exe,
    name='MTA-ASITE-Downloader.app',
    icon=None,
    bundle_identifier='com.mta.asitedownloader',
)
