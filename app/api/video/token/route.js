import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Appointment from '../../../../lib/models/Appointment';
import User from '../../../../lib/models/User';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

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

// POST - Generate Agora token for video call
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

    const { appointmentId, channelName, uid } = await request.json();

    if (!appointmentId || !channelName || !uid) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: appointmentId, channelName, uid' },
        { status: 400 }
      );
    }

    // Verify appointment exists and user is participant
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email')
      .populate('doctor', 'name email');

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if user is participant in the appointment
    const isParticipant = 
      appointment.patient._id.toString() === decoded.userId ||
      appointment.doctor._id.toString() === decoded.userId;

    if (!isParticipant) {
      return NextResponse.json(
        { success: false, message: 'Not authorized for this appointment' },
        { status: 403 }
      );
    }

    // Generate Agora token
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    
    console.log('Environment check:', {
      appId: appId ? 'Set' : 'Missing',
      appCertificate: appCertificate ? 'Set' : 'Missing',
      appointmentId,
      channelName,
      uid
    });
    
    if (!appId || !appCertificate) {
      console.error('Missing Agora configuration:', { appId: !!appId, appCertificate: !!appCertificate });
      return NextResponse.json(
        { success: false, message: 'Agora configuration missing. Please check environment variables.' },
        { status: 500 }
      );
    }

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return NextResponse.json({
      success: true,
      data: {
        token,
        appId,
        channelName,
        uid,
        appointment: {
          id: appointment._id,
          patient: appointment.patient,
          doctor: appointment.doctor,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
          status: appointment.status
        }
      }
    });

  } catch (error) {
    console.error('Generate video token error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
