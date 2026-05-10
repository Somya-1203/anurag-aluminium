# 🗄️ MongoDB Atlas Setup Guide

## Step-by-Step Instructions

### 1. Create MongoDB Atlas Account (FREE)

Go to: **https://www.mongodb.com/cloud/atlas/register**

- Sign up with Google/GitHub or Email
- Choose **FREE** tier (M0 Sandbox - 512MB)
- No credit card required!

### 2. Create a Cluster

After login:
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select **Region**: Choose closest to you (e.g., AWS Mumbai for India)
4. Cluster Name: `anurag-aluminium` (or keep default)
5. Click **"Create"**

⏳ Wait 3-5 minutes for cluster creation...

### 3. Create Database User

1. Click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
   - Username: `anurag_admin`
   - Password: Click **"Autogenerate Secure Password"** (COPY THIS!)
   - Or create your own password (SAVE IT!)
4. Database User Privileges: **"Atlas Admin"**
5. Click **"Add User"**

### 4. Whitelist Your IP (Allow All IPs)

1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (allows all IPs)
   - ⚠️ This is for development. For production, add specific IPs
4. Click **"Confirm"**

### 5. Get Your Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"**
4. Select: **Java** and **Version 4.11 or later**
5. Copy the connection string. It looks like:

```
mongodb+srv://anurag_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Modify Connection String

Replace `<password>` with your actual password:

**Before:**
```
mongodb+srv://anurag_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After (example):**
```
mongodb+srv://anurag_admin:YourActualPassword123@cluster0.xxxxx.mongodb.net/anurag_aluminium?retryWrites=true&w=majority
```

**Add database name:** `/anurag_aluminium` before the `?`

---

## ✅ Final Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/anurag_aluminium?retryWrites=true&w=majority
```

**Save this connection string - you'll need it for backend deployment!**

---

## 📝 What You Should Have Now

✅ MongoDB Atlas account created
✅ Free M0 cluster running
✅ Database user created with password
✅ All IPs whitelisted (0.0.0.0/0)
✅ Connection string copied

---

## ⏭️ Next Step

Once you have your MongoDB connection string, we'll deploy the Java backend!

**Ready?** Copy your connection string and let me know!
