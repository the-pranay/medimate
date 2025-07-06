import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
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

// GET all doctors (admin only)
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
    const specialization = searchParams.get('specialization');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

    let query = { role: 'doctor' };

    // Filter by specialization
    if (specialization && specialization !== 'all') {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    // Filter by status
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get doctors with pagination
    const doctors = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count
    const totalDoctors = await User.countDocuments(query);

    // Get statistics
    const totalCount = await User.countDocuments({ role: 'doctor' });
    const activeCount = await User.countDocuments({ role: 'doctor', isActive: true });
    const verifiedCount = await User.countDocuments({ role: 'doctor', isVerified: true });

    // Get specialization distribution
    const specializationStats = await User.aggregate([
      { $match: { role: 'doctor' } },
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        page,
        limit,
        total: totalDoctors,
        totalPages: Math.ceil(totalDoctors / limit),
        hasNext: page < Math.ceil(totalDoctors / limit),
        hasPrev: page > 1,
      },
      statistics: {
        total: totalCount,
        active: activeCount,
        verified: verifiedCount,
        specializations: specializationStats,
      },
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Create new doctor (admin only)
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

    // Check if user is admin or has special admin email
    if (decoded.role !== 'admin' && decoded.email !== 'thepranay2004@gmail.com') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const doctorData = await request.json();
    
    // Validate required fields
    if (!doctorData.name || !doctorData.email || !doctorData.specialization) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if doctor already exists
    const existingDoctor = await User.findOne({ email: doctorData.email });
    if (existingDoctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor with this email already exists' },
        { status: 409 }
      );
    }

    const newDoctor = new User({
      ...doctorData,
      role: 'doctor',
      password: 'temp_password_123', // Should be changed on first login
    });

    await newDoctor.save();

    // Remove password from response
    const { password, ...doctorResponse } = newDoctor.toObject();

    return NextResponse.json({
      success: true,
      message: 'Doctor created successfully',
      data: doctorResponse,
    });

  } catch (error) {
    console.error('Create doctor error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT - Update doctor (admin only)
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

    // Check if user is admin or has special admin email
    if (decoded.role !== 'admin' && decoded.email !== 'thepranay2004@gmail.com') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { doctorId, ...updateData } = await request.json();
    
    if (!doctorId) {
      return NextResponse.json(
        { success: false, message: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    const updatedDoctor = await User.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedDoctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor,
    });

  } catch (error) {
    console.error('Update doctor error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete doctor (admin only)
export async function DELETE(request) {
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
    const doctorId = searchParams.get('doctorId');
    
    if (!doctorId) {
      return NextResponse.json(
        { success: false, message: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    const deletedDoctor = await User.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doctor deleted successfully',
    });

  } catch (error) {
    console.error('Delete doctor error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
