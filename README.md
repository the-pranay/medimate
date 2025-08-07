# 🏥 MediMate - Comprehensive Healthcare Platform

A modern, full-stack healthcare platform built with **Next.js 15** that connects patients with doctors through secure video consultations, real-time messaging, and comprehensive healthcare management.

## ✨ Key Features

### 👨‍⚕️ **For Doctors**
- **Digital Dashboard** - Complete patient management system
- **Video Consultations** - High-quality WebRTC video calls
- **Real-time Messaging** - Instant communication with patients
- **Prescription Management** - Digital prescription creation and management
- **Patient Records** - Comprehensive medical history tracking
- **Appointment Scheduling** - Flexible booking system
- **Doctor Verification** - Professional credential verification system

### 👩‍💼 **For Patients**
- **Doctor Discovery** - Browse and search verified doctors
- **Online Booking** - Easy appointment scheduling
- **Video Consultations** - Secure video calls with doctors
- **Health Records** - Personal medical history management
- **Prescription Access** - Digital prescription downloads
- **Real-time Chat** - Direct messaging with healthcare providers
- **Payment Integration** - Secure payment processing

### 🔧 **For Administrators**
- **User Management** - Comprehensive user administration
- **Doctor Verification** - Medical professional credential verification
- **Platform Analytics** - Usage statistics and insights
- **Content Management** - Platform content and settings control

## 🚀 Technology Stack

### **Frontend**
- **Next.js 15.3.4** - React framework with App Router
- **React 18** - Component-based UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **WebRTC** - Peer-to-peer video calling

### **Backend & Infrastructure**
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB Atlas** - Cloud database solution
- **Socket.IO Server** - Real-time messaging (deployed on Render.com)
- **JWT Authentication** - Secure user authentication
- **Vercel** - Frontend hosting and deployment

### **Integrations**
- **Razorpay** - Payment processing
- **Cloudinary** - Image and file management
- **Agora.io** - Enhanced video calling capabilities
- **PDF-lib** - Dynamic PDF generation for prescriptions

## 🏗️ Project Structure

```
medimate/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── admin/                    # Admin dashboard
│   ├── doctor/                   # Doctor portal
│   ├── patient/                  # Patient portal
│   ├── api/                      # API routes
│   ├── components/               # Reusable UI components
│   ├── messaging/                # Real-time messaging
│   └── video-call/               # Video calling components
├── lib/                          # Utility functions
├── contexts/                     # React contexts
├── public/                       # Static assets
└── package.json                  # Dependencies
```

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Vercel account (for deployment)

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/the-pranay/medimate.git
   cd medimate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Socket.IO Server (Production)
   NEXT_PUBLIC_SOCKET_SERVER_URL=https://medimate-socket-server.onrender.com
   
   # Payment Gateway
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   
   # File Storage
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   
   # Video Calling (Optional)
   AGORA_APP_ID=your_agora_app_id
   AGORA_APP_CERTIFICATE=your_agora_certificate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔄 Real-time Features

### **Socket.IO Integration**
- **Production Server**: Deployed on Render.com for reliable real-time communication
- **Real-time Messaging**: Instant chat between doctors and patients
- **Video Call Signaling**: WebRTC signaling for video consultations
- **Live Updates**: Real-time appointment and status updates

### **Video Calling System**
- **WebRTC Technology**: Direct peer-to-peer video communication
- **STUN Servers**: Free STUN servers for NAT traversal
- **Agora Integration**: Enhanced video calling with advanced features
- **Cross-platform Support**: Works on desktop and mobile browsers

## 📱 User Roles & Access

### **Patient Account**
- Browse verified doctors
- Book appointments
- Join video consultations
- Access medical records
- Download prescriptions
- Real-time messaging

### **Doctor Account**
- Manage patient appointments
- Conduct video consultations
- Create digital prescriptions
- Access patient history
- Real-time communication
- Professional dashboard

### **Admin Account**
- User management
- Doctor verification
- Platform monitoring
- System administration
- Analytics and reports

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different access levels for users
- **Secure Video Calls** - Encrypted WebRTC connections
- **Data Protection** - HIPAA-compliant data handling
- **Environment Variables** - Secure configuration management

## 🚀 Deployment

### **Frontend (Vercel)**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### **Socket.IO Server (Render.com)**
- Production Socket.IO server is already deployed
- URL: `https://medimate-socket-server.onrender.com`
- Handles real-time messaging and video call signaling

## 📊 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| 🔐 Authentication | ✅ Complete | JWT-based secure login system |
| 👥 User Management | ✅ Complete | Role-based user management |
| 📅 Appointment Booking | ✅ Complete | Flexible scheduling system |
| 💬 Real-time Messaging | ✅ Complete | Socket.IO powered chat |
| 📹 Video Consultations | ✅ Complete | WebRTC video calling |
| 📋 Digital Prescriptions | ✅ Complete | PDF prescription generation |
| 💳 Payment Integration | ✅ Complete | Razorpay payment gateway |
| 🔍 Doctor Search | ✅ Complete | Advanced doctor discovery |
| 📱 Responsive Design | ✅ Complete | Mobile-first design |
| 🔒 Data Security | ✅ Complete | HIPAA-compliant security |

## 📞 Support & Contact

For technical support or questions:
- **GitHub Issues**: [Create an issue](https://github.com/the-pranay/medimate/issues)
- **Documentation**: Check the codebase for detailed comments
- **Live Demo**: Visit the deployed application

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ by [Pranay](https://github.com/the-pranay)**

*MediMate - Connecting Healthcare, One Click at a Time* 🏥✨
