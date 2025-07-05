import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '../../../../lib/mongodb';
import Appointment from '../../../../lib/models/Appointment';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('Webhook signature verification failed');
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    console.log('Webhook event received:', event.event);

    switch (event.event) {
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
      
      case 'payment.captured':
        await handlePaymentCaptured(event);
        break;
      
      case 'order.paid':
        await handleOrderPaid(event);
        break;
      
      case 'payment.authorized':
        await handlePaymentAuthorized(event);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentFailed(event) {
  try {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    
    console.log('Payment failed for order:', orderId);
    console.log('Error details:', {
      code: payment.error_code,
      description: payment.error_description,
      reason: payment.error_reason,
      source: payment.error_source,
      step: payment.error_step
    });

    // Find appointment by order ID
    const appointment = await Appointment.findOne({
      'payment.orderId': orderId
    });

    if (appointment) {
      // Update appointment payment status
      appointment.payment = {
        ...appointment.payment,
        status: 'failed',
        failureReason: payment.error_description,
        errorCode: payment.error_code,
        errorSource: payment.error_source,
        failedAt: new Date()
      };

      await appointment.save();
      
      // Log specific error types
      if (payment.error_description?.toLowerCase().includes('international')) {
        console.log('International card error detected via webhook');
      }
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCaptured(event) {
  try {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    
    console.log('Payment captured for order:', orderId);

    // Find appointment by order ID
    const appointment = await Appointment.findOne({
      'payment.orderId': orderId
    });

    if (appointment) {
      // Update appointment payment status
      appointment.payment = {
        ...appointment.payment,
        status: 'captured',
        transactionId: payment.id,
        capturedAt: new Date()
      };

      appointment.status = 'confirmed';
      await appointment.save();
    }
  } catch (error) {
    console.error('Error handling payment capture:', error);
  }
}

async function handleOrderPaid(event) {
  try {
    const order = event.payload.order.entity;
    const orderId = order.id;
    
    console.log('Order paid:', orderId);

    // Find appointment by order ID
    const appointment = await Appointment.findOne({
      'payment.orderId': orderId
    });

    if (appointment) {
      // Update appointment payment status
      appointment.payment = {
        ...appointment.payment,
        status: 'paid',
        paidAt: new Date()
      };

      appointment.status = 'confirmed';
      await appointment.save();
    }
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}

async function handlePaymentAuthorized(event) {
  try {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    
    console.log('Payment authorized for order:', orderId);

    // Find appointment by order ID
    const appointment = await Appointment.findOne({
      'payment.orderId': orderId
    });

    if (appointment) {
      // Update appointment payment status
      appointment.payment = {
        ...appointment.payment,
        status: 'authorized',
        transactionId: payment.id,
        authorizedAt: new Date()
      };

      await appointment.save();
    }
  } catch (error) {
    console.error('Error handling payment authorization:', error);
  }
}
