import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Message from '../../../../lib/models/Message';
import jwt from 'jsonwebtoken';

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
    
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
    
    // Create new message
    const newMessage = new Message({
      conversationId,
      content: message,
      sender: userId,
      senderType: sender === 'patient' ? 'Patient' : 'Doctor'
    });
    
    await newMessage.save();
    
    return NextResponse.json({ 
      success: true, 
      data: {
        id: newMessage._id,
        conversationId: newMessage.conversationId,
        content: newMessage.content,
        sender: newMessage.senderType,
        timestamp: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send message' 
    }, { status: 500 });
  }
}
