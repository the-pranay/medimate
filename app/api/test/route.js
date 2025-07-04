import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/mongodb';

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request) {
  try {
    console.log('🔍 Testing API endpoint...');
    
    // Test environment variables
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasJwtSecret = !!process.env.JWT_SECRET;
    
    // Test database connection
    let dbConnected = false;
    try {
      const connection = await connectDB();
      dbConnected = !!connection;
    } catch (error) {
      console.log('DB Connection Error:', error.message);
    }
    
    // Test password hashing
    const testPassword = 'demo123';
    const testHash = '$2a$12$OrwUEPscqSOsF76sE5U2N./iv/X6xMHC1PKDGJDKqKPLIHAM2nBly';
    const hashWorks = await bcrypt.compare(testPassword, testHash);
    
    // Test fallback users
    const fallbackUsers = [
      {
        _id: "temp_patient_1",
        name: "Demo Patient",
        email: "patient@demo.com",
        password: "$2a$12$OrwUEPscqSOsF76sE5U2N./iv/X6xMHC1PKDGJDKqKPLIHAM2nBly",
        role: "patient",
        isActive: true,
      }
    ];
    
    const testUser = fallbackUsers.find(u => u.email === 'patient@demo.com');
    const userFound = !!testUser;
    const passwordMatches = testUser ? await bcrypt.compare(testPassword, testUser.password) : false;
    
    return NextResponse.json({
      success: true,
      message: 'API Test Results',
      data: {
        environment: process.env.NODE_ENV,
        hasDbUrl,
        hasJwtSecret,
        dbConnected,
        hashWorks,
        userFound,
        passwordMatches,
        timestamp: new Date().toISOString()
      }
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('API Test Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Test failed', 
        error: error.message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
