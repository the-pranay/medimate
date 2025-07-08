import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import Appointment from '../../../../lib/models/Appointment';
import MedicalRecord from '../../../../lib/models/MedicalRecord';

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

// GET system settings and statistics (admin only)
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
    if (decoded.role !== 'admin' && decoded.email !== 'thepranay2004@gmail.com') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get comprehensive system statistics
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const systemStats = {
      users: {
        total: await User.countDocuments(),
        active: await User.countDocuments({ isActive: true }),
        doctors: await User.countDocuments({ role: 'doctor' }),
        patients: await User.countDocuments({ role: 'patient' }),
        admins: await User.countDocuments({ role: 'admin' }),
        newThisWeek: await User.countDocuments({ 
          createdAt: { $gte: lastWeek } 
        }),
        newThisMonth: await User.countDocuments({ 
          createdAt: { $gte: lastMonth } 
        })
      },
      appointments: {
        total: await Appointment.countDocuments(),
        scheduled: await Appointment.countDocuments({ status: 'scheduled' }),
        completed: await Appointment.countDocuments({ status: 'completed' }),
        cancelled: await Appointment.countDocuments({ status: 'cancelled' }),
        pending: await Appointment.countDocuments({ status: 'pending' }),
        todayTotal: await Appointment.countDocuments({
          appointmentDate: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
          }
        }),
        thisWeek: await Appointment.countDocuments({ 
          createdAt: { $gte: lastWeek } 
        }),
        thisMonth: await Appointment.countDocuments({ 
          createdAt: { $gte: lastMonth } 
        })
      },
      reports: {
        total: await MedicalRecord.countDocuments(),
        pending: await MedicalRecord.countDocuments({ status: 'pending' }),
        approved: await MedicalRecord.countDocuments({ status: 'approved' }),
        thisWeek: await MedicalRecord.countDocuments({ 
          createdAt: { $gte: lastWeek } 
        }),
        thisMonth: await MedicalRecord.countDocuments({ 
          createdAt: { $gte: lastMonth } 
        })
      }
    };

    // Get recent activity
    const recentUsers = await User.find()
      .select('name email role createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .select('appointmentDate appointmentTime status createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // System settings (these could be stored in a settings collection)
    const systemSettings = {
      appName: 'MediMate',
      version: '1.0.0',
      maintenanceMode: false,
      registrationEnabled: true,
      appointmentBookingEnabled: true,
      maxAppointmentsPerDay: 50,
      workingHours: {
        start: '09:00',
        end: '18:00'
      },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeZone: 'Asia/Kolkata',
      defaultConsultationFee: 500,
      emergencyContact: '+91 9876543210',
      supportEmail: 'support@medimate.com'
    };

    return NextResponse.json({
      success: true,
      data: {
        stats: systemStats,
        recentActivity: {
          users: recentUsers,
          appointments: recentAppointments
        },
        settings: systemSettings
      }
    });

  } catch (error) {
    console.error('Get system settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Update system settings (admin only)
export async function POST(request) {
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

    if (decoded.role !== 'admin' && decoded.email !== 'thepranay2004@gmail.com') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { action, settings } = await request.json();
    
    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Action is required' },
        { status: 400 }
      );
    }

    let result = {};

    switch (action) {
      case 'toggleMaintenance':
        // In a real app, this would update a settings collection
        result = {
          maintenanceMode: !settings?.maintenanceMode,
          message: 'Maintenance mode toggled'
        };
        break;

      case 'updateWorkingHours':
        if (!settings?.workingHours) {
          return NextResponse.json(
            { success: false, message: 'Working hours data required' },
            { status: 400 }
          );
        }
        result = {
          workingHours: settings.workingHours,
          message: 'Working hours updated'
        };
        break;

      case 'updateGeneralSettings':
        result = {
          ...settings,
          message: 'Settings updated successfully'
        };
        break;

      case 'systemCleanup':
        // Perform system cleanup operations
        const oldAppointments = await Appointment.deleteMany({
          status: 'cancelled',
          createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
        });
        
        result = {
          message: 'System cleanup completed',
          cleaned: {
            oldAppointments: oldAppointments.deletedCount
          }
        };
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Operation completed',
      data: result
    });

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT - Update admin settings
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

    const settingsData = await request.json();
    
    // Store settings in localStorage or database (for now just return success)
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: settingsData
    });

  } catch (error) {
    console.error('Update admin settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
