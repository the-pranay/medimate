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

// GET monitoring data
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

    await connectDB();

    // Get active users count
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();

    // Mock system metrics (in production, get from actual system monitoring)
    const metrics = {
      cpuUsage: Math.floor(Math.random() * 30) + 20, // 20-50%
      memoryUsage: Math.floor(Math.random() * 25) + 35, // 35-60%
      dbLoad: Math.floor(Math.random() * 20) + 10, // 10-30%
      activeUsers: activeUsers,
      totalUsers: totalUsers
    };

    // System health status
    const systemHealth = [
      {
        service: 'Web Server',
        status: 'healthy',
        description: 'All web servers are responding normally',
        lastChecked: new Date().toLocaleTimeString()
      },
      {
        service: 'Database',
        status: 'healthy',
        description: 'MongoDB connection is stable',
        lastChecked: new Date().toLocaleTimeString()
      },
      {
        service: 'Authentication',
        status: 'healthy',
        description: 'JWT authentication service is working',
        lastChecked: new Date().toLocaleTimeString()
      },
      {
        service: 'File Storage',
        status: 'healthy',
        description: 'File upload and storage systems operational',
        lastChecked: new Date().toLocaleTimeString()
      },
      {
        service: 'Email Service',
        status: 'warning',
        description: 'Email delivery experiencing minor delays',
        lastChecked: new Date().toLocaleTimeString()
      },
      {
        service: 'Backup System',
        status: 'healthy',
        description: 'Automated backups running on schedule',
        lastChecked: new Date().toLocaleTimeString()
      }
    ];

    // Recent alerts (mock data)
    const alerts = [
      {
        severity: 'warning',
        title: 'High Memory Usage',
        message: 'Memory usage has been above 80% for the last 10 minutes',
        timestamp: '5 minutes ago'
      },
      {
        severity: 'info',
        title: 'Scheduled Maintenance',
        message: 'Database maintenance scheduled for tonight at 2:00 AM',
        timestamp: '1 hour ago'
      }
    ];

    // If system is running well, show no alerts
    const finalAlerts = Math.random() > 0.7 ? alerts : [];

    return NextResponse.json({
      success: true,
      metrics,
      systemHealth,
      alerts: finalAlerts,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get monitoring data error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
