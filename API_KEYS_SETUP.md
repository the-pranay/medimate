# 🚀 MediMate API Keys Setup Guide

## 📋 **Quick Start - Free Services Only**

For development, you can start with free services and gradually add paid services as needed.

### **✅ Step 1: Update Security Keys (REQUIRED)**

Replace these keys in your `.env.local` with the generated secure keys:

```bash
JWT_SECRET="8daa06d33112bc1c05f0dd6c26ba0094d1de850d79f535fce13bdf37a04ec04710c306d60ba1b8cd4c0ec6d687a0e173f6acab554655bbaaf6cb53055e29fd619"
NEXTAUTH_SECRET="2694dd70fb2d88bff387ab5559838aab90d6009fbd0d54fdf7756cf1b1c6fe350c89f62a6b0f3ea31d71096e29d8ed7990cc3b2affd16d880de1955dba40cd781"
MEDICAL_DATA_ENCRYPTION_KEY="4f7426ef7a7e427e28fca5c1b473eefcc14c75176c2fa55b2c931e65706d8ab1"
FILE_ENCRYPTION_KEY="90ddd790d7f322df85be3ebc7adc25c819808bd127434a565f7524aa7df21259"
```

### **✅ Step 2: Database (Choose One)**

#### **Option A: MongoDB Atlas (Free - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account (512MB storage)
3. Create cluster
4. Get connection string and replace:
```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/medimate"
```

#### **Option B: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Keep existing: `DATABASE_URL="mongodb://localhost:27017/medimate"`

### **✅ Step 3: Email Service (Choose One)**

#### **Option A: Gmail (Free)**
1. Enable 2-Step Verification in Google Account
2. Generate App Password in Security settings
3. Update:
```bash
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-16-digit-app-password"
```

#### **Option B: SendGrid (Free - 100 emails/day)**
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API key
3. Update SMTP settings as per their documentation

### **🔧 Step 4: Optional Services (Add as needed)**

#### **Payment Processing**
- **Stripe**: Free to setup, 2.9% + 30¢ per transaction
- **Razorpay**: Free to setup, 2% per transaction (India)

#### **Video Calling**
- **Agora**: 10,000 minutes free monthly
- **Twilio**: $20 free credit

#### **File Storage**
- **Cloudinary**: 10GB free storage
- **AWS S3**: 5GB free for 12 months

#### **Maps**
- **Google Maps**: $200 free credit monthly

---

## 🛠️ **Detailed Setup Instructions**

### **1. Database Configuration**

#### **MongoDB Atlas (Recommended for production)**
```bash
# Steps:
1. Visit https://www.mongodb.com/atlas
2. Click "Try Free"
3. Create account with Google/email
4. Choose "Shared" (free tier)
5. Select cloud provider and region
6. Create cluster (takes 1-3 minutes)
7. Create database user:
   - Click "Database Access"
   - Add new user with password
   - Select "Read and write to any database"
8. Setup network access:
   - Click "Network Access"
   - Add IP address (0.0.0.0/0 for development)
9. Get connection string:
   - Click "Database" > "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace <password> with your user password

# Update .env.local:
DATABASE_URL="mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/medimate?retryWrites=true&w=majority"
```

#### **Local PostgreSQL**
```bash
# Steps:
1. Download PostgreSQL from https://www.postgresql.org/download/
2. Install with default settings
3. Remember the password you set for 'postgres' user
4. Open pgAdmin or command line
5. Create database:
   CREATE DATABASE medimate;
6. Update .env.local:
   POSTGRES_URL="postgresql://postgres:yourpassword@localhost:5432/medimate"
```

### **2. Authentication & Security**

Your keys are already generated. Keep them secure!

### **3. Email Configuration**

#### **Gmail SMTP (Free)**
```bash
# Steps:
1. Go to Google Account settings (myaccount.google.com)
2. Security > 2-Step Verification > Turn on
3. Security > App passwords
4. Select app: Mail, Select device: Other
5. Enter "MediMate" as custom name
6. Copy the 16-character password
7. Update .env.local:
   SMTP_USER="youremail@gmail.com"
   SMTP_PASS="abcd efgh ijkl mnop"  # 16-character app password
```

#### **SendGrid (Alternative)**
```bash
# Steps:
1. Sign up at https://sendgrid.com
2. Verify your email
3. Go to Settings > API Keys
4. Create API key with "Full Access"
5. Update SMTP settings:
   SMTP_HOST="smtp.sendgrid.net"
   SMTP_PORT="587"
   SMTP_USER="apikey"
   SMTP_PASS="your_sendgrid_api_key"
```

### **4. Payment Integration**

#### **Stripe (Global)**
```bash
# Steps:
1. Go to https://stripe.com
2. Create account
3. Complete business verification
4. Dashboard > Developers > API keys
5. Copy test keys:
   STRIPE_PUBLIC_KEY="pk_test_51..."
   STRIPE_SECRET_KEY="sk_test_51..."
```

#### **Razorpay (India)**
```bash
# Steps:
1. Go to https://razorpay.com
2. Sign up and complete KYC
3. Dashboard > Settings > API Keys
4. Generate Test Keys:
   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="..."
```

### **5. Video Calling**

#### **Agora (Recommended)**
```bash
# Steps:
1. Sign up at https://www.agora.io
2. Console > Projects > Create Project
3. Choose "Secure mode: APP ID + Token"
4. Get credentials:
   AGORA_APP_ID="your_app_id"
   AGORA_APP_CERTIFICATE="your_app_certificate"
```

### **6. File Storage**

#### **Cloudinary (Free 10GB)**
```bash
# Steps:
1. Sign up at https://cloudinary.com
2. Dashboard shows your credentials:
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="123456789012345"
   CLOUDINARY_API_SECRET="your_api_secret"
```

### **7. Google Maps**

```bash
# Steps:
1. Go to https://console.cloud.google.com
2. Create new project "MediMate"
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Credentials > Create credentials > API key
5. Restrict key to your domains
6. Update:
   GOOGLE_MAPS_API_KEY="AIzaSy..."
```

---

## 🔒 **Security Best Practices**

1. **Never commit `.env.local` to git**
   ```bash
   # Add to .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Use different keys for production**
   - Generate new keys for production
   - Use production API keys, not test keys

3. **Rotate keys regularly**
   - Change keys every 3-6 months
   - Monitor for any unauthorized access

4. **Restrict API key permissions**
   - Only give minimum required permissions
   - Set spending limits on payment APIs

---

## 🧪 **Testing Your Setup**

After setting up keys, test the functionality:

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Test authentication:**
   - Register a new user
   - Login with credentials

3. **Test email:**
   - Password reset functionality
   - Registration confirmation

4. **Test payments:**
   - Book an appointment
   - Use test card numbers

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **MongoDB connection error:**
   - Check if IP is whitelisted
   - Verify username/password
   - Ensure database name is correct

2. **Email not sending:**
   - Verify SMTP credentials
   - Check if 2FA is enabled for Gmail
   - Test with a simple email client

3. **API key errors:**
   - Ensure keys are not wrapped in quotes
   - Check for extra spaces
   - Verify API key permissions

### **Need Help?**
- Check service documentation
- Look for API status pages
- Test with minimal examples first

---

## 📚 **Useful Resources**

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Stripe API Documentation](https://stripe.com/docs)
- [Google Cloud Console](https://console.cloud.google.com/)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Agora Documentation](https://docs.agora.io/)

Remember: Start with free services and upgrade as your application grows!
