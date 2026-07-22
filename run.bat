@echo off
title HorseSquare Pakistan Launcher
echo ===================================================
echo 🐎 Starting HorseSquare Pakistan Development Servers...
echo ===================================================

:: Start Backend (Server)
echo 🚀 Starting Backend (Node.js/Express) in a new window...
start "HorseSquare Backend Server" cmd /k "cd /d \"%~dp0server\" && npm run dev"

:: Start Frontend (Client)
echo 🎨 Starting Frontend (Vite/React) in a new window...
start "HorseSquare Frontend Client" cmd /k "cd /d \"%~dp0client\" && npm run dev"

echo ---------------------------------------------------
echo ✅ Both servers have been launched in separate windows!
echo 🛠️  Backend URL:  http://localhost:5000
echo 🎨 Frontend URL: http://localhost:5173
echo ===================================================
pause
