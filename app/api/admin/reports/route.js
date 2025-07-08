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

// GET system statistics and reports (admin only)
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

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    
    // Get appointment statistics
    let totalAppointments = 0;
    try {
      totalAppointments = await Appointment.countDocuments();
    } catch (error) {
      console.log('Appointment model might not exist yet:', error.message);
    }

    // Get recent reports/medical records
    let recentReports = [];
    try {
      const medicalRecords = await MedicalRecord.find()
        .populate('patient', 'name')
        .populate('doctor', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

      recentReports = medicalRecords.map(record => ({
        title: `Medical Report - ${record.patient?.name || 'Unknown Patient'}`,
        description: `Report by Dr. ${record.doctor?.name || 'Unknown Doctor'}`,
        date: record.createdAt.toLocaleDateString(),
        id: record._id
      }));
    } catch (error) {
      console.log('MedicalRecord model might not exist yet:', error.message);
    }

    // System statistics
    const stats = {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      recentReports,
      // Additional stats
      activeUsers: await User.countDocuments({ isActive: true }),
      verifiedUsers: await User.countDocuments({ isVerified: true }),
      activeDoctors: await User.countDocuments({ role: 'doctor', isActive: true }),
      activePatients: await User.countDocuments({ role: 'patient', isActive: true }),
    };

    return NextResponse.json({
      success: true,
      data: stats,
      message: 'System statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get system statistics error:', error);
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
