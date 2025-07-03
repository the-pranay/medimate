import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock appointments data (shared with other appointment routes)
let appointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    doctorName: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    date: '2025-01-02',
    time: '10:00 AM',
    type: 'Consultation',
    status: 'confirmed',
    notes: 'Follow-up for hypertension',
    consultationFee: 800,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '3',
    doctorName: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    date: '2025-01-05',
    time: '2:00 PM',
    type: 'Regular Checkup',
    status: 'pending',
    notes: 'Child vaccination appointment',
    consultationFee: 700,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
];

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
      doctorName,
      specialization,
      date,
      time,
      type,
      notes,
      consultationFee,
    } = appointmentData;

    // Validate required fields
    if (!doctorId || !date || !time || !type) {
      return NextResponse.json(
        { success: false, message: 'Missing required appointment details' },
        { status: 400 }
      );
    }

    // Check if slot is already booked
    const existingAppointment = appointments.find(
      apt => apt.doctorId === doctorId && apt.date === date && apt.time === time
    );

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, message: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    // Create new appointment
    const newAppointment = {
      id: Date.now().toString(),
      patientId: decoded.userId,
      doctorId,
      doctorName,
      specialization,
      date,
      time,
      type,
      status: 'pending',
      notes: notes || '',
      consultationFee: consultationFee || 0,
      createdAt: new Date().toISOString(),
    };

    appointments.push(newAppointment);

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

    let userAppointments = appointments;

    // Filter by user role
    if (decoded.role === 'patient') {
      userAppointments = appointments.filter(apt => apt.patientId === decoded.userId);
    } else if (decoded.role === 'doctor') {
      userAppointments = appointments.filter(apt => apt.doctorId === decoded.userId);
    }

    // Filter by status
    if (status) {
      userAppointments = userAppointments.filter(apt => apt.status === status);
    }

    // Filter by doctor
    if (doctorId) {
      userAppointments = userAppointments.filter(apt => apt.doctorId === doctorId);
    }

    return NextResponse.json({
      success: true,
      data: userAppointments,
      total: userAppointments.length,
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
