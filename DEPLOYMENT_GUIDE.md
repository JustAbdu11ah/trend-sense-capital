# Deployment Guide for Trend Sense Capital

## Project Overview

Your project consists of:
1. **Frontend**: React + TypeScript + Vite application
2. **Backend**: Firebase (Firestore, Authentication, Analytics)
3. **Python Scripts**: Data scraping and ML prediction scripts (run separately)

## Architecture

- **Frontend**: Client-side React app that connects directly to Firebase
- **No separate backend server needed** - everything runs through Firebase
- **Python scripts** are utilities that can run on a schedule to populate Firebase

---

## 🚀 EASIEST DEPLOYMENT OPTION: Firebase Hosting + Cloud Functions

Since you're already using Firebase, this is the most straightforward approach.

### Step 1: Deploy Frontend to Firebase Hosting

#### Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

#### Initialize Firebase Hosting
```bash
# In your project root
firebase init hosting

# Select:
# - Use existing project: trend-sense-capital
# - Public directory: dist
# - Single-page app: Yes
# - Set up automatic builds: No (or Yes if using GitHub)
```

#### Build and Deploy
```bash
# Build your React app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Your app will be live at: `https://trend-sense-capital.web.app`

### Step 2: Deploy Python Scripts as Cloud Functions (Optional)

For the Python scripts (`Predicitions.py`, `News_Scrapper.py`, `reddit_scraper.py`), you have options:

#### Option A: Firebase Cloud Functions (Recommended)
```bash
# Initialize functions
firebase init functions

# Select Python runtime
# Install dependencies in functions/requirements.txt
```

#### Option B: Run on Schedule (Easier)
Use GitHub Actions, Railway, or Render to run scripts on a schedule.

---

## 🎯 Alternative: Vercel (Easiest for Frontend Only)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
# Build first
npm run build

# Deploy
vercel

# Or connect GitHub repo for automatic deployments
```

**Pros:**
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Free tier is generous
- ✅ Automatic deployments from GitHub

**Cons:**
- ❌ Python scripts need separate hosting

---

## 🐳 Alternative: Netlify (Also Very Easy)

### Step 1: Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or connect your GitHub repo in Netlify dashboard.

---

## 📦 Python Scripts Deployment Options

### Option 1: Railway (Easiest for Python)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add your Python scripts
4. Set up scheduled runs using Railway's cron jobs

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create a Background Worker
3. Add your Python dependencies in `requirements.txt`
4. Set up cron schedule

### Option 3: GitHub Actions (Free)
Create `.github/workflows/run-scripts.yml`:
```yaml
name: Run Python Scripts

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  run-scripts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      - name: Run predictions
        run: |
          python src/data/Predicitions.py
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
```

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- ✅ Firebase config is already in code (consider moving to env vars for production)
- ✅ `serviceAccountKey.json` should be in `.gitignore` (add it if not)

### 2. Build Configuration
- ✅ Update `vite.config.ts` if needed for production
- ✅ Check `package.json` build script

### 3. Security
- ✅ Add `serviceAccountKey.json` to `.gitignore`
- ✅ Consider using Firebase environment variables for sensitive data
- ✅ Review Firebase security rules

### 4. Python Dependencies
Create `requirements.txt` in project root:
```txt
torch
transformers
numpy
firebase-admin
requests
beautifulsoup4
feedparser
textblob
vaderSentiment
yfinance
```

---

## 🔧 Recommended: Complete Setup with Firebase

### 1. Update `.gitignore`
Add:
```
serviceAccountKey.json
.env
.env.local
*.pyc
__pycache__/
```

### 2. Create `firebase.json`
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 3. Deploy Everything
```bash
# Build frontend
npm run build

# Deploy hosting
firebase deploy --only hosting

# If you set up functions
firebase deploy --only functions
```

---

## 🎯 My Recommendation: **Firebase Hosting**

**Why?**
1. ✅ You're already using Firebase
2. ✅ Single platform for everything
3. ✅ Free tier includes hosting
4. ✅ Easy to set up
5. ✅ Automatic SSL/HTTPS
6. ✅ CDN included

**Steps:**
1. `npm install -g firebase-tools`
2. `firebase login`
3. `firebase init hosting` (select dist folder)
4. `npm run build`
5. `firebase deploy --only hosting`

**For Python scripts:** Use GitHub Actions (free) or Railway ($5/month) to run them on a schedule.

---

## 📝 Quick Start Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build your app
npm run build

# Deploy
firebase deploy --only hosting
```

Your app will be live in minutes! 🚀

---

## 🔗 Useful Links

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)

---

## ⚠️ Important Notes

1. **serviceAccountKey.json**: Make sure this file is NOT in your repository. Add it to `.gitignore` and use environment variables in production.

2. **Firebase Config**: Consider moving Firebase config to environment variables for better security.

3. **Python Scripts**: These need to run separately - they're not part of the web app. Deploy them as scheduled jobs.

4. **Build Output**: Vite builds to `dist/` folder by default, which is what you'll deploy.

