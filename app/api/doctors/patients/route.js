import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Appointment from '../../../../lib/models/Appointment';
import User from '../../../../lib/models/User';

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

    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Only doctors can access this endpoint' },
        { status: 403 }
      );
    }

    // Get all unique patients who have appointments with this doctor
    const appointments = await Appointment.find({ doctor: decoded.userId })
      .populate('patient', 'name email phone age gender address profilePicture createdAt')
      .sort({ createdAt: -1 });

    // Extract unique patients and their appointment info
    const patientsMap = new Map();
    
    appointments.forEach(appointment => {
      if (appointment.patient) {
        const patientId = appointment.patient._id.toString();
        if (!patientsMap.has(patientId)) {
          patientsMap.set(patientId, {
            ...appointment.patient.toObject(),
            firstAppointment: appointment.createdAt,
            lastAppointment: appointment.createdAt,
            totalAppointments: 1,
            completedAppointments: appointment.status === 'completed' ? 1 : 0,
            upcomingAppointments: ['scheduled', 'confirmed', 'paid'].includes(appointment.status) ? 1 : 0
          });
        } else {
          const existing = patientsMap.get(patientId);
          existing.totalAppointments++;
          if (appointment.status === 'completed') {
            existing.completedAppointments++;
          }
          if (['scheduled', 'confirmed', 'paid'].includes(appointment.status)) {
            existing.upcomingAppointments++;
          }
          if (appointment.createdAt > existing.lastAppointment) {
            existing.lastAppointment = appointment.createdAt;
          }
        }
      }
    });

    const patients = Array.from(patientsMap.values());

    return NextResponse.json({
      success: true,
      data: patients,
      total: patients.length,
    });

  } catch (error) {
    console.error('Get doctor patients error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
