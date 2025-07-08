import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../lib/models/User';

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

// DELETE a patient (admin only)
export async function DELETE(request, { params }) {
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
    const adminEmail = process.env.ADMIN_EMAIL || 'thepranay2004@gmail.com';
    if (decoded.role !== 'admin' && decoded.email !== adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { patientId } = params;

    // Find and delete the patient
    const deletedPatient = await User.findOneAndDelete({ 
      _id: patientId, 
      role: 'patient' 
    });

    if (!deletedPatient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Patient deleted successfully',
      data: { deletedPatientId: patientId }
    });

  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT update a patient (admin only)
export async function PUT(request, { params }) {
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
    const adminEmail = process.env.ADMIN_EMAIL || 'thepranay2004@gmail.com';
    if (decoded.role !== 'admin' && decoded.email !== adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { patientId } = params;
    const updateData = await request.json();

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData._id;
    delete updateData.role; // Ensure role can't be changed

    const updatedPatient = await User.findOneAndUpdate(
      { _id: patientId, role: 'patient' },
      { ...updateData, updatedAt: new Date() },
      { new: true, select: '-password' }
    );

    if (!updatedPatient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });

  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
