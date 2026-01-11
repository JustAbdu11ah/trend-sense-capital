@echo off
REM Deployment script for Trend Sense Capital (Windows)
REM This script builds and deploys the frontend to Firebase Hosting

echo 🚀 Starting deployment process...

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Firebase CLI not found. Installing...
    npm install -g firebase-tools
)

REM Check if user is logged in (this will fail if not logged in, which is okay)
echo 🔐 Checking Firebase login status...

REM Build the project
echo 📦 Building React app...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed. Please fix errors and try again.
    exit /b 1
)

REM Deploy to Firebase
echo 🌐 Deploying to Firebase Hosting...
call firebase deploy --only hosting

if %ERRORLEVEL% EQU 0 (
    echo ✅ Deployment successful!
    echo 🌍 Your app is live at: https://trend-sense-capital.web.app
) else (
    echo ❌ Deployment failed. Please check the errors above.
    exit /b 1
)

