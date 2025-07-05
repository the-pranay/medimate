import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import Appointment from '../../../../lib/models/Appointment';
import MedicalReport from '../../../../lib/models/MedicalReport';

export async function GET() {
  try {
    await connectDB();

    // Get statistics
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      completedAppointments,
      totalReports,
      todayAppointments
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'completed' }),
      MedicalReport.countDocuments(),
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      })
    ]);

    // Calculate success rate
    const successRate = totalAppointments > 0 
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0;

    // Get active doctors (those with appointments in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeDoctors = await Appointment.distinct('doctor', {
      appointmentDate: { $gte: thirtyDaysAgo }
    });

    const stats = {
      totalPatients,
      totalDoctors,
      activeDoctors: activeDoctors.length,
      totalAppointments,
      completedAppointments,
      successRate,
      totalReports,
      todayAppointments
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
