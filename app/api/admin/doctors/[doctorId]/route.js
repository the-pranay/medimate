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

// DELETE a doctor (admin only)
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

    const { doctorId } = params;

    // Find and delete the doctor
    const deletedDoctor = await User.findOneAndDelete({ 
      _id: doctorId, 
      role: 'doctor' 
    });

    if (!deletedDoctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doctor deleted successfully',
      data: { deletedDoctorId: doctorId }
    });

  } catch (error) {
    console.error('Delete doctor error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT update a doctor (admin only)
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

    const { doctorId } = params;
    const updateData = await request.json();

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData._id;
    delete updateData.role; // Ensure role can't be changed

    const updatedDoctor = await User.findOneAndUpdate(
      { _id: doctorId, role: 'doctor' },
      { ...updateData, updatedAt: new Date() },
      { new: true, select: '-password' }
    );

    if (!updatedDoctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor
    });

  } catch (error) {
    console.error('Update doctor error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PATCH method for doctor verification (admin only)
export async function PATCH(request, { params }) {
  try {
    // Connect to database
    const dbConnection = await connectDB();
    if (!dbConnection) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

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

    const { doctorId } = await params;
    const { action, rejectionReason } = await request.json();

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Find the doctor
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Check if doctor is already verified
    if (doctor.isVerified && action === 'approve') {
      return NextResponse.json(
        { success: false, message: 'Doctor is already verified' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {};
    
    if (action === 'approve') {
      updateData.isVerified = true;
      updateData.verifiedBy = decoded.userId || decoded.id; // Try both userId and id
      updateData.verifiedAt = new Date();
      updateData.isActive = true; // Ensure doctor is active
      // Clear any previous rejection data
      updateData.rejectedBy = null;
      updateData.rejectedAt = null;
      updateData.rejectionReason = null;
    } else if (action === 'reject') {
      updateData.isVerified = false;
      updateData.rejectedBy = decoded.userId || decoded.id; // Try both userId and id
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = rejectionReason || 'No reason provided';
      updateData.isActive = false; // Deactivate rejected doctor
      // Clear any previous verification data
      updateData.verifiedBy = null;
      updateData.verifiedAt = null;
    }

    console.log('Update data:', updateData); // Debug log

    // Update the doctor
    const updatedDoctor = await User.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true, select: '-password' }
    );

    console.log('Updated doctor:', updatedDoctor?.isVerified); // Debug log

    if (!updatedDoctor) {
      return NextResponse.json(
        { success: false, message: 'Failed to update doctor verification status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Doctor ${action}d successfully`,
      data: {
        doctorId: updatedDoctor._id,
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        isVerified: updatedDoctor.isVerified,
        verifiedAt: updatedDoctor.verifiedAt,
        verifiedBy: updatedDoctor.verifiedBy,
        rejectedAt: updatedDoctor.rejectedAt,
        rejectedBy: updatedDoctor.rejectedBy,
        rejectionReason: updatedDoctor.rejectionReason
      }
    });

  } catch (error) {
    console.error('Doctor verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
