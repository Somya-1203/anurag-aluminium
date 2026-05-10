# 🚀 Complete Deployment Guide - Anurag Aluminium App

## 📋 Overview

This guide will help you deploy your complete application:
1. ✅ MongoDB Atlas (Database)
2. ✅ Java Backend (Railway)
3. ✅ Build APK (Expo)

**Total Time: ~30 minutes**

---

## 🎯 Phase 1: Setup MongoDB Atlas (10 minutes)

### Quick Steps:

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (FREE, no credit card)
3. **Create Cluster:**
   - Choose **M0 FREE** tier
   - Region: Closest to you (Mumbai/Singapore for India)
   - Name: `anurag-aluminium`

4. **Create Database User:**
   - Click "Database Access" → "Add New Database User"
   - Username: `anurag_admin`
   - Password: **Auto-generate** (SAVE THIS!)
   - Role: Atlas Admin

5. **Whitelist IPs:**
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (adds 0.0.0.0/0)

6. **Get Connection String:**
   - Click "Database" → "Connect" → "Drivers"
   - Choose Java
   - Copy connection string
   - Replace `<password>` with your actual password
   - Add database name: `/anurag_aluminium`

**Final format:**
```
mongodb+srv://anurag_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/anurag_aluminium?retryWrites=true&w=majority
```

**✅ SAVE THIS CONNECTION STRING!**

---

## 🎯 Phase 2: Deploy Backend to Railway (10 minutes)

### Option A: Direct Deploy (Easiest)

1. **Go to:** https://railway.app
2. **Sign up** with GitHub (free $5 credit/month)
3. Click **"Start a New Project"**
4. Click **"Empty Project"**
5. Click **"Create"**

### Upload Backend:

**Method 1: Using Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Go to backend folder
cd /app/backend

# Initialize project
railway init

# Link to your Railway project
railway link

# Add MongoDB connection
railway variables set SPRING_DATA_MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"

# Deploy!
railway up
```

**Method 2: GitHub Deploy**

```bash
# Push to GitHub first
cd /app/backend
git init
git add .
git commit -m "Backend code"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# Then in Railway:
# - New Project → Deploy from GitHub repo
# - Select your repository
# - Add environment variable: SPRING_DATA_MONGODB_URI
```

### Get Your Backend URL:

```bash
railway domain
```

Or in Railway dashboard:
- Go to your service
- Click "Settings"
- Under "Domains" → "Generate Domain"

**You'll get:** `https://anurag-aluminium-production.up.railway.app`

**✅ SAVE THIS URL!**

### Test Your Backend:

```bash
# Initialize data
curl -X POST https://YOUR-URL.railway.app/api/auth/init

# Test login
curl -X POST https://YOUR-URL.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

If you get a response, **backend is live!** 🎉

---

## 🎯 Phase 3: Update Mobile App (2 minutes)

### Update Backend URL:

Edit `/app/frontend/.env`:

```env
EXPO_PUBLIC_BACKEND_URL=https://YOUR-RAILWAY-URL.railway.app
```

**Example:**
```env
EXPO_PUBLIC_BACKEND_URL=https://anurag-aluminium-production.up.railway.app
```

**Save the file!**

---

## 🎯 Phase 4: Build APK (10 minutes)

### Prerequisites:
- Expo account (create free at expo.dev)

### Build Steps:

```bash
cd /app/frontend

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

**What happens:**
1. Code uploads to Expo servers
2. APK builds in cloud (10-15 min)
3. You get download link

### Download APK:

After build completes:
- Click the link provided
- Download APK file
- Share via WhatsApp/Email to your team!

---

## 📱 Installing APK on Android Phones

### For Your Team:

1. **Send APK** via WhatsApp/Email
2. **Download** on Android phone
3. **Enable** "Install from Unknown Sources":
   - Settings → Security → Unknown Sources → Enable
4. **Tap APK** file to install
5. **Open** "Anurag Aluminium" app
6. **Login:**
   - Admin: `admin` / `admin123`
   - Field Expert: `expert` / `expert123`

---

## ✅ Checklist

Before you start, make sure you have:

- [ ] MongoDB Atlas account
- [ ] Railway account (or Render/Heroku)
- [ ] Expo account
- [ ] GitHub account (optional, for Railway GitHub deploy)

---

## 🎯 Quick Command Summary

```bash
# Phase 1: MongoDB Atlas
# Do this via web interface (no commands)

# Phase 2: Deploy Backend
npm install -g @railway/cli
railway login
cd /app/backend
railway init
railway variables set SPRING_DATA_MONGODB_URI="mongodb+srv://..."
railway up
railway domain

# Phase 3: Update Frontend
cd /app/frontend
# Edit .env file with backend URL

# Phase 4: Build APK
eas login
eas build -p android --profile preview
```

---

## 💰 Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| MongoDB Atlas | **FREE** | 512MB M0 tier |
| Railway | **$5/month** | Includes $5 free credit |
| Expo Build | **FREE** | Unlimited builds |
| **Total** | **~$0-5/month** | Essentially free! |

---

## 🆘 Troubleshooting

### "MongoDB connection failed"
- Check connection string format
- Verify password is correct
- Ensure 0.0.0.0/0 is whitelisted

### "Railway deploy failed"
- Check logs in Railway dashboard
- Ensure MONGO_URL variable is set
- Verify JAR file exists in target/

### "APK build failed"
- Check `eas build:list` for errors
- Ensure app.json is valid
- Try `eas build:configure` again

### "APK won't install"
- Enable "Unknown Sources" on Android
- Download APK again (might be corrupted)

---

## 📞 Support

If you get stuck:
1. Check detailed guides:
   - `/app/MONGODB_ATLAS_SETUP.md`
   - `/app/RAILWAY_DEPLOYMENT.md`
   - `/app/BUILD_APK_GUIDE.md`

2. Let me know where you're stuck and I'll help!

---

## 🎉 You're All Set!

After completing all phases:
✅ Backend deployed and live
✅ Database running in cloud
✅ APK built and ready to install
✅ Team can start using the app!

**Need help with any step? Just ask!** 🚀
