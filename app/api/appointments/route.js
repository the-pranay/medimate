import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import Appointment from '../../../lib/models/Appointment';
import User from '../../../lib/models/User';

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

export async function POST(request) {
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

    const appointmentData = await request.json();
    const {
      doctorId,
      date,
      time,
      reasonForVisit,
      symptoms,
      type,
      notes,
      consultationFee,
    } = appointmentData;

    // Validate required fields
    if (!doctorId || !date || !time || !reasonForVisit) {
      return NextResponse.json(
        { success: false, message: 'Missing required appointment details' },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(date),
      appointmentTime: time,
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, message: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patient: decoded.userId,
      doctor: doctorId,
      appointmentDate: new Date(date),
      appointmentTime: time,
      reasonForVisit,
      symptoms: symptoms || [],
      type: type || 'offline',
      status: 'scheduled',
      notes: {
        patient: notes || '',
        doctor: '',
        admin: ''
      },
      consultationFee: consultationFee || 0,
    });

    await newAppointment.save();

    // Populate doctor and patient info
    await newAppointment.populate('doctor', 'name email specialization');
    await newAppointment.populate('patient', 'name email phone');

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      data: newAppointment,
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const status = searchParams.get('status');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const today = searchParams.get('today'); // Get today's appointments

    let query = {};

    // Filter by user role
    if (decoded.role === 'patient') {
      query.patient = decoded.userId;
    } else if (decoded.role === 'doctor') {
      query.doctor = decoded.userId;
    }

    // Additional filters
    if (status) {
      query.status = status;
    }
    if (doctorId) {
      query.doctor = doctorId;
    }
    if (patientId) {
      query.patient = patientId;
    }
    if (today === 'true') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name email specialization phone')
      .populate('patient', 'name email phone age gender')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return NextResponse.json({
      success: true,
      data: appointments,
      total: appointments.length,
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
