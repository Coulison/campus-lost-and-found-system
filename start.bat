@echo off
title Campus Lost & Found System
cd /d "%~dp0"
echo ===================================================
echo   Campus Lost & Found System - Local Server
echo   Running at: http://localhost:5173
echo ===================================================
echo.
echo Opening browser...
start http://localhost:5173
echo.
echo Server is running. Keep this window open while using the app!
echo (Press Ctrl+C to stop the server)
echo.
powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0server.ps1"
pause
