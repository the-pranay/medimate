import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../lib/models/User';

// Helper function to verify JWT token and check admin role
const verifyAdminToken = (authorization) => {
  if (!authorization) return null;
  
  const token = authorization.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    if (decoded.role !== 'admin') return null;
    return decoded;
  } catch (error) {
    return null;
  }
};

export async function GET(request) {
  try {
    // Verify admin authorization
    const authorization = request.headers.get('Authorization');
    const decoded = verifyAdminToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Connect to database
    const dbConnection = await connectDB();
    if (!dbConnection) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get all doctors that need verification (pending or processed)
    const pendingDoctors = await User.find({ 
      role: 'doctor', 
      $or: [
        { isVerified: false },
        { rejectedAt: { $exists: true } }
      ]
    })
    .select('-password') // Exclude password field
    .sort({ createdAt: -1 }); // Most recent first

    return NextResponse.json({
      success: true,
      data: pendingDoctors,
      total: pendingDoctors.length
    });

  } catch (error) {
    console.error('Get pending doctors error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
