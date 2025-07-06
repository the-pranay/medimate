import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../../lib/mongodb';

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

// POST - Clear collection
export async function POST(request) {
  try {
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

    const { collection } = await request.json();
    
    if (!collection) {
      return NextResponse.json(
        { success: false, message: 'Collection name is required' },
        { status: 400 }
      );
    }

    const connection = await connectDB();
    
    if (!connection) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    const db = connection.connection.db;
    
    // Clear the collection
    const result = await db.collection(collection).deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Collection '${collection}' cleared successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Clear collection error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
