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

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Get appointment with payment details
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'name')
      .populate('patient', 'name');

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to view this appointment
    if (appointment.patient._id.toString() !== decoded.userId && 
        appointment.doctor._id.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to view this appointment' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        appointmentId: appointment._id,
        status: appointment.status,
        payment: appointment.payment,
        doctor: appointment.doctor.name,
        patient: appointment.patient.name,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime
      }
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
