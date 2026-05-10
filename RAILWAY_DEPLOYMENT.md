# 🚀 Deploy Java Backend to Railway

## Railway.app - Free Java Backend Hosting

Railway offers **$5 free credit per month** which is enough for your backend!

---

## 📋 Prerequisites

✅ MongoDB Atlas connection string (from previous step)
✅ GitHub account
✅ Your backend code ready

---

## Step-by-Step Deployment

### Option 1: Deploy from GitHub (Recommended)

#### Step 1: Create GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `anurag-aluminium-backend`
3. Make it **Private**
4. Click **"Create repository"**

#### Step 2: Push Backend Code to GitHub

```bash
cd /app/backend

# Initialize git
git init
git add .
git commit -m "Initial commit - Anurag Aluminium Backend"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/anurag-aluminium-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Deploy to Railway

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign in with GitHub
4. Click **"Deploy from GitHub repo"**
5. Select your repository: `anurag-aluminium-backend`
6. Railway will auto-detect it's a **Java/Maven** project
7. Click **"Deploy Now"**

#### Step 4: Add Environment Variables

1. Go to your project in Railway
2. Click on your service
3. Click **"Variables"** tab
4. Add this variable:

```
SPRING_DATA_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anurag_aluminium?retryWrites=true&w=majority
```

(Replace with YOUR actual MongoDB Atlas connection string)

5. Railway will automatically restart with new environment

#### Step 5: Get Your Backend URL

1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://anurag-aluminium-production.up.railway.app`

**Save this URL - you'll need it for the mobile app!**

---

### Option 2: Deploy Directly (Without GitHub)

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Login to Railway

```bash
railway login
```

This opens a browser to authenticate.

#### Step 3: Deploy Backend

```bash
cd /app/backend

# Initialize Railway project
railway init

# Add MongoDB environment variable
railway variables set SPRING_DATA_MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/anurag_aluminium?retryWrites=true&w=majority"

# Deploy
railway up
```

#### Step 4: Get Your URL

```bash
railway domain
```

This generates and shows your backend URL.

---

## 🧪 Test Your Deployed Backend

Once deployed, test it:

```bash
# Initialize database (creates users, window types)
curl -X POST https://YOUR-BACKEND-URL.railway.app/api/auth/init

# Test login
curl -X POST https://YOUR-BACKEND-URL.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get window types
curl https://YOUR-BACKEND-URL.railway.app/api/window-types
```

If you get responses, **your backend is live! 🎉**

---

## 📝 Railway Configuration (Optional)

Create `railway.json` in your backend folder:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "mvn clean package -DskipTests"
  },
  "deploy": {
    "startCommand": "java -jar target/aluminium-backend-1.0.0.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 💰 Railway Pricing

- **Free Tier**: $5 credit/month (enough for small apps)
- **Cost**: ~$0.000231/minute for your backend
- **Estimated**: ~$5-10/month for light usage
- **Sleep after 1 hour** of inactivity (free tier)

---

## 🔍 Monitor Your Backend

In Railway dashboard:
- **Deployments** tab: See build logs
- **Metrics** tab: See CPU/memory usage
- **Logs** tab: See application logs

---

## ✅ What You Should Have Now

✅ Backend deployed to Railway
✅ Public URL for your backend
✅ MongoDB Atlas connected
✅ All APIs accessible

---

## ⏭️ Next Step

**Copy your Railway backend URL** and update the mobile app!

Example URL:
```
https://anurag-aluminium-production.up.railway.app
```

Ready? Let me know your backend URL and I'll update the mobile app!
