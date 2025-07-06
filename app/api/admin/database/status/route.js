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

// GET database status and collections
export async function GET(request) {
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

    const connection = await connectDB();
    
    if (!connection) {
      return NextResponse.json({
        success: true,
        status: {
          connected: false,
          database: null
        },
        collections: []
      });
    }

    // Get database info
    const db = connection.connection.db;
    const collections = await db.listCollections().toArray();
    
    // Get collection stats
    const collectionStats = await Promise.all(
      collections.map(async (col) => {
        try {
          const stats = await db.collection(col.name).stats();
          const count = await db.collection(col.name).countDocuments();
          
          return {
            name: col.name,
            count: count,
            size: stats.size || 0,
            lastModified: new Date().toISOString()
          };
        } catch (error) {
          return {
            name: col.name,
            count: 0,
            size: 0,
            lastModified: 'N/A'
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      status: {
        connected: true,
        database: db.databaseName,
        server: 'MongoDB Atlas'
      },
      collections: collectionStats
    });

  } catch (error) {
    console.error('Database status error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
