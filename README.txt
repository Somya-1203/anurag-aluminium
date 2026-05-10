# 🚀 Anurag Aluminium App - Setup Instructions

## 📦 What's Included

This ZIP file contains the complete source code for **Anurag Aluminium & Glass House Window Estimation App**.

```
anurag-aluminium-app/
├── backend/              # FastAPI Python backend
│   ├── server.py        # Main API server
│   ├── requirements.txt # Python dependencies
│   └── .env            # Environment variables (update MongoDB URL here)
├── frontend/            # React Native Expo mobile app
│   ├── app/            # All screens and routes
│   ├── store/          # State management (Zustand)
│   ├── utils/          # Helper functions (API, PDF, measurements)
│   ├── package.json    # Node dependencies
│   └── .env           # Frontend environment variables
└── PROJECT_README.md   # Detailed documentation
```

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Python 3.11+** ([Download](https://python.org/))
- **MongoDB** (Local or [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas))
- **Yarn** (Install: `npm install -g yarn`)

---

### Step 1: Extract the ZIP

```bash
unzip anurag-aluminium-app-source.zip
cd anurag-aluminium-app
```

---

### Step 2: Setup Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Update MongoDB URL in .env
# Default: mongodb://localhost:27017/anurag_aluminium
# Or use MongoDB Atlas connection string

# Start backend server
python server.py
```

**Backend will run on:** `http://localhost:8001`

---

### Step 3: Setup Frontend

```bash
cd ../frontend

# Install dependencies
yarn install

# Start Expo development server
yarn start
```

**Frontend will run on:** `http://localhost:3000`

---

### Step 4: Initialize Database

Open a new terminal and run:

```bash
curl -X POST http://localhost:8001/api/auth/init
```

This creates:
- Default admin user (username: `admin`, password: `admin123`)
- Default field expert user (username: `expert`, password: `expert123`)
- 8 predefined window types
- Default settings

---

### Step 5: Test the App

**Option 1: Web Browser (Quickest)**
- Open `http://localhost:3000` in your browser
- Login with admin or expert credentials

**Option 2: Mobile Device (Recommended)**
- Install **Expo Go** app from Play Store/App Store
- Scan the QR code shown in terminal
- App opens in Expo Go

**Option 3: Android Emulator/iOS Simulator**
```bash
yarn android  # For Android
yarn ios      # For iOS (Mac only)
```

---

## 🔑 Default Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full admin panel, view all estimates, set rates, generate PDFs

### Field Expert Account
- **Username:** `expert`
- **Password:** `expert123`
- **Access:** Add measurements only, cannot see rates/pricing

---

## 📱 Building APK for Distribution

### Option 1: Using EAS Build (Recommended)

```bash
cd frontend

# Install EAS CLI
npm install -g eas-cli

# Login to Expo account (create free account at expo.dev)
eas login

# Configure project
eas build:configure

# Build Android APK
eas build -p android --profile preview

# Download APK from the provided link
# Share APK file to your users via WhatsApp/Email
```

### Option 2: Local Build

```bash
cd frontend
npx expo prebuild
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🗄️ MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (512MB - sufficient for this app)
3. Create database user
4. Whitelist all IPs: `0.0.0.0/0`
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/anurag_aluminium`
6. Update `backend/.env`:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/anurag_aluminium
   ```

### Option 2: Local MongoDB

```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod

# Default connection (already in .env)
# mongodb://localhost:27017/anurag_aluminium
```

---

## 🌐 Deploying to Production

### Backend Deployment Options

**1. Railway (Easiest - Free Tier)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Add MongoDB Atlas connection string as environment variable
railway variables set MONGO_URL="mongodb+srv://..."
```

**2. Render**
- Connect GitHub repo
- Select Python environment
- Set start command: `python server.py`
- Add MongoDB URL as environment variable

**3. Heroku**
```bash
heroku create anurag-aluminium-api
git push heroku main
heroku config:set MONGO_URL="mongodb+srv://..."
```

### Update Frontend with Production Backend URL

After deploying backend, update `frontend/.env`:
```
EXPO_PUBLIC_BACKEND_URL=https://your-deployed-backend-url.com
```

Then rebuild the APK.

---

## 📁 Project Structure Explained

### Backend (`/backend`)

```
server.py               # Main API with all endpoints
├── /api/auth           # Login, user initialization
├── /api/window-types   # Window types CRUD
├── /api/estimates      # Estimates CRUD with calculations
└── /api/settings       # App settings (default rate)
```

### Frontend (`/frontend/app`)

```
app/
├── _layout.tsx              # Root layout with navigation
├── index.tsx                # Splash/redirect screen
├── login.tsx                # Login screen
├── field-expert/            # Field expert screens
│   ├── index.tsx           # Dashboard
│   └── new-estimate.tsx    # Add measurements (with fraction selector)
└── admin/                   # Admin screens
    ├── index.tsx           # Admin dashboard
    ├── estimates.tsx       # View all estimates
    ├── edit-estimate.tsx   # Edit estimate + generate PDF
    ├── window-types.tsx    # Manage window types
    └── settings.tsx        # App settings
```

---

## 🧪 Testing the App

### Backend API Test

```bash
# Test login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get window types
curl http://localhost:8001/api/window-types

# Create estimate
curl -X POST http://localhost:8001/api/estimates \
  -H "Content-Type: application/json" \
  -d '{
    "field_expert_name": "Test Expert",
    "customer_name": "John Doe",
    "site_address": "123 Test St",
    "mobile_number": "9876543210",
    "measurements": [{
      "window_type": "Three track sliding window",
      "width_inches": 48.25,
      "height_inches": 51.25,
      "quantity": 2
    }]
  }'
```

### Calculation Verification

**Input:**
- Width: 48.25 inches
- Height: 51.25 inches
- Quantity: 2
- Rate: ₹150/sq ft

**Expected Calculation:**
- Area = (48.25 × 51.25) ÷ 144 = 17.172 sq ft
- Amount = 17.172 × 150 × 2 = ₹5,151.69

---

## 🔧 Customization

### Change Company Logo

Replace the logo in `/frontend/utils/pdfGenerator.ts`:
```typescript
const companyLogoBase64 = 'YOUR_NEW_LOGO_URL_OR_BASE64';
```

### Add New Window Type

**Via Admin Panel:**
1. Login as admin
2. Go to "Window Types (SOPs)"
3. Click "+" to add new type

**Via API:**
```bash
curl -X POST http://localhost:8001/api/window-types \
  -H "Content-Type: application/json" \
  -d '{"name":"Custom Window Type"}'
```

### Change Default Rate

**Via Admin Panel:**
1. Login as admin
2. Go to "Settings"
3. Update "Default Rate per Sq Ft"

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Module not found"**
```bash
cd backend
pip install -r requirements.txt
```

**Error: "MongoDB connection failed"**
- Check if MongoDB is running
- Verify MONGO_URL in backend/.env
- For Atlas, check IP whitelist

### Frontend Issues

**Error: "Cannot find module"**
```bash
cd frontend
rm -rf node_modules
yarn install
```

**Error: "Expo start failed"**
```bash
cd frontend
rm -rf .expo .metro-cache
yarn start --clear
```

**Web platform errors with AsyncStorage:**
- This is normal, the app uses localStorage fallback for web

---

## 📞 Support & Documentation

**Full Documentation:** See `PROJECT_README.md`

**Key Features:**
- ✅ Field Expert: Add measurements with 1/16" precision
- ✅ Admin: Set rates, manage estimates, generate PDFs
- ✅ PDF with company branding
- ✅ WhatsApp sharing (mobile only)
- ✅ Offline capable
- ✅ Payment tracking (Pending/Partial/Paid)

**Test Credentials:**
- Admin: `admin` / `admin123`
- Field Expert: `expert` / `expert123`

---

## 🎉 You're All Set!

Your Anurag Aluminium Window Estimation App is ready to use!

**Next Steps:**
1. ✅ Test locally with the credentials above
2. 🗄️ Setup MongoDB Atlas for cloud database
3. 🚀 Deploy backend to Railway/Render
4. 📱 Build APK and distribute to field experts
5. 🎯 Start taking measurements!

**Questions?** Check the PROJECT_README.md file for detailed information.

---

**Built with ❤️ for Anurag Aluminium & Glass House**
