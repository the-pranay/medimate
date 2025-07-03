import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connection: 'Connected',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    await connectDB();
    
    // Create test data if collections are empty
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      // Create sample admin user
      const adminUser = new User({
        name: 'System Administrator',
        email: 'admin@medimate.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5QD7pnQ2qm', // password123
        phone: '+91 9999999999',
        role: 'admin',
        address: 'MediMate Headquarters',
        isVerified: true,
        isActive: true
      });
      
      // Create sample doctor
      const doctorUser = new User({
        name: 'Dr. Sarah Wilson',
        email: 'doctor@medimate.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5QD7pnQ2qm', // password123
        phone: '+91 9876543211',
        role: 'doctor',
        specialization: 'Cardiologist',
        experience: 8,
        licenseNumber: 'MD12345',
        address: '456 Medical Center, Mumbai',
        consultationFee: 500,
        isVerified: true,
        isActive: true,
        qualifications: [{
          degree: 'MBBS',
          institute: 'All India Institute of Medical Sciences',
          year: 2015
        }],
        availableSlots: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true }
        ]
      });
      
      // Create sample patient
      const patientUser = new User({
        name: 'John Doe',
        email: 'patient@medimate.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5QD7pnQ2qm', // password123
        phone: '+91 9876543210',
        role: 'patient',
        age: 30,
        gender: 'male',
        bloodGroup: 'O+',
        address: '123 Main St, Mumbai',
        isVerified: true,
        isActive: true,
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+91 9876543209',
          relationship: 'Spouse'
        }
      });
      
      await adminUser.save();
      await doctorUser.save();
      await patientUser.save();
      
      return NextResponse.json({
        success: true,
        message: 'Database initialized with sample data',
        data: {
          usersCreated: 3,
          roles: ['admin', 'doctor', 'patient']
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database already contains data',
      data: {
        userCount
      }
    });
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database initialization failed',
      error: error.message
    }, { status: 500 });
  }
}
