# 🚀 Deploy Java Backend to Render

## Why Render?

- ✅ **Free Tier**: 750 hours/month (enough for your app)
- ✅ **Auto-deploy**: Connects directly to GitHub
- ✅ **Easy setup**: Simple web interface
- ✅ **Auto-sleep**: Spins down after 15 min inactivity (free tier)
- ✅ **Fast wake-up**: ~30 seconds to wake from sleep

---

## 📋 Prerequisites

✅ MongoDB Atlas connection string (from previous setup)
✅ GitHub account
✅ Your backend code ready

---

## Step-by-Step Deployment

### Step 1: Push Backend to GitHub

First, let's push your backend code to GitHub:

```bash
cd /app/backend

# Initialize git
git init
git add .
git commit -m "Initial commit - Anurag Aluminium Backend"

# Create GitHub repository
# Go to: https://github.com/new
# Repository name: anurag-aluminium-backend
# Make it Public or Private
# Don't initialize with README

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/anurag-aluminium-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

### Step 2: Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access GitHub

---

### Step 3: Create New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: `anurag-aluminium-backend`
5. Click **"Connect"**

---

### Step 4: Configure Service

Fill in the following details:

#### Basic Settings:
- **Name**: `anurag-aluminium` (or any name you want)
- **Region**: Select closest to you (Singapore for Asia, Oregon for US)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: Render will auto-detect **Java**

#### Build Settings:
- **Build Command**: 
  ```bash
  mvn clean package -DskipTests
  ```

- **Start Command**:
  ```bash
  java -Dserver.port=$PORT -jar target/aluminium-backend-1.0.0.jar
  ```

#### Instance Settings:
- **Instance Type**: Select **"Free"** ($0/month)

---

### Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section:

Click **"Add Environment Variable"** and add:

**Key:**
```
SPRING_DATA_MONGODB_URI
```

**Value:**
```
mongodb+srv://username:password@cluster.mongodb.net/anurag_aluminium?retryWrites=true&w=majority
```

(Replace with YOUR actual MongoDB Atlas connection string)

**Important:** Click **"Add"** to save the variable!

---

### Step 6: Add Health Check (Important for Free Tier)

Scroll to **"Health Check Path"** (optional but recommended):

**Health Check Path:**
```
/api/auth/init
```

This ensures Render can check if your app is running.

---

### Step 7: Deploy!

1. Click **"Create Web Service"** at the bottom
2. Render will start building your app

**What happens:**
- ✅ Clones your GitHub repo
- ✅ Runs Maven build
- ✅ Installs dependencies
- ✅ Creates JAR file
- ✅ Starts your Spring Boot app

**Time: 5-10 minutes** ⏳

---

### Step 8: Monitor Deployment

You'll see logs in real-time:

```
==> Building...
[build] Installing Maven...
[build] Running mvn clean package -DskipTests
[build] BUILD SUCCESS
==> Starting service...
[start] Started AnuragAluminiumApplication in X seconds
```

**When you see:** `"Started AnuragAluminiumApplication"` - **Your backend is LIVE!** 🎉

---

### Step 9: Get Your Backend URL

At the top of the page, you'll see your URL:

```
https://anurag-aluminium.onrender.com
```

**✅ SAVE THIS URL!**

---

## 🧪 Test Your Deployed Backend

Open a new terminal and test:

```bash
# Initialize database (creates users, window types)
curl -X POST https://anurag-aluminium.onrender.com/api/auth/init

# Expected response:
{"message":"Initialization complete"}

# Test login
curl -X POST https://anurag-aluminium.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected response:
{"id":"...","username":"admin","role":"admin","name":"Admin User"}

# Get window types
curl https://anurag-aluminium.onrender.com/api/window-types

# Expected: Array of 8 window types
```

**If you get responses, your backend is working!** 🎉

---

## 🔄 Auto-Deploy on Code Changes

Once set up, Render automatically deploys when you push to GitHub:

```bash
cd /app/backend

# Make changes to your code
# ...

# Commit and push
git add .
git commit -m "Updated feature"
git push

# Render automatically rebuilds and deploys!
```

---

## ⚙️ Important Render Configuration

### Create `render.yaml` (Optional but Recommended)

Create a file `/app/backend/render.yaml`:

```yaml
services:
  - type: web
    name: anurag-aluminium
    runtime: java
    buildCommand: mvn clean package -DskipTests
    startCommand: java -Dserver.port=$PORT -jar target/aluminium-backend-1.0.0.jar
    envVars:
      - key: SPRING_DATA_MONGODB_URI
        sync: false
    healthCheckPath: /api/auth/init
```

This makes deployment configuration version-controlled.

---

## 📊 Render Dashboard Features

### 1. Logs Tab
View real-time application logs:
- Request logs
- Error messages
- Spring Boot startup logs

### 2. Metrics Tab
Monitor your app:
- CPU usage
- Memory usage
- Request count

### 3. Environment Tab
Manage environment variables:
- Add/edit MongoDB URL
- Add other secrets

### 4. Events Tab
See deployment history:
- Build logs
- Deploy status
- Errors

---

## 🆓 Render Free Tier Details

**What You Get:**
- ✅ 750 hours/month free
- ✅ Automatic HTTPS
- ✅ Continuous deployment from GitHub
- ✅ Auto-scaling (within free tier)

**Limitations:**
- ⚠️ Spins down after 15 min of inactivity
- ⚠️ Takes ~30 seconds to wake up (first request)
- ⚠️ 512MB RAM

**Perfect for your use case!** Field experts won't notice the wake-up delay.

---

## 🔧 Troubleshooting

### Issue: "Build Failed"

**Check:**
1. Go to **Logs** tab
2. Look for Maven errors
3. Common issues:
   - Missing dependencies in `pom.xml`
   - Java version mismatch
   - Build timeout

**Fix:**
```bash
# Test build locally first
cd /app/backend
mvn clean package -DskipTests

# If it works locally, push to GitHub
git add .
git commit -m "Fix build"
git push
```

### Issue: "Application Not Starting"

**Check Logs for:**
- MongoDB connection errors
- Port binding issues
- Missing environment variables

**Fix:**
1. Verify `SPRING_DATA_MONGODB_URI` is set correctly
2. Check MongoDB Atlas whitelist (0.0.0.0/0)
3. Verify connection string format

### Issue: "502 Bad Gateway"

**Possible causes:**
- App is still starting (wait 1-2 minutes)
- App crashed during startup (check logs)
- MongoDB connection failed

**Fix:**
1. Check **Logs** tab for errors
2. Manually trigger redeploy (Settings → Manual Deploy)
3. Verify environment variables

### Issue: "Database Connection Failed"

**Check:**
1. MongoDB Atlas connection string is correct
2. Password doesn't have special characters that need encoding
3. IP whitelist includes 0.0.0.0/0
4. Database name is included in connection string

**Fix:**
```
# Correct format:
mongodb+srv://user:pass@cluster.mongodb.net/anurag_aluminium?retryWrites=true&w=majority
                                                  ^^^ Must include database name
```

---

## 🚀 Advanced: Custom Domain (Optional)

If you want a custom domain:

1. Buy a domain (e.g., anuragaluminium.com)
2. In Render: Settings → Custom Domains
3. Add your domain
4. Update DNS records (Render will show instructions)
5. Free SSL certificate included!

---

## 💡 Performance Tips

### 1. Keep Backend Awake
Use a cron job to ping your backend every 14 minutes:

```bash
# Use cron-job.org or similar service
# Ping: https://anurag-aluminium.onrender.com/api/auth/init
# Every 14 minutes
```

This prevents free tier from sleeping (optional).

### 2. Optimize JAR Size
Already optimized! Your JAR is 27MB which is perfect.

### 3. Enable Compression
Add to `application.properties`:
```properties
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain
```

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] All IPs whitelisted (0.0.0.0/0)
- [ ] Backend code pushed to GitHub
- [ ] Render account created
- [ ] Web service configured
- [ ] Environment variable `SPRING_DATA_MONGODB_URI` set
- [ ] Build and start commands set
- [ ] Service deployed successfully
- [ ] APIs tested with curl

---

## 🎯 Quick Deploy Checklist

```bash
# 1. Push to GitHub
cd /app/backend
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# 2. Go to Render.com
# - Sign up with GitHub
# - New Web Service
# - Connect repository
# - Configure (see Step 4)
# - Add environment variable
# - Click "Create Web Service"

# 3. Wait for deployment (5-10 min)

# 4. Test
curl -X POST https://YOUR-APP.onrender.com/api/auth/init

# 5. Copy URL
YOUR_BACKEND_URL=https://YOUR-APP.onrender.com
```

---

## 🎉 What's Next?

After successful deployment:

1. ✅ Copy your Render URL
2. ✅ Update mobile app `.env`:
   ```env
   EXPO_PUBLIC_BACKEND_URL=https://anurag-aluminium.onrender.com
   ```
3. ✅ Build APK with `eas build`
4. ✅ Distribute to your team!

---

## 📞 Need Help?

If you face any issues:
1. Check **Logs** tab in Render dashboard
2. Test MongoDB connection string locally
3. Verify all environment variables
4. Let me know the error and I'll help debug!

---

## 🎊 You're All Set!

Your Java backend is now deployed to Render! 

**Your backend URL:**
```
https://YOUR-APP-NAME.onrender.com
```

**Save this URL and use it in your mobile app!**

Ready to update the mobile app and build APK? Let me know! 🚀
