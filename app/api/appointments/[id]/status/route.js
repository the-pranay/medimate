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

export async function PATCH(request, { params }) {
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

    // Ensure only doctors can update appointment status
    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Only doctors can update appointment status' },
        { status: 403 }
      );
    }

    const { id: appointmentId } = await params;
    const { status, notes } = await request.json();

    // Validate status
    const validStatuses = ['scheduled', 'confirmed', 'paid', 'in-progress', 'completed', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid appointment status' },
        { status: 400 }
      );
    }

    // Get appointment
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Verify the doctor is the one assigned to this appointment
    if (appointment.doctor.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to update this appointment' },
        { status: 403 }
      );
    }

    // Update appointment status
    appointment.status = status;
    appointment.updatedAt = new Date();
    
    // Add doctor notes if provided
    if (notes) {
      appointment.notes.doctor = notes;
    }
    
    // Add confirmation timestamp when confirming paid appointment
    if (status === 'confirmed' && appointment.payment?.status === 'paid') {
      appointment.confirmedAt = new Date();
      appointment.confirmedBy = decoded.userId;
    }

    await appointment.save();

    // Populate for response
    await appointment.populate('doctor', 'name email specialization');
    await appointment.populate('patient', 'name email phone');

    return NextResponse.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
