import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import MedicalReport from '../../../../lib/models/MedicalReport';
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

// GET medical reports
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
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const reportType = searchParams.get('type');

    let query = {};

    // Filter by user role
    if (decoded.role === 'patient') {
      query.patient = decoded.userId;
    } else if (decoded.role === 'doctor') {
      query.doctor = decoded.userId;
    }

    // Additional filters
    if (patientId) {
      query.patient = patientId;
    }
    if (doctorId) {
      query.doctor = doctorId;
    }
    if (status) {
      query.status = status;
    }
    if (reportType) {
      query.reportType = reportType;
    }

    const reports = await MedicalReport.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization')
      .populate('appointment', 'appointmentDate appointmentTime')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: reports,
      total: reports.length,
    });

  } catch (error) {
    console.error('Get medical reports error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create medical report
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

    // Only doctors can create reports
    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Only doctors can create medical reports' },
        { status: 403 }
      );
    }

    const reportData = await request.json();
    const {
      patientId,
      appointmentId,
      reportType,
      diagnosis,
      symptoms,
      prescription,
      testResults,
      recommendations,
      followUpDate,
      notes
    } = reportData;

    // Validate required fields
    if (!patientId || !reportType || !diagnosis) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    // Create new medical report
    const newReport = new MedicalReport({
      patient: patientId,
      doctor: decoded.userId,
      appointment: appointmentId || null,
      reportType,
      diagnosis,
      symptoms: symptoms || [],
      prescription: prescription || [],
      testResults: testResults || [],
      recommendations: recommendations || '',
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      notes: notes || '',
      status: 'active'
    });

    await newReport.save();

    // Populate data for response
    await newReport.populate('patient', 'name email phone');
    await newReport.populate('doctor', 'name email specialization');
    if (appointmentId) {
      await newReport.populate('appointment', 'appointmentDate appointmentTime');
    }

    return NextResponse.json({
      success: true,
      message: 'Medical report created successfully',
      data: newReport,
    });

  } catch (error) {
    console.error('Create medical report error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
