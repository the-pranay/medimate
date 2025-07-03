import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Temporary fallback users for testing when MongoDB is down
const fallbackUsers = [
  {
    _id: "temp_patient_1",
    name: "Test Patient",
    email: "patient@test.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5QD7pnQ2qm", // password: "password123"
    phone: "+91 9876543210",
    role: "patient",
    age: 25,
    gender: "male",
    bloodGroup: "A+",
    address: "Test Address, Mumbai",
    isVerified: true,
    isActive: true,
  },
  {
    _id: "temp_doctor_1",
    name: "Dr. Test Doctor",
    email: "doctor@test.com", 
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5QD7pnQ2qm", // password: "password123"
    phone: "+91 9876543211",
    role: "doctor",
    specialization: "General Medicine",
    experience: 5,
    licenseNumber: "TEST12345",
    consultationFee: 500,
    address: "Test Clinic, Mumbai",
    isVerified: true,
    isActive: true,
  }
];

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
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('🔍 Attempting fallback login for:', email);

    // Find user in fallback data
    const user = fallbackUsers.find(u => u.email === email && u.isActive);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
      );
    }

    console.log('✅ Fallback login successful for:', email);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    return NextResponse.json({
      success: true,
      message: 'Login successful (fallback mode)',
      data: {
        user: userResponse,
        token,
      },
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Fallback login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
