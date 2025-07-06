import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
const verifyToken = (authorization) => {
  if (!authorization) return null;
  
  const token = authorization.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  } catch (error) {
    return null;
  }
};

// Mock features data (in production, this would be stored in database)
const defaultFeatures = {
  // Authentication & Security
  registration: true,
  twoFactor: false,
  passwordReset: true,
  sessionTimeout: true,
  
  // Communication
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  chatMessaging: true,
  
  // Video & Telemedicine
  videoConsultation: true,
  screenSharing: false,
  appointmentRecording: false,
  waitingRoom: true,
  
  // Payments & Billing
  onlinePayments: true,
  subscriptions: false,
  invoiceGeneration: true,
  refundProcessing: false,
  
  // Data & Storage
  dataBackup: true,
  dataExport: true,
  fileUpload: true,
  cloudStorage: false,
  
  // Advanced Features
  aiDiagnosis: false,
  mlRecommendations: false,
  analytics: true,
  apiAccess: false
};

// GET features
export async function GET(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin or has special admin email
    const adminEmail = process.env.ADMIN_EMAIL || 'thepranay2004@gmail.com';
    if (decoded.role !== 'admin' && decoded.email !== adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      features: defaultFeatures
    });

  } catch (error) {
    console.error('Get features error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT - Update features
export async function PUT(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin or has special admin email
    const adminEmail = process.env.ADMIN_EMAIL || 'thepranay2004@gmail.com';
    if (decoded.role !== 'admin' && decoded.email !== adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { features } = await request.json();
    
    if (!features) {
      return NextResponse.json(
        { success: false, message: 'Features data is required' },
        { status: 400 }
      );
    }

    // In production, save to database
    // For now, we'll just return success
    console.log('Features updated:', features);

    return NextResponse.json({
      success: true,
      message: 'Features updated successfully',
      features: features
    });

  } catch (error) {
    console.error('Update features error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
