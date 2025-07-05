import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../../lib/mongodb';
import Message, { Conversation } from '../../../../../lib/models/Message';
import User from '../../../../../lib/models/User';

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

// GET messages in a conversation
export async function GET(request, { params }) {
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

    const { conversationId } = params;

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

    // Get messages in conversation
    const messages = await Message.find({
      conversation: conversationId
    })
    .populate('sender', 'name email role specialization')
    .populate('recipient', 'name email role specialization')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        recipient: decoded.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      data: messages,
      total: messages.length,
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST send message to conversation
export async function POST(request, { params }) {
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

    const { conversationId } = params;
    const { content, messageType = 'text' } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message content is required' },
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
