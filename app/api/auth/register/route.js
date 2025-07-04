import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request) {
  try {
    console.log('📝 Registration request received');
    
    const connection = await connectDB();
    if (!connection) {
      console.error('❌ Database connection failed');
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 503, headers: corsHeaders }
      );
    }

    const requestData = await request.json();
    console.log('📋 Request data:', JSON.stringify(requestData, null, 2));
    
    const { name, email, password, phone, role, ...additionalData } = requestData;

    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
      console.error('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password, phone: !!phone, role: !!role });
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('🔒 Password hashed successfully');

    // Create user object - filter out empty/undefined values for doctor-specific fields
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      isVerified: false,
      isActive: true,
    };

    // Add additional data, filtering out empty strings and undefined values
    Object.keys(additionalData).forEach(key => {
      const value = additionalData[key];
      if (value !== '' && value !== null && value !== undefined) {
        userData[key] = value;
      }
    });

    console.log('👤 Creating user with data:', JSON.stringify({...userData, password: '[HIDDEN]'}, null, 2));

    // Create user in database
    const newUser = new User(userData);
    await newUser.save();
    console.log('✅ User created successfully:', newUser._id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    console.log('🎉 Registration successful for:', email);
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
      },
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('💥 Registration error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
