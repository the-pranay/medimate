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

// GET admin profile
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
    const adminEmail = process.env.ADMIN_EMAIL || 'thepranay2004@gmail.com';
    if (decoded.role !== 'admin' && decoded.email !== adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    let user = await User.findById(decoded.id).select('-password');
    
    // If user not found and this is admin email, create admin user
    if (!user && decoded.email === adminEmail) {
      user = new User({
        name: 'Admin User',
        email: adminEmail,
        password: 'placeholder', // This won't be used since admin logs in via special auth
        role: 'admin',
        isActive: true,
        isVerified: true,
        phone: '+91 9999999999',
        address: 'MediMate Headquarters'
      });
      await user.save();
      user = await User.findById(user._id).select('-password');
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT update admin profile
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
    const adminEmail = process.env.ADMIN_EMAIL || 'thepranay2004@gmail.com';
    if (decoded.role !== 'admin' && decoded.email !== adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const updateData = await request.json();
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData._id;
    delete updateData.role;
    delete updateData.joinedDate;
    delete updateData.lastLogin;

    let updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, select: '-password' }
    );

    // If user not found and this is admin email, create admin user
    if (!updatedUser && decoded.email === adminEmail) {
      updatedUser = new User({
        ...updateData,
        email: adminEmail,
        password: 'placeholder', // This won't be used since admin logs in via special auth
        role: 'admin',
        isActive: true,
        isVerified: true,
        updatedAt: new Date()
      });
      await updatedUser.save();
      updatedUser = await User.findById(updatedUser._id).select('-password');
    }

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
