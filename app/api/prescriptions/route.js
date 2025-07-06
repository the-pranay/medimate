import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import Prescription from '../../../lib/models/Prescription';
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

// GET prescriptions
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
    const status = searchParams.get('status');

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
    if (status) {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name email phone age gender')
      .populate('doctor', 'name email specialization')
      .populate('appointment', 'appointmentDate appointmentTime')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: prescriptions,
      total: prescriptions.length,
    });

  } catch (error) {
    console.error('Get prescriptions error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Create new prescription (doctors only)
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

    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Only doctors can create prescriptions' },
        { status: 403 }
      );
    }

    const prescriptionData = await request.json();
    
    // Validate required fields
    if (!prescriptionData.patient || !prescriptionData.title || !prescriptionData.diagnosis || !prescriptionData.medicines || prescriptionData.medicines.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPrescription = new Prescription({
      ...prescriptionData,
      doctor: decoded.userId,
    });

    await newPrescription.save();
    
    // Populate the prescription before returning
    await newPrescription.populate('patient', 'name email phone age gender');
    await newPrescription.populate('doctor', 'name email specialization');

    return NextResponse.json({
      success: true,
      message: 'Prescription created successfully',
      data: newPrescription,
    });

  } catch (error) {
    console.error('Create prescription error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
