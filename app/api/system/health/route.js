import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      database: !!process.env.DATABASE_URL,
      jwt: !!process.env.JWT_SECRET,
      smtp: !!process.env.SMTP_HOST,
      razorpay: !!process.env.RAZORPAY_KEY_ID,
      agora: !!process.env.AGORA_APP_ID,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
      encryption: !!process.env.MEDICAL_DATA_ENCRYPTION_KEY,
    };
    
    // Feature status check
    const features = {
      core: {
        authentication: { 
          status: envCheck.jwt && envCheck.database ? 'working' : 'needs_setup',
          description: 'User registration, login, role-based access',
          requirements: 'JWT_SECRET, DATABASE_URL'
        },
        appointments: { 
          status: envCheck.database ? 'working' : 'needs_setup',
          description: 'Book, manage, and track appointments',
          requirements: 'DATABASE_URL'
        },
        medicalRecords: { 
          status: envCheck.database ? 'working' : 'needs_setup',
          description: 'Store and manage patient medical records',
          requirements: 'DATABASE_URL'
        },
        dashboard: { 
          status: 'working',
          description: 'Patient and Doctor dashboards',
          requirements: 'None'
        }
      },
      optional: {
        videoConsultation: { 
          status: envCheck.agora ? 'working' : 'needs_setup',
          description: 'Video calling for remote consultations',
          requirements: 'AGORA_APP_ID, AGORA_APP_CERTIFICATE'
        },
        paymentIntegration: { 
          status: envCheck.razorpay ? 'working' : 'needs_setup',
          description: 'Razorpay payment processing',
          requirements: 'RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET'
        },
        emailNotifications: { 
          status: envCheck.smtp ? 'working' : 'needs_setup',
          description: 'Email notifications and reminders',
          requirements: 'SMTP_HOST, SMTP_USER, SMTP_PASS'
        },
        fileUpload: { 
          status: envCheck.cloudinary ? 'working' : 'needs_setup',
          description: 'Medical document and image uploads',
          requirements: 'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY'
        },
        dataEncryption: { 
          status: envCheck.encryption ? 'working' : 'needs_setup',
          description: 'Medical data encryption for security',
          requirements: 'MEDICAL_DATA_ENCRYPTION_KEY'
        }
      }
    };

    // Database connection status
    let databaseStatus = 'unknown';
    let databaseError = null;

    try {
      // Try to connect to database
      const connectDB = (await import('../../../../lib/mongodb')).default;
      await connectDB();
      databaseStatus = 'connected';
    } catch (error) {
      databaseStatus = 'error';
      databaseError = error.message;
    }

    // Calculate overall status
    const coreWorking = Object.values(features.core).filter(f => f.status === 'working').length;
    const totalCore = Object.keys(features.core).length;
    const optionalWorking = Object.values(features.optional).filter(f => f.status === 'working').length;
    const totalOptional = Object.keys(features.optional).length;

    return NextResponse.json({
      success: true,
      message: 'MediMate System Status Check',
      data: {
        database: {
          status: databaseStatus,
          error: databaseError,
          url: process.env.DATABASE_URL ? 'Configured' : 'Not configured'
        },
        environment: envCheck,
        features,
        overallStatus: {
          coreFeatures: `${coreWorking}/${totalCore} working`,
          optionalFeatures: `${optionalWorking}/${totalOptional} working`,
          databaseConnection: databaseStatus,
          readyForProduction: coreWorking === totalCore && databaseStatus === 'connected'
        },
        recommendations: [
          ...(databaseStatus === 'error' ? ['Fix database connection (check IP whitelist in MongoDB Atlas)'] : []),
          ...(envCheck.agora ? [] : ['Setup Agora for video consultations']),
          ...(envCheck.razorpay ? [] : ['Setup Razorpay for payments']),
          ...(envCheck.smtp ? [] : ['Setup SMTP for email notifications']),
          ...(envCheck.cloudinary ? [] : ['Setup Cloudinary for file uploads'])
        ],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('System status check failed:', error);
    return NextResponse.json({
      success: false,
      message: 'System status check failed',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Database initialization requires fixing the connection first',
      data: {
        action: 'Please fix the database connection and try again',
        steps: [
          '1. Check if your IP is whitelisted in MongoDB Atlas',
          '2. Verify the DATABASE_URL in .env.local',
          '3. Test the connection using GET /api/system/status',
          '4. Once connected, use POST to initialize sample data'
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Database initialization failed',
      error: error.message
    }, { status: 500 });
  }
}
