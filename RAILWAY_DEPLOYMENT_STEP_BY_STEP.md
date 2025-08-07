# 🚀 **DETAILED RAILWAY DEPLOYMENT GUIDE**

## **Step 1: Create GitHub Repository (2 minutes)**

### 1.1 Go to GitHub
1. Open [github.com](https://github.com) in your browser
2. Click **"New Repository"** (green button)

### 1.2 Create Repository
1. **Repository name:** `medimate-socket-server`
2. **Description:** `Socket.IO server for MediMate real-time communication`
3. **Visibility:** Public (or Private if you prefer)
4. ✅ Check **"Add a README file"**
5. Click **"Create repository"**

### 1.3 Upload Files
1. Click **"uploading an existing file"** link
2. Drag and drop these files from your `railway-deploy` folder:
   - `index.js`
   - `package.json`
   - `README.md`
3. **Commit message:** `Initial Socket.IO server setup`
4. Click **"Commit changes"**

---

## **Step 2: Deploy to Railway (3 minutes)**

### 2.1 Go to Railway
1. Open [railway.app](https://railway.app) in your browser
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub

### 2.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"medimate-socket-server"** repository
4. Click **"Deploy"**

### 2.3 Automatic Deployment
Railway will automatically:
- ✅ Detect Node.js project
- ✅ Run `npm install`
- ✅ Start server with `npm start`
- ✅ Generate public URL

---

## **Step 3: Get Your URL (30 seconds)**

### 3.1 Find Your URL
1. In Railway dashboard, your project will show **"Deployed"**
2. Look for **"Domains"** section
3. Your URL will look like:
   ```
   https://medimate-socket-server-production-a1b2.up.railway.app
   ```
4. **Copy this URL** - this is your real Socket.IO server URL!

### 3.2 Test Your Server
1. Visit your Railway URL in browser
2. You should see JSON response:
   ```json
   {
     "message": "MediMate Socket.IO Server Running",
     "status": "active",
     "timestamp": "2025-08-08T..."
   }
   ```

---

## **Step 4: Update Your Environment Variables**

### 4.1 Update .env.production
Replace the placeholder URLs with your real Railway URL:

**BEFORE:**
```env
NEXT_PUBLIC_SOCKET_SERVER_URL=https://your-actual-socket-server-url-here
SOCKET_SERVER_URL=https://your-actual-socket-server-url-here
```

**AFTER (with your real URL):**
```env
NEXT_PUBLIC_SOCKET_SERVER_URL=https://medimate-socket-server-production-a1b2.up.railway.app
SOCKET_SERVER_URL=https://medimate-socket-server-production-a1b2.up.railway.app
```

### 4.2 Update Vercel Environment
1. Go to [vercel.com](https://vercel.com) dashboard
2. Select your **"medimate"** project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add/Update:
   - **Name:** `NEXT_PUBLIC_SOCKET_SERVER_URL`
   - **Value:** Your Railway URL
5. Click **"Save"**
6. **Redeploy** your app

---

## **Step 5: Test Everything Works**

### 5.1 Test Real-time Features
1. Visit your MediMate website: `https://new-medimate.vercel.app`
2. Login as doctor and patient (in different browsers)
3. Test messaging - should work in real-time!
4. Test video calling

### 5.2 Verify Connection
1. Open browser developer tools (F12)
2. Go to **Console** tab
3. Look for messages like:
   ```
   Connected to Socket.IO server
   Socket.IO connection established
   ```

---

## **🎉 DONE! Your Real URLs:**

**Your Socket.IO Server:** `https://your-railway-url.up.railway.app`
**Your Main Website:** `https://new-medimate.vercel.app`

## **📱 What Works Now:**
- ✅ Real-time messaging between doctors and patients
- ✅ Video calling with WebRTC
- ✅ Live typing indicators
- ✅ Connection status tracking
- ✅ Complete healthcare platform

## **💡 Troubleshooting:**
- If messaging doesn't work, check browser console for errors
- Verify the Railway URL is correct in Vercel environment
- Make sure both Railway and Vercel deployments are successful

**Total time: ~5 minutes to get your real Socket.IO server URL!** 🚀
