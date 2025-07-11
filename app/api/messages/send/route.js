import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Message, { Conversation } from '../../../../lib/models/Message';
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

// POST send message
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

    const { conversationId, content, messageType = 'text' } = await request.json();

    if (!conversationId || !content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Conversation ID and message content are required' },
        { status: 400 }
      );
    }

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user': decoded.userId,
      isActive: true
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Find recipient (other participant)
    const recipient = conversation.participants.find(
      p => p.user.toString() !== decoded.userId
    );

    if (!recipient) {
      return NextResponse.json(
        { success: false, message: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Create message
    const message = new Message({
      sender: decoded.userId,
      recipient: recipient.user,
      conversation: conversationId,
      content: content.trim(),
      messageType: messageType
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Populate for response
    await message.populate('sender', 'name email role specialization');
    await message.populate('recipient', 'name email role specialization');

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}