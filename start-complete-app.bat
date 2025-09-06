@echo off
echo ========================================
echo   🚀 Service Navigator - Complete Setup
echo ========================================
echo.

echo 📋 Features Included:
echo    ✅ AI-Powered Chatbot with Gemini API
echo    ✅ Auto-Navigation to Services
echo    ✅ Form Navigation Prompts
echo    ✅ Home Page Navigation Commands
echo    ✅ Scroll Lock (No Background Scroll)
echo    ✅ External Reference Links
echo    ✅ Responsive Modern UI
echo.

echo 🔧 Starting Backend Server...
cd server
start "🔧 Backend Server" cmd /c "npm start & echo. & echo Backend running on http://localhost:5001 & echo Press any key to close this window... & pause >nul"
timeout /t 5

echo 🎨 Starting Frontend Application...
cd ..\client
start "🎨 Frontend App" cmd /c "npm start & echo. & echo Frontend running on http://localhost:3000 & echo Press any key to close this window... & pause >nul"

echo.
echo ✨ Application Starting Up!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5001
echo.
echo 🤖 Test the Chatbot with:
echo    - "I need a plumber" (auto-navigates + form prompt)
echo    - "math tutoring" (auto-navigates + form prompt)  
echo    - "go back home" (navigates to home page)
echo    - "random question" (shows external links)
echo.
echo 🎯 New Features:
echo    1. Scroll Lock: Background won't scroll when chatbot is open
echo    2. Form Navigation: After service match, bot asks to fill contact form
echo    3. Home Commands: Say "go home" or "go back" to return to main page
echo.
pause
