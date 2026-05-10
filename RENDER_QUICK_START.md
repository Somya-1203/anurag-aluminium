# 🎯 RENDER DEPLOYMENT - QUICK REFERENCE

## ⚡ Super Quick Deploy (15 Minutes)

### Step 1: Push to GitHub (3 min)
```bash
cd /app/backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/anurag-aluminium-backend.git
git push -u origin main
```

### Step 2: Deploy on Render (10 min)
1. Go to **render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your repository: `anurag-aluminium-backend`
4. Fill in:
   - **Name**: `anurag-aluminium`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -jar target/aluminium-backend-1.0.0.jar`
   - **Instance Type**: **Free**
5. Add **Environment Variable**:
   - **Key**: `SPRING_DATA_MONGODB_URI`
   - **Value**: `YOUR_MONGODB_CONNECTION_STRING`
6. Click **"Create Web Service"**

### Step 3: Test (2 min)
```bash
# Wait for "Started AnuragAluminiumApplication" in logs

# Test
curl -X POST https://YOUR-APP.onrender.com/api/auth/init

# If you get {"message":"Initialization complete"} → SUCCESS! 🎉
```

---

## 📋 Configuration Summary

### Build Command
```bash
mvn clean package -DskipTests
```

### Start Command
```bash
java -Dserver.port=$PORT -jar target/aluminium-backend-1.0.0.jar
```

### Environment Variable
```
Key: SPRING_DATA_MONGODB_URI
Value: mongodb+srv://user:pass@cluster.mongodb.net/anurag_aluminium?retryWrites=true&w=majority
```

### Health Check (Optional)
```
/api/auth/init
```

---

## 🧪 Test Commands

```bash
# Initialize
curl -X POST https://YOUR-APP.onrender.com/api/auth/init

# Login
curl -X POST https://YOUR-APP.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get Window Types
curl https://YOUR-APP.onrender.com/api/window-types
```

---

## ✅ Success Indicators

**In Render Logs, you should see:**
```
[build] BUILD SUCCESS
[start] Started AnuragAluminiumApplication in X seconds
```

**When testing:**
```json
{"message":"Initialization complete"}
{"id":"...","username":"admin","role":"admin","name":"Admin User"}
```

---

## 🎯 Your Backend URL

After deployment, you'll get:
```
https://anurag-aluminium.onrender.com
```

**Save this URL!** You'll need it for:
- Mobile app configuration
- API testing
- APK building

---

## 💡 Pro Tips

1. **Auto-deploy**: Push to GitHub → Render auto-deploys
2. **Logs**: Check real-time in Render dashboard
3. **Wake-up**: First request after sleep takes ~30 sec
4. **Free tier**: 750 hours/month (plenty for your app)

---

## 🆘 Quick Troubleshooting

**Build Failed?**
- Check Maven errors in logs
- Verify `pom.xml` is correct

**App Not Starting?**
- Check `SPRING_DATA_MONGODB_URI` is set
- Verify MongoDB connection string
- Check logs for errors

**502 Error?**
- Wait 1-2 minutes (app is starting)
- Check if MongoDB Atlas whitelists 0.0.0.0/0
- Verify environment variable format

---

## ⏭️ Next Steps

After successful deployment:

1. ✅ Copy your Render URL
2. ✅ Update `/app/frontend/.env`:
   ```
   EXPO_PUBLIC_BACKEND_URL=https://anurag-aluminium.onrender.com
   ```
3. ✅ Build APK:
   ```bash
   cd /app/frontend
   eas login
   eas build -p android --profile preview
   ```

---

**Need detailed instructions?** See `/app/RENDER_DEPLOYMENT_GUIDE.md`

**Ready? Let's deploy!** 🚀
