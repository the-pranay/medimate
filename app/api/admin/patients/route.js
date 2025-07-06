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

// GET all patients (admin only)
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
    const bloodGroup = searchParams.get('bloodGroup');
    const gender = searchParams.get('gender');
    const ageRange = searchParams.get('ageRange');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

    let query = { role: 'patient' };

    // Filter by blood group
    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }

    // Filter by gender
    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    // Filter by age range
    if (ageRange && ageRange !== 'all') {
      const [minAge, maxAge] = ageRange.split('-').map(age => parseInt(age));
      if (maxAge) {
        query.age = { $gte: minAge, $lte: maxAge };
      } else {
        query.age = { $gte: minAge };
      }
    }

    // Filter by status
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get patients with pagination
    const patients = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count
    const totalPatients = await User.countDocuments(query);

    // Get statistics
    const totalCount = await User.countDocuments({ role: 'patient' });
    const activeCount = await User.countDocuments({ role: 'patient', isActive: true });
    const verifiedCount = await User.countDocuments({ role: 'patient', isVerified: true });

    // Get demographic statistics
    const genderStats = await User.aggregate([
      { $match: { role: 'patient' } },
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const bloodGroupStats = await User.aggregate([
      { $match: { role: 'patient' } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const ageGroupStats = await User.aggregate([
      { $match: { role: 'patient' } },
      {
        $group: {
          _id: {
            $cond: [
              { $lt: ['$age', 18] }, 'Under 18',
              { $cond: [
                { $lt: ['$age', 30] }, '18-29',
                { $cond: [
                  { $lt: ['$age', 50] }, '30-49',
                  { $cond: [
                    { $lt: ['$age', 65] }, '50-64',
                    '65+'
                  ]}
                ]}
              ]}
            ]
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: patients,
      pagination: {
        page,
        limit,
        total: totalPatients,
        totalPages: Math.ceil(totalPatients / limit),
        hasNext: page < Math.ceil(totalPatients / limit),
        hasPrev: page > 1,
      },
      statistics: {
        total: totalCount,
        active: activeCount,
        verified: verifiedCount,
        demographics: {
          gender: genderStats,
          bloodGroup: bloodGroupStats,
          ageGroups: ageGroupStats,
        },
      },
    });

  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Create new patient (admin only)
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

    const patientData = await request.json();
    
    // Validate required fields
    if (!patientData.name || !patientData.email || !patientData.phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if patient already exists
    const existingPatient = await User.findOne({ email: patientData.email });
    if (existingPatient) {
      return NextResponse.json(
        { success: false, message: 'Patient with this email already exists' },
        { status: 409 }
      );
    }

    const newPatient = new User({
      ...patientData,
      role: 'patient',
      password: 'temp_password_123', // Should be changed on first login
    });

    await newPatient.save();

    // Remove password from response
    const { password, ...patientResponse } = newPatient.toObject();

    return NextResponse.json({
      success: true,
      message: 'Patient created successfully',
      data: patientResponse,
    });

  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT - Update patient (admin only)
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

    const { patientId, ...updateData } = await request.json();
    
    if (!patientId) {
      return NextResponse.json(
        { success: false, message: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedPatient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient,
    });

  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete patient (admin only)
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
    const patientId = searchParams.get('patientId');
    
    if (!patientId) {
      return NextResponse.json(
        { success: false, message: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const deletedPatient = await User.findByIdAndDelete(patientId);

    if (!deletedPatient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Patient deleted successfully',
    });

  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
