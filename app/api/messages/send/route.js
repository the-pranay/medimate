import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import jwt from 'jsonwebtoken';

// Simple message sending system for demo
export async function POST(request) {
  try {
    await connectDB();
    
    const { conversationId, message, sender } = await request.json();
    
    // Verify JWT token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'No token provided' 
      }, { status: 401 });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
    
    // For demo, just return success
    // In production, you would save to database
    const newMessage = {
      id: 'msg_' + Date.now(),
      text: message,
      time: new Date().toISOString(),
      sender: sender,
      senderName: decoded.name || 'User',
      read: false
    };
    
    return NextResponse.json({ 
      success: true, 
      data: newMessage,
      message: 'Message sent successfully'
    });
    
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}