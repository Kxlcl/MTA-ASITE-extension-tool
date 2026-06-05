#!/bin/bash
# Launcher script for MTA ASITE Downloader GUI

cd "$(dirname "$0")"
source venv/bin/activate
python3 asite_downloader_gui.py
