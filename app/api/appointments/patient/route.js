import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Appointment from '../../../../lib/models/Appointment';

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

export async function GET(request) {
  try {
    // First, check database connection
    const dbConnection = await connectDB();
    if (!dbConnection) {
      console.error('Database connection failed');
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      console.error('JWT verification failed');
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Ensure only patients can access their own appointments
    if (decoded.role !== 'patient') {
      console.error('Access denied - not a patient');
      return NextResponse.json(
        { success: false, message: 'Only patients can access this endpoint' },
        { status: 403 }
      );
    }

    // Get appointments for the patient
    const appointments = await Appointment.find({ patient: decoded.userId })
      .populate('doctor', 'name email specialization profilePicture')
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });

    return NextResponse.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error('Get patient appointments error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
