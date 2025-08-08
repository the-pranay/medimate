import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import User from '../../../models/User';
import Appointment from '../../../models/Appointment';
import { verifyToken } from '../../../lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Verify user is a doctor
    const doctor = await User.findById(decoded.userId);
    if (!doctor || doctor.role !== 'doctor') {
      return NextResponse.json(
        { error: 'Access denied. Doctor role required.' },
        { status: 403 }
      );
    }

    // Get all patients who have appointments with this doctor
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone')
      .select('patient');

    // Extract unique patients
    const patientIds = [...new Set(appointments.map(apt => apt.patient._id.toString()))];
    
    // Get all patients with those IDs, plus any patients in the system
    const patients = await User.find({ 
      $or: [
        { _id: { $in: patientIds } },
        { role: 'patient' }
      ]
    }).select('name email phone createdAt');

    return NextResponse.json({
      success: true,
      users: patients,
      message: 'Patients retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
