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
    await connectDB();
    
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure only patients can access their own appointments
    if (decoded.role !== 'patient') {
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
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
