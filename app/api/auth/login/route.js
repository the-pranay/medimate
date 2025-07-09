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
    name: "Pranay Admin",
    email: process.env.ADMIN_EMAIL || "thepranay2004@gmail.com", 
    password: "$2a$12$5JJxSTSi/GQvQj5IzXscv.LHZ9RSGyzISSBiMyTtAkRVTV8jc9ajC", // password: "admin@30"
    phone: "+91 9876543212",
    role: "admin",
    department: "IT",
    permissions: ["manage_users", "manage_system", "view_reports", "manage_doctors", "manage_patients"],
    address: "Admin Office, Mumbai",
    isVerified: true,
    isActive: true,
  },
  {
    _id: "temp_admin_2",
    name: "Admin User",
    email: "admin@demo.com", 
    password: "$2a$12$OrwUEPscqSOsF76sE5U2N./iv/X6xMHC1PKDGJDKqKPLIHAM2nBly", // password: "demo123"
    phone: "+91 9876543213",
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

    // Special admin access for configured admin email
    const adminEmail = process.env.ADMIN_EMAIL || 'thepranay2004@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@30';
    
    if (email === adminEmail) {
      console.log('🔑 Special admin access granted for:', email);
      
      // Check if password matches admin password
      if (password !== adminPassword) {
        console.log('❌ Invalid admin password for:', email);
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401, headers: corsHeaders }
        );
      }
      
      // If user doesn't exist in database, create admin user
      if (!user && !usedFallback) {
        try {
          const hashedPassword = await bcrypt.hash(adminPassword, 12);
          user = new User({
            name: 'Pranay Admin',
            email: adminEmail,
            password: hashedPassword,
            phone: '+91 9876543212',
            role: 'admin',
            department: 'IT',
            permissions: ['manage_users', 'manage_system', 'view_reports', 'manage_doctors', 'manage_patients'],
            isVerified: true,
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
          });
          await user.save();
          console.log('✅ Created new admin user for:', email);
        } catch (createError) {
          console.log('⚠️ Failed to create admin user, using fallback');
          usedFallback = true;
          user = fallbackUsers.find(u => u.email === email);
        }
      }
      
      // Ensure admin role is set
      if (user && user.role !== 'admin') {
        if (!usedFallback) {
          user.role = 'admin';
          user.permissions = ['manage_users', 'manage_system', 'view_reports', 'manage_doctors', 'manage_patients'];
          await user.save();
          console.log('✅ Upgraded user to admin:', email);
        }
      }
      
      // For admin access, skip regular password validation
      console.log(`✅ Admin login successful for: ${email}`);
      
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

      console.log('✅ Admin login successful for:', email);
      console.log('🔍 User role being returned:', userResponse.role);
      console.log('🔍 Full user object:', JSON.stringify(userResponse, null, 2));

      return NextResponse.json({
        success: true,
        message: `Admin login successful${usedFallback ? ' (fallback mode)' : ''}`,
        data: {
          user: userResponse,
          token,
        },
      }, { headers: corsHeaders });
    }

    // Check if user is active (for database users)
    if (!usedFallback && !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account has been deactivated' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check if doctor is verified (for database users)
    if (!usedFallback && user.role === 'doctor' && !user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Your doctor account is pending verification by admin. Please wait for approval.' },
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
    console.log('🔍 User role being returned:', user.role);

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

    console.log('🔍 Final user object:', JSON.stringify(userResponse, null, 2));

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
