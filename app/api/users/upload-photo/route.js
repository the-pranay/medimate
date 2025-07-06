import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import { uploadFileToCloudinary } from '../../../../lib/cloudinary';

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

export async function POST(request) {
  console.log('Upload photo API called');
  
  try {
    await connectDB();
    
    const authorization = request.headers.get('Authorization');
    console.log('Authorization header:', authorization ? 'Present' : 'Missing');
    
    const decoded = verifyToken(authorization);
    console.log('Token decoded:', decoded ? 'Success' : 'Failed');
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('profilePicture');
    console.log('File received:', file ? file.name : 'No file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueFilename = `${decoded.userId}_${Date.now()}`;
    
    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary
    const uploadResult = await uploadFileToCloudinary(
      buffer, 
      uniqueFilename, 
      'profile-pictures'
    );
    
    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to upload image to cloud storage' },
        { status: 500 }
      );
    }

    console.log('Cloudinary upload successful:', uploadResult.url);

    // Update user profile with new photo URL
    const profilePictureUrl = uploadResult.url;
    console.log('Profile picture URL:', profilePictureUrl);
    
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { profilePicture: profilePictureUrl },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User updated with new profile picture');

    return NextResponse.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        profilePicture: profilePictureUrl,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture
        }
      }
    });

  } catch (error) {
    console.error('Error uploading profile photo:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error: ' + error.message,
        error: error.toString()
      },
      { status: 500 }
    );
  }
}
