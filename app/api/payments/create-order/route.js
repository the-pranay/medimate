import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import connectDB from '../../../../lib/mongodb';
import Appointment from '../../../../lib/models/Appointment';
import User from '../../../../lib/models/User';

// Initialize Razorpay with error handling
let razorpay;
try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    console.error('Razorpay credentials not found in environment variables');
    console.log('RAZORPAY_KEY_ID:', keyId ? 'Present' : 'Missing');
    console.log('RAZORPAY_KEY_SECRET:', keySecret ? 'Present' : 'Missing');
  } else {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log('Razorpay initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Razorpay:', error);
}

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

    const { appointmentId, amount, doctorId } = await request.json();

    // Validate required fields
    if (!appointmentId || !amount || !doctorId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'name consultationFee')
      .populate('patient', 'name email phone');

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Verify the patient is the one making the payment
    if (appointment.patient._id.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to pay for this appointment' },
        { status: 403 }
      );
    }

    // Check if Razorpay is initialized
    if (!razorpay) {
      return NextResponse.json(
        { success: false, message: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paisa
      currency: 'INR',
      receipt: `apt_${appointmentId.slice(-10)}_${Date.now().toString().slice(-6)}`,
      notes: {
        appointmentId: appointmentId,
        doctorId: doctorId,
        patientId: decoded.userId,
        doctorName: appointment.doctor.name,
        patientName: appointment.patient.name,
      }
    };

    const order = await razorpay.orders.create(options);

    // Update appointment with order details for webhook tracking
    appointment.payment = {
      ...appointment.payment,
      orderId: order.id,
      amount: order.amount / 100, // Convert back to rupees
      currency: order.currency,
      status: 'pending',
      createdAt: new Date()
    };
    
    await appointment.save();

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKey: process.env.RAZORPAY_KEY_ID,
        appointment: {
          id: appointment._id,
          doctorName: appointment.doctor.name,
          patientName: appointment.patient.name,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
        }
      }
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
