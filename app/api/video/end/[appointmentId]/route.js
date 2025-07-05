import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../../lib/mongodb';
import Appointment from '../../../../../lib/models/Appointment';

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

// POST - End video call for appointment
export async function POST(request, { params }) {
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

    const { appointmentId } = params;
    const { callDuration, callNotes } = await request.json();

    // Find and update appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email')
      .populate('doctor', 'name email');

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if user is participant
    const isParticipant = 
      appointment.patient._id.toString() === decoded.userId ||
      appointment.doctor._id.toString() === decoded.userId;

    if (!isParticipant) {
      return NextResponse.json(
        { success: false, message: 'Not authorized for this appointment' },
        { status: 403 }
      );
    }

    // Update appointment status to completed
    appointment.status = 'completed';
    appointment.callEndTime = new Date();
    if (callDuration) appointment.callDuration = callDuration;
    if (callNotes) appointment.notes = callNotes;
    
    await appointment.save();

    return NextResponse.json({
      success: true,
      message: 'Video call ended',
      data: {
        appointmentId: appointment._id,
        callStartTime: appointment.callStartTime,
        callEndTime: appointment.callEndTime,
        callDuration: appointment.callDuration,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('End video call error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
