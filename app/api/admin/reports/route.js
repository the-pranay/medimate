import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import MedicalRecord from '../../../../lib/models/MedicalRecord';
import User from '../../../../lib/models/User';
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

// GET all medical reports (admin only)
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

    // Check if user is admin or has special admin email
    if (decoded.role !== 'admin' && decoded.email !== 'thepranay2004@gmail.com') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    let query = {};

    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by doctor
    if (doctorId) {
      query.doctor = doctorId;
    }

    // Filter by patient
    if (patientId) {
      query.patient = patientId;
    }

    const skip = (page - 1) * limit;

    const reports = await MedicalRecord.find(query)
      .populate('patient', 'name email phone age gender')
      .populate('doctor', 'name email specialization')
      .populate('appointment', 'appointmentDate appointmentTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReports = await MedicalRecord.countDocuments(query);

    // Get report statistics
    const stats = {
      total: totalReports,
      pending: await MedicalRecord.countDocuments({ status: 'pending' }),
      approved: await MedicalRecord.countDocuments({ status: 'approved' }),
      rejected: await MedicalRecord.countDocuments({ status: 'rejected' }),
      byType: await MedicalRecord.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]),
      recent: await MedicalRecord.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    };

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        current: page,
        total: Math.ceil(totalReports / limit),
        limit,
        count: totalReports
      },
      stats
    });

  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT - Update report status (admin only)
export async function PUT(request) {
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

    if (decoded.role !== 'admin' && decoded.email !== 'thepranay2004@gmail.com') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { reportId, status, adminNotes } = await request.json();
    
    if (!reportId || !status) {
      return NextResponse.json(
        { success: false, message: 'Report ID and status are required' },
        { status: 400 }
      );
    }

    const updatedReport = await MedicalRecord.findByIdAndUpdate(
      reportId,
      { 
        status,
        adminNotes,
        reviewedBy: decoded.userId,
        reviewedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('patient', 'name email')
     .populate('doctor', 'name email');

    if (!updatedReport) {
      return NextResponse.json(
        { success: false, message: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report status updated successfully',
      data: updatedReport
    });

  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
