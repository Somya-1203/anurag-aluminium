# 📱 Building APK for Anurag Aluminium App

## 🚀 **Method 1: Using EAS Build (Recommended - Cloud Build)**

This is the **easiest and recommended way** to build your APK. The build happens on Expo's servers.

### **Step 1: Install EAS CLI (Already Done ✅)**

```bash
npm install -g eas-cli
```

### **Step 2: Login to Expo**

You need a free Expo account. If you don't have one, create it at [expo.dev](https://expo.dev)

```bash
cd /app/frontend
eas login
```

Enter your Expo credentials.

### **Step 3: Configure the Project**

```bash
eas build:configure
```

This will ask you a few questions. Choose:
- Platform: **Android**
- Bundle identifier: Press enter to use default

### **Step 4: Build the APK**

```bash
eas build -p android --profile preview
```

**What happens:**
- ✅ Code is uploaded to Expo servers
- ✅ APK is built in the cloud (takes 10-15 minutes)
- ✅ You get a download link

### **Step 5: Download APK**

After build completes, you'll get a URL like:
```
https://expo.dev/artifacts/eas/...apk
```

Download this APK and share it via WhatsApp/Email to your team!

---

## 🎯 **Method 2: Local Build (Advanced)**

If you prefer to build locally on your machine:

### **Prerequisites:**
- Android Studio installed
- Android SDK
- JDK 17

### **Steps:**

```bash
cd /app/frontend

# Step 1: Install expo-dev-client
npx expo install expo-dev-client

# Step 2: Prebuild (generates android folder)
npx expo prebuild --platform android

# Step 3: Build APK
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## ⚙️ **Important: Update Backend URL Before Building**

**CRITICAL:** Before building the APK, update the backend URL in `/app/frontend/.env`:

### **For Production/Cloud Backend:**

```env
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

### **Current (Development):**
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```

**Steps:**

1. **Deploy your Java backend** to a cloud service (Railway, Render, Heroku)
2. **Update `.env`** with the deployed backend URL
3. **Then build APK** so it connects to your live backend

---

## 📝 **Quick Command Reference**

```bash
# Login to Expo
eas login

# Build APK (preview/testing version)
eas build -p android --profile preview

# Build APK (production version)
eas build -p android --profile production

# Check build status
eas build:list

# Download specific build
eas build:download --id BUILD_ID
```

---

## 🔑 **What's Already Configured**

✅ **eas.json** - Build configuration created
✅ **app.json** - App metadata configured
✅ **All dependencies** - Installed and ready

---

## 📦 **After You Get the APK**

1. **Download the APK** file
2. **Share via WhatsApp/Email** to your field experts and admin
3. **Install Instructions for Users:**
   - Download APK to phone
   - Go to Settings → Security → Enable "Install from Unknown Sources"
   - Tap the APK file to install
   - Open "Anurag Aluminium" app
   - Login with credentials

---

## 🎯 **Recommended Workflow**

1. ✅ **Deploy Java Backend First**
   ```bash
   # Deploy to Railway, Render, or any cloud service
   # Get your backend URL (e.g., https://anurag-api.railway.app)
   ```

2. ✅ **Update Frontend .env**
   ```bash
   cd /app/frontend
   # Edit .env
   EXPO_PUBLIC_BACKEND_URL=https://anurag-api.railway.app
   ```

3. ✅ **Build APK**
   ```bash
   eas login
   eas build -p android --profile preview
   ```

4. ✅ **Download & Distribute**
   - Download APK from Expo build page
   - Share to your team via WhatsApp

---

## ❓ **Troubleshooting**

**Q: "eas: command not found"**
```bash
npm install -g eas-cli
```

**Q: "Not logged in"**
```bash
eas login
```

**Q: "Build failed"**
- Check `eas build:list` for error details
- Common issues: Missing permissions, invalid app.json

**Q: "APK too large"**
- Normal size: 30-50MB
- Includes all dependencies

---

## 🎉 **Next Steps**

Ready to build your APK? Run:

```bash
cd /app/frontend
eas login
eas build -p android --profile preview
```

**Estimated time:** 10-15 minutes for cloud build

**Questions?** Let me know if you need help with any step!
