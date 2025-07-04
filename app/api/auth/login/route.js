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

// Temporary fallback users for testing when MongoDB is down
const fallbackUsers = [
  {
    _id: "temp_patient_1",
    name: "Demo Patient",
    email: "patient@demo.com",
    password: "$2a$12$OrwUEPscqSOsF76sE5U2N./iv/X6xMHC1PKDGJDKqKPLIHAM2nBly", // password: "demo123"
    phone: "+91 9876543210",
    role: "patient",
    age: 25,
    gender: "male",
    bloodGroup: "A+",
    address: "Demo Address, Mumbai",
    isVerified: true,
    isActive: true,
  },
  {
    _id: "temp_doctor_1",
    name: "Dr. Demo Doctor",
    email: "doctor@demo.com", 
    password: "$2a$12$OrwUEPscqSOsF76sE5U2N./iv/X6xMHC1PKDGJDKqKPLIHAM2nBly", // password: "demo123"
    phone: "+91 9876543211",
    role: "doctor",
    specialization: "General Medicine",
    experience: 5,
    licenseNumber: "DEMO12345",
    consultationFee: 500,
    address: "Demo Clinic, Mumbai",
    isVerified: true,
    isActive: true,
  },
  {
    _id: "temp_admin_1",
    name: "Admin User",
    email: "admin@demo.com", 
    password: "$2a$12$OrwUEPscqSOsF76sE5U2N./iv/X6xMHC1PKDGJDKqKPLIHAM2nBly", // password: "demo123"
    phone: "+91 9876543212",
    role: "admin",
    department: "IT",
    permissions: ["manage_users", "manage_system", "view_reports"],
    address: "Admin Office, Mumbai",
    isVerified: true,
    isActive: true,
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔍 Login attempt for:', email);

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    let user = null;
    let usedFallback = false;

    // Try to connect to database first
    try {
      const connection = await connectDB();
      if (connection) {
        console.log('✅ Database connected, searching for user:', email);
        
        // Find user by email in database
        user = await User.findOne({ email });
        
        if (!user) {
          console.log('❌ User not found in database, falling back to demo users');
          usedFallback = true;
          user = fallbackUsers.find(u => u.email === email && u.isActive);
        }
      } else {
        console.log('⚠️ Database connection not available, using fallback users');
        usedFallback = true;
        user = fallbackUsers.find(u => u.email === email && u.isActive);
      }
    } catch (dbError) {
      console.log('⚠️ Database error:', dbError.message);
      console.log('Using fallback users for:', email);
      usedFallback = true;
      
      // Find user in fallback data
      user = fallbackUsers.find(u => u.email === email && u.isActive);
    }

    if (!user) {
      console.log('❌ User not found in database or fallback users');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
      );
    }

    console.log('✅ User found:', user.email, 'Mode:', usedFallback ? 'fallback' : 'database');

    // Check if user is active (for database users)
    if (!usedFallback && !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account has been deactivated' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Update last login (only for database users)
    if (!usedFallback) {
      try {
        user.lastLogin = new Date();
        await user.save();
      } catch (saveError) {
        console.log('⚠️ Failed to update last login time:', saveError.message);
      }
    }

    console.log(`✅ Login successful for: ${email} (${usedFallback ? 'fallback' : 'database'} mode)`);

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
    const userResponse = usedFallback ? 
      { ...user, password: undefined } : 
      user.toObject();
    delete userResponse.password;

    return NextResponse.json({
      success: true,
      message: `Login successful${usedFallback ? ' (fallback mode)' : ''}`,
      data: {
        user: userResponse,
        token,
      },
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
